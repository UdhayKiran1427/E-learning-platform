const express = require('express');
const { body } = require('express-validator');
const PaymentController = require('../controllers/paymentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create payment order
router.post('/create-order', authenticateToken, [
    body('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Valid amount is required')
], PaymentController.createOrder);

// Verify payment
router.post('/verify', authenticateToken, [
    body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
    body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
    body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required'),
    body('paymentId').isInt({ min: 1 }).withMessage('Valid payment ID is required')
], PaymentController.verifyPayment);

// Get payment details
router.get('/:paymentId', authenticateToken, PaymentController.getPaymentDetails);

// Get student's payments
router.get('/my/payments', authenticateToken, PaymentController.getStudentPayments);

// Get course payments (Admin only)
router.get('/course/:courseId', authenticateToken, requireAdmin, PaymentController.getCoursePayments);

// Get payment statistics (Admin only)
router.get('/stats/admin', authenticateToken, requireAdmin, PaymentController.getPaymentStats);

// Get recent payments (Admin only)
router.get('/recent/admin', authenticateToken, requireAdmin, PaymentController.getRecentPayments);

// Refund payment (Admin only)
router.post('/:paymentId/refund', authenticateToken, requireAdmin, PaymentController.refundPayment);

module.exports = router;
