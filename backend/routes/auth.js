const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register endpoint
router.post('/register', [
    body('fullName').trim().isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    // Public registration is student-only. Admin users can only be created by an existing admin.
    body('role').optional().custom(() => true),
    body('adminCode').optional().custom(() => true)
], AuthController.register);

// Login endpoint
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], AuthController.login);

// Get current user profile
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;
