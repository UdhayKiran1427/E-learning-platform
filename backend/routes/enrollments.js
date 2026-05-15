const express = require('express');
const { body } = require('express-validator');
const PaymentController = require('../controllers/paymentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Enroll in course with payment (students only)
router.post('/course/:courseId', authenticateToken, [
    body('amount').isFloat({ min: 1 }).withMessage('Valid payment amount is required')
], PaymentController.createOrder);

// Get enrollment status
router.get('/course/:courseId/status', authenticateToken, async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.userId;

        const { pool } = require('../config/database');
        const [enrollments] = await pool.query(
            'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
            [studentId, courseId]
        );

        const Payment = require('../models/Payment');
        const payments = await Payment.getStudentPayments(studentId);
        const paymentForCourse = payments.find(p => p.course_id == courseId);

        res.json({
            success: true,
            data: {
                enrollment: enrollments[0] || null,
                payment: paymentForCourse || null,
                isEnrolled: enrollments.length > 0 && enrollments[0].status === 'approved',
                hasPaid: paymentForCourse && paymentForCourse.status === 'completed'
            }
        });

    } catch (error) {
        console.error('Get enrollment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching enrollment status'
        });
    }
});

// Get all enrollments (Admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { pool } = require('../config/database');
        const [enrollments] = await pool.query(`
            SELECT 
                e.*,
                u.full_name as student_name,
                u.email as student_email,
                c.title as course_title,
                c.instructor
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            JOIN courses c ON e.course_id = c.id
            ORDER BY e.request_date DESC
        `);

        res.json({
            success: true,
            data: enrollments
        });

    } catch (error) {
        console.error('Get all enrollments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching enrollments'
        });
    }
});

// Update enrollment status (Admin only)
router.put('/:enrollmentId/status', authenticateToken, requireAdmin, [
    body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { status } = req.body;

        const { pool } = require('../config/database');
        const [result] = await pool.query(
            'UPDATE enrollments SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, enrollmentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        res.json({
            success: true,
            message: 'Enrollment status updated successfully'
        });

    } catch (error) {
        console.error('Update enrollment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating enrollment status'
        });
    }
});

module.exports = router;
