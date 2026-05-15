const Razorpay = require('razorpay');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class PaymentController {
    static async createOrder(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { courseId, amount } = req.body;
            const studentId = req.user.userId;

            // Verify course exists and get details
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Check if student already has a valid payment for this course
            const existingPayments = await Payment.getStudentPayments(studentId);
            const hasValidPayment = existingPayments.some(payment => 
                payment.course_id == courseId && payment.status === 'completed'
            );

            if (hasValidPayment) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already paid for this course'
                });
            }

            // Create Razorpay order
            const options = {
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                receipt: `receipt_${studentId}_${courseId}_${Date.now()}`,
                notes: {
                    studentId: studentId.toString(),
                    courseId: courseId.toString(),
                    courseName: course.title
                }
            };

            const order = await razorpay.orders.create(options);

            // Create payment record in database
            const paymentId = await Payment.create({
                studentId,
                courseId,
                razorpayOrderId: order.id,
                amount: amount,
                currency: 'INR',
                status: 'created',
                paymentMethod: 'razorpay'
            });
            console.log(order);
            res.json({
                success: true,
                message: 'Payment order created successfully',
                data: {
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    receipt: order.receipt,
                    paymentId,
                    keyId: process.env.RAZORPAY_KEY_ID
                }
            });

        } catch (error) {
            console.error('Create payment order error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while creating payment order'
            });
        }
    }

    static async verifyPayment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

            // Find payment record
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment record not found'
                });
            }

            // Ensure the order id belongs to this payment record
            if (payment.razorpay_order_id && razorpayOrderId !== payment.razorpay_order_id) {
                await Payment.updateStatus(paymentId, 'failed');
                return res.status(400).json({
                    success: false,
                    message: 'Order ID mismatch for this payment',
                    ...(process.env.NODE_ENV === 'development'
                        ? { debug: { expectedOrderId: payment.razorpay_order_id, receivedOrderId: razorpayOrderId } }
                        : {})
                });
            }

            // Verify payment signature
            const body = razorpayOrderId + '|' + razorpayPaymentId;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');
            // Note: keep verification deterministic; don't call Razorpay with hardcoded order IDs here.
            if (expectedSignature !== razorpaySignature) {
                await Payment.updateStatus(paymentId, 'failed');
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment signature',
                    ...(process.env.NODE_ENV === 'development'
                        ? {
                              debug: {
                                  expectedSignature,
                                  receivedSignature: razorpaySignature,
                                  razorpayOrderId,
                                  razorpayPaymentId
                              }
                          }
                        : {})
                });
            }
            // Verify payment with Razorpay
            try {
                let paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);

                // Depending on Razorpay/account settings, you may see 'authorized' before 'captured'.
                if (paymentDetails.status === 'authorized') {
                    try {
                        await razorpay.payments.capture(
                            razorpayPaymentId,
                            Math.round(Number(payment.amount) * 100),
                            payment.currency || 'INR'
                        );
                        paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);
                    } catch (captureError) {
                        await Payment.updateStatus(paymentId, 'failed');
                        return res.status(400).json({
                            success: false,
                            message: 'Payment authorized but capture failed',
                            error: captureError?.error?.description || captureError.message
                        });
                    }
                }

                if (paymentDetails.status !== 'captured') {
                    await Payment.updateStatus(paymentId, 'failed');
                    return res.status(400).json({
                        success: false,
                        message: `Payment not captured (status: ${paymentDetails.status})`
                    });
                }

                // Update payment record
                await Payment.updateStatus(paymentId, 'completed', {
                    razorpayPaymentId,
                    razorpaySignature
                });

                // Create enrollment after successful payment
                const { pool } = require('../config/database');
                // Make enrollment creation idempotent (unique key on student_id + course_id)
                await pool.query(
                    `INSERT INTO enrollments (student_id, course_id, status, request_date, approved_date)
                     VALUES (?, ?, 'approved', NOW(), NOW())
                     ON DUPLICATE KEY UPDATE
                       status = VALUES(status),
                       approved_date = NOW(),
                       updated_at = NOW()`,
                    [payment.student_id, payment.course_id]
                );

                res.json({
                    success: true,
                    message: 'Payment verified and enrollment created successfully',
                    data: {
                        paymentId,
                        status: 'completed',
                        enrollmentStatus: 'approved'
                    }
                });

            } catch (razorpayError) {
                console.error('Razorpay verification error:', razorpayError);
                await Payment.updateStatus(paymentId, 'failed');
                res.status(500).json({
                    success: false,
                    message: 'Payment verification failed',
                    error: razorpayError?.error?.description || razorpayError.message
                });
            }

        } catch (error) {
            console.error('Verify payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while verifying payment'
            });
        }
    }

    static async getPaymentDetails(req, res) {
        try {
            const { paymentId } = req.params;
            const userId = req.user.userId;

            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            // Check if user owns this payment or is admin
            if (payment.student_id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: payment
            });

        } catch (error) {
            console.error('Get payment details error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching payment details'
            });
        }
    }

    static async getStudentPayments(req, res) {
        try {
            const studentId = req.user.userId;
            const payments = await Payment.getStudentPayments(studentId);

            res.json({
                success: true,
                data: payments
            });

        } catch (error) {
            console.error('Get student payments error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching payments'
            });
        }
    }

    static async getCoursePayments(req, res) {
        try {
            const { courseId } = req.params;
            const payments = await Payment.getCoursePayments(courseId);

            res.json({
                success: true,
                data: payments
            });

        } catch (error) {
            console.error('Get course payments error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching course payments'
            });
        }
    }

    static async getPaymentStats(req, res) {
        try {
            const stats = await Payment.getPaymentStats();
            res.json({
                success: true,
                data: stats
            });

        } catch (error) {
            console.error('Get payment stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching payment statistics'
            });
        }
    }

    static async getRecentPayments(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const payments = await Payment.getRecentPayments(limit);

            res.json({
                success: true,
                data: payments
            });

        } catch (error) {
            console.error('Get recent payments error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching recent payments'
            });
        }
    }

    static async refundPayment(req, res) {
        try {
            const { paymentId } = req.params;

            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            if (payment.status !== 'completed') {
                return res.status(400).json({
                    success: false,
                    message: 'Only completed payments can be refunded'
                });
            }

            // Initiate refund with Razorpay
            try {
                const refund = await razorpay.payments.refund(payment.razorpay_payment_id, {
                    amount: payment.amount * 100 // Convert to paise
                });

                // Update payment status
                await Payment.updateStatus(paymentId, 'refunded');

                // Remove enrollment if exists
                const { pool } = require('../config/database');
                await pool.query(
                    'DELETE FROM enrollments WHERE student_id = ? AND course_id = ?',
                    [payment.student_id, payment.course_id]
                );

                res.json({
                    success: true,
                    message: 'Payment refunded successfully',
                    data: {
                        refundId: refund.id,
                        amount: refund.amount
                    }
                });

            } catch (razorpayError) {
                console.error('Razorpay refund error:', razorpayError);
                res.status(500).json({
                    success: false,
                    message: 'Refund processing failed'
                });
            }

        } catch (error) {
            console.error('Refund payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while processing refund'
            });
        }
    }
}

module.exports = PaymentController;
