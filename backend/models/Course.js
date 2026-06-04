const { pool } = require('../config/database');

class Course {
    static async findAll() {
        const [courses] = await pool.query(
            'SELECT * FROM courses ORDER BY title'
        );
        return courses;
    }

    static async findById(id) {
        const [courses] = await pool.query(
            'SELECT * FROM courses WHERE id = ?',
            [id]
        );
        return courses[0] || null;
    }

    static async create(courseData) {
        const { title, description, modules, durationHours, instructor, link } = courseData;
        const [result] = await pool.query(
            'INSERT INTO courses (title, description, modules, duration_hours, instructor, link) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, modules, durationHours, instructor, link || null]
        );
        return result.insertId;
    }

    static async update(id, courseData) {
        const { title, description, modules, durationHours, instructor, link } = courseData;
        const [result] = await pool.query(
            'UPDATE courses SET title = ?, description = ?, modules = ?, duration_hours = ?, instructor = ?, link = ? WHERE id = ?',
            [title, description, modules, durationHours, instructor, link || null, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.query(
            'UPDATE courses SET status = "inactive" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async exists(id) {
        const [courses] = await pool.query('SELECT id FROM courses WHERE id = ?', [id]);
        return courses.length > 0;
    }

    static async getEnrollmentStats(courseId) {
        const [stats] = await pool.query(
            'SELECT COUNT(*) as enrollment_count FROM enrollments WHERE course_id = ?',
            [courseId]
        );
        return stats[0].enrollment_count;
    }

    static async getWithEnrollmentCount() {
        const [courses] = await pool.query(`
            SELECT 
                c.*,
                COUNT(e.id) as enrollment_count
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            GROUP BY c.id
            ORDER BY c.title
        `);
        return courses;
    }
}

module.exports = Course;
