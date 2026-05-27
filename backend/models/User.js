const { pool } = require('../config/database');

class User {
    static async findByEmail(email) {
        const [users] = await pool.query(
            'SELECT id, full_name, email, password, role, registration_date, status FROM users WHERE email = ?',
            [email]
        );
        return users[0] || null;
    }

    static async findById(id) {
        const [users] = await pool.query(
            'SELECT id, full_name, email, role, registration_date, status FROM users WHERE id = ?',
            [id]
        );
        return users[0] || null;
    }

    static async findByIdWithPassword(id) {
        const [users] = await pool.query(
            'SELECT id, full_name, email, password, role, registration_date, status FROM users WHERE id = ?',
            [id]
        );
        return users[0] || null;
    }

    static async findByEmailAndRole(email, role) {
        const [users] = await pool.query(
            'SELECT id, full_name, email, password, role FROM users WHERE email = ? AND role = ?',
            [email, role]
        );
        return users[0] || null;
    }

    static async create(userData) {
        const { fullName, email, password, role } = userData;
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [fullName, email, password, role]
        );
        return result.insertId;
    }

    static async getAllStudents() {
        const [students] = await pool.query(`
            SELECT 
                id,
                full_name,
                email,
                registration_date,
                status,
                (SELECT COUNT(*) FROM enrollments WHERE student_id = users.id) as enrollment_count
            FROM users 
            WHERE role = 'student'
            ORDER BY registration_date DESC
        `);
        return students;
    }

    static async updateStatus(userId, status) {
        const [result] = await pool.query(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, userId]
        );
        return result.affectedRows > 0;
    }

    static async getStudentEnrollments(studentId) {
        const [enrollments] = await pool.query(`
            SELECT 
                e.id,
                e.course_id,
                e.status,
                e.request_date,
                e.approved_date,
                e.rejected_date,
                e.progress_percentage,
                c.title,
                c.description,
                c.modules,
                c.duration_hours,
                c.instructor,
                c.link
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ? AND c.status = 'active'
            ORDER BY e.request_date DESC
        `, [studentId]);
        return enrollments;
    }

    static async getStudentEnrollmentsWithDetails(studentId) {
        const [enrollments] = await pool.query(`
            SELECT 
                e.id,
                e.status,
                e.request_date,
                e.approved_date,
                e.progress_percentage,
                c.title as course_title,
                c.modules,
                c.duration_hours
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ?
            ORDER BY e.request_date DESC
        `, [studentId]);
        return enrollments;
    }

    static async getDashboardStats() {
        const [studentCount] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "student"');
        const [courseCount] = await pool.query('SELECT COUNT(*) as count FROM courses WHERE status = "active"');
        const [pendingCount] = await pool.query('SELECT COUNT(*) as count FROM enrollments WHERE status = "pending"');
        const [approvedCount] = await pool.query('SELECT COUNT(*) as count FROM enrollments WHERE status = "approved"');

        return {
            totalStudents: studentCount[0].count,
            totalCourses: courseCount[0].count,
            pendingRequests: pendingCount[0].count,
            approvedEnrollments: approvedCount[0].count
        };
    }

    static async getStudentDashboardStats(studentId) {
        const [enrollments] = await pool.query(`
            SELECT 
                COUNT(*) as total_enrollments,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_enrollments,
                AVG(progress_percentage) as avg_progress
            FROM enrollments 
            WHERE student_id = ?
        `, [studentId]);

        return {
            totalEnrollments: enrollments[0].total_enrollments || 0,
            approvedEnrollments: enrollments[0].approved_enrollments || 0,
            avgProgress: Math.round(enrollments[0].avg_progress || 0)
        };
    }

    static async findByIdAndRole(id, role) {
        const [users] = await pool.query(
            'SELECT id, full_name, email, registration_date, status FROM users WHERE id = ? AND role = ?',
            [id, role]
        );
        return users[0] || null;
    }

    static async update(userId, updateData) {
        const { fullName, email, password } = updateData;
        let updateQuery = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
        let updateParams = [];
        
        if (fullName) {
            updateQuery += ', full_name = ?';
            updateParams.push(fullName);
        }
        
        if (email) {
            updateQuery += ', email = ?';
            updateParams.push(email);
        }
        
        if (password) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += ', password = ?';
            updateParams.push(hashedPassword);
        }
        
        updateQuery += ' WHERE id = ?';
        updateParams.push(userId);

        const [result] = await pool.query(updateQuery, updateParams);
        return result.affectedRows > 0;
    }

    static async checkEmailExists(email, excludeId = null) {
        let query = 'SELECT id FROM users WHERE email = ?';
        let params = [email];
        
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        
        const [users] = await pool.query(query, params);
        return users.length > 0;
    }

    static async delete(userId) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Delete user's enrollments first
            await connection.query('DELETE FROM enrollments WHERE student_id = ?', [userId]);
            
            // Delete user
            const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = User;
