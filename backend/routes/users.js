const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all students (Admin only)
router.get('/students', authenticateToken, requireAdmin, UserController.getAllStudents);

// Get student details with enrollments (Admin only)
router.get('/students/:id', authenticateToken, requireAdmin, UserController.getStudentById);

// Get dashboard statistics (Admin only)
router.get('/dashboard/stats', authenticateToken, requireAdmin, UserController.getDashboardStats);

// Create admin user (Admin only)
router.post('/admins', authenticateToken, requireAdmin, [
    body('fullName').trim().isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], UserController.createAdmin);

// Get student dashboard statistics
router.get('/student/dashboard/stats', UserController.getStudentDashboardStats);

// Deactivate user (Admin only)
router.put('/users/:id/deactivate', authenticateToken, requireAdmin, (req, res) => {
    req.body.status = 'inactive';
    UserController.updateStudentStatus(req, res);
});

// Activate user (Admin only)
router.put('/users/:id/activate', authenticateToken, requireAdmin, (req, res) => {
    req.body.status = 'active';
    UserController.updateStudentStatus(req, res);
});

// Get user by ID (Admin only)
router.get('/:id', authenticateToken, requireAdmin, UserController.getUserById);

// Update user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, UserController.updateUser);

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, UserController.deleteUser);

// Update user profile (authenticated user)
router.put('/profile', authenticateToken, UserController.updateProfile);

// Get student enrollments (Admin only)
router.get('/:studentId/enrollments', authenticateToken, requireAdmin, UserController.getStudentEnrollments);

// Get my enrollments (authenticated student)
router.get('/my/enrollments', authenticateToken, UserController.getMyEnrollments);

module.exports = router;
