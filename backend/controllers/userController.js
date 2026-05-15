const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

class UserController {
    static async createAdmin(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { fullName, email, password } = req.body;

            const existing = await User.findByEmail(email);
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await User.create({
                fullName,
                email,
                password: hashedPassword,
                role: 'admin'
            });

            res.status(201).json({
                success: true,
                message: 'Admin created successfully',
                data: { id: userId, fullName, email, role: 'admin' }
            });
        } catch (error) {
            console.error('Create admin error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while creating admin'
            });
        }
    }

    static async getAllStudents(req, res) {
        try {
            const students = await User.getAllStudents();
            res.json({
                success: true,
                data: students
            });
        } catch (error) {
            console.error('Get students error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching students'
            });
        }
    }

    static async getStudentById(req, res) {
        try {
            const { id } = req.params;
            const student = await User.findByIdAndRole(id, 'student');
            
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const enrollments = await User.getStudentEnrollmentsWithDetails(id);
            student.enrollments = enrollments;

            res.json({
                success: true,
                data: student
            });
        } catch (error) {
            console.error('Get student details error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching student details'
            });
        }
    }

    static async getDashboardStats(req, res) {
        try {
            const stats = await User.getDashboardStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching dashboard statistics'
            });
        }
    }

    static async getStudentDashboardStats(req, res) {
        try {
            const { studentId } = req.query;
            
            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Student ID required'
                });
            }

            const stats = await User.getStudentDashboardStats(studentId);
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Get student dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching student dashboard statistics'
            });
        }
    }

    static async updateStudentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['active', 'inactive', 'suspended'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be active, inactive, or suspended'
                });
            }

            const updated = await User.updateStatus(id, status);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.json({
                success: true,
                message: `User ${status}d successfully`
            });
        } catch (error) {
            console.error('Update student status error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while updating student status'
            });
        }
    }

    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching user'
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { fullName, email, password } = req.body;

            // Check if user exists
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if email is already used by another user
            if (email && email !== user.email) {
                const emailExists = await User.checkEmailExists(email, id);
                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already in use by another user'
                    });
                }
            }

            const updated = await User.update(id, { fullName, email, password });
            if (!updated) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update user'
                });
            }

            res.json({
                success: true,
                message: 'User updated successfully'
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while updating user'
            });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Check if user exists and get role
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Prevent deletion of admin users
            if (user.role === 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete admin users'
                });
            }

            const deleted = await User.delete(id);
            if (!deleted) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete user'
                });
            }

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while deleting user'
            });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { fullName, email, currentPassword, newPassword } = req.body;

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Check if email is already used by another user
            if (email && email !== user.email) {
                const emailExists = await User.checkEmailExists(email, userId);
                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already in use by another user'
                    });
                }
            }

            const updated = await User.update(userId, { fullName, email, password: newPassword });
            if (!updated) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update profile'
                });
            }

            res.json({
                success: true,
                message: 'Profile updated successfully'
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while updating profile'
            });
        }
    }

    static async getStudentEnrollments(req, res) {
        try {
            const { studentId } = req.params;
            const enrollments = await User.getStudentEnrollments(studentId);
            res.json({
                success: true,
                data: enrollments
            });
        } catch (error) {
            console.error('Get student enrollments error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching student enrollments'
            });
        }
    }

    static async getMyEnrollments(req, res) {
        try {
            const enrollments = await User.getStudentEnrollments(req.user.userId);
            res.json({
                success: true,
                data: enrollments
            });
        } catch (error) {
            console.error('Get my enrollments error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching enrollments'
            });
        }
    }
}

module.exports = UserController;
