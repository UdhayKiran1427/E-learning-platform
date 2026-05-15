const express = require('express');
const { body } = require('express-validator');
const CourseController = require('../controllers/courseController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', CourseController.getAllCourses);

// Get course by ID
router.get('/:id', CourseController.getCourseById);

// Add new course (Admin only)
router.post('/', authenticateToken, requireAdmin, [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('modules').isInt({ min: 1 }).withMessage('Modules must be at least 1'),
    body('durationHours').isInt({ min: 1 }).withMessage('Duration must be at least 1 hour'),
    body('instructor').trim().isLength({ min: 3 }).withMessage('Instructor name must be at least 3 characters'),
    body('link').optional().isURL().withMessage('Link must be a valid URL')
], CourseController.createCourse);

// Update course (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('modules').isInt({ min: 1 }).withMessage('Modules must be at least 1'),
    body('durationHours').isInt({ min: 1 }).withMessage('Duration must be at least 1 hour'),
    body('instructor').trim().isLength({ min: 3 }).withMessage('Instructor name must be at least 3 characters'),
    body('link').optional().isURL().withMessage('Link must be a valid URL')
], CourseController.updateCourse);

// Delete course (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, CourseController.deleteCourse);

// Get courses with enrollment stats (Admin only)
router.get('/stats/enrollments', authenticateToken, requireAdmin, CourseController.getCoursesWithStats);

module.exports = router;
