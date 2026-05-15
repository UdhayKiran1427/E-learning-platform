const { pool } = require('../config/database');

class Payment {
    static async create(paymentData) {
        const {
            studentId,
            courseId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount,
            currency,
            status,
            paymentMethod
        } = paymentData;

        const [result] = await pool.query(`
            INSERT INTO payments 
            (student_id, course_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, 
             amount, currency, status, payment_method, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            studentId,
            courseId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount,
            currency || 'INR',
            status || 'pending',
            paymentMethod || 'razorpay'
        ]);

        return result.insertId;
    }

    static async findById(paymentId) {
        const [payments] = await pool.query(`
            SELECT p.*, 
                   u.full_name as student_name,
                   u.email as student_email,
                   c.title as course_title,
                   c.description as course_description
            FROM payments p
            JOIN users u ON p.student_id = u.id
            JOIN courses c ON p.course_id = c.id
            WHERE p.id = ?
        `, [paymentId]);

        return payments[0] || null;
    }

    static async findByRazorpayOrderId(orderId) {
        const [payments] = await pool.query(`
            SELECT * FROM payments WHERE razorpay_order_id = ?
        `, [orderId]);

        return payments[0] || null;
    }

    static async findByRazorpayPaymentId(paymentId) {
        const [payments] = await pool.query(`
            SELECT * FROM payments WHERE razorpay_payment_id = ?
        `, [paymentId]);

        return payments[0] || null;
    }

    static async updateStatus(paymentId, status, additionalData = {}) {
        let updateQuery = 'UPDATE payments SET status = ?, updated_at = NOW()';
        let updateParams = [status];

        if (additionalData.razorpayPaymentId) {
            updateQuery += ', razorpay_payment_id = ?';
            updateParams.push(additionalData.razorpayPaymentId);
        }

        if (additionalData.razorpaySignature) {
            updateQuery += ', razorpay_signature = ?';
            updateParams.push(additionalData.razorpaySignature);
        }

        updateQuery += ' WHERE id = ?';
        updateParams.push(paymentId);

        const [result] = await pool.query(updateQuery, updateParams);
        return result.affectedRows > 0;
    }

    static async getStudentPayments(studentId) {
        const [payments] = await pool.query(`
            SELECT p.*, 
                   c.title as course_title,
                   c.description as course_description,
                   c.instructor
            FROM payments p
            JOIN courses c ON p.course_id = c.id
            WHERE p.student_id = ?
            ORDER BY p.created_at DESC
        `, [studentId]);

        return payments;
    }

    static async getCoursePayments(courseId) {
        const [payments] = await pool.query(`
            SELECT p.*, 
                   u.full_name as student_name,
                   u.email as student_email
            FROM payments p
            JOIN users u ON p.student_id = u.id
            WHERE p.course_id = ?
            ORDER BY p.created_at DESC
        `, [courseId]);

        return payments;
    }

    static async getPaymentStats() {
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total_payments,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
                SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue
            FROM payments
        `);

        return stats[0];
    }

    static async getRecentPayments(limit = 10) {
        const [payments] = await pool.query(`
            SELECT p.*, 
                   u.full_name as student_name,
                   c.title as course_title
            FROM payments p
            JOIN users u ON p.student_id = u.id
            JOIN courses c ON p.course_id = c.id
            ORDER BY p.created_at DESC
            LIMIT ?
        `, [limit]);

        return payments;
    }
}

module.exports = Payment;
