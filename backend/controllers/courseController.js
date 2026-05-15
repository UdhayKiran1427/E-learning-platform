const { validationResult } = require('express-validator');
const Course = require('../models/Course');

class CourseController {
    static async getAllCourses(req, res) {
        try {
            const courses = await Course.findAll();
            res.json({
                success: true,
                data: courses
            });
        } catch (error) {
            console.error('Get courses error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching courses'
            });
        }
    }

    static async getCourseById(req, res) {
        try {
            const courseId = req.params.id;
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            res.json({
                success: true,
                data: course
            });
        } catch (error) {
            console.error('Get course error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching course'
            });
        }
    }

    static async createCourse(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { title, description, modules, durationHours, instructor, link } = req.body;

            const courseId = await Course.create({
                title,
                description,
                modules,
                durationHours,
                instructor,
                link
            });

            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: {
                    id: courseId,
                    title,
                    description,
                    modules,
                    duration_hours: durationHours,
                    instructor,
                    link: link || null
                }
            });
        } catch (error) {
            console.error('Create course error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while creating course'
            });
        }
    }

    static async updateCourse(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const courseId = req.params.id;
            const { title, description, modules, durationHours, instructor, link } = req.body;

            // Check if course exists
            const courseExists = await Course.exists(courseId);
            if (!courseExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            const updated = await Course.update(courseId, {
                title,
                description,
                modules,
                durationHours,
                instructor,
                link
            });

            if (!updated) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update course'
                });
            }

            res.json({
                success: true,
                message: 'Course updated successfully',
                data: {
                    id: parseInt(courseId),
                    title,
                    description,
                    modules,
                    durationHours,
                    instructor,
                    link: link || null
                }
            });
        } catch (error) {
            console.error('Update course error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while updating course'
            });
        }
    }

    static async deleteCourse(req, res) {
        try {
            const courseId = req.params.id;

            // Check if course exists
            const courseExists = await Course.exists(courseId);
            if (!courseExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            const deleted = await Course.softDelete(courseId);
            if (!deleted) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete course'
                });
            }

            res.json({
                success: true,
                message: 'Course deleted successfully'
            });
        } catch (error) {
            console.error('Delete course error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while deleting course'
            });
        }
    }

    static async getCoursesWithStats(req, res) {
        try {
            const courses = await Course.getWithEnrollmentCount();
            res.json({
                success: true,
                data: courses
            });
        } catch (error) {
            console.error('Get courses with stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching courses with stats'
            });
        }
    }
}

module.exports = CourseController;
