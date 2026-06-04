const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ["https://e-learning-platform-woad.vercel.app/","https://e-learning-platform-6fiex5rox-udhaykiran1427s-projects.vercel.app/"];
// Middleware
app.use(cors({
    origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list, or use a regex to match all Vercel previews
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'public'))); // Also serve from root

// Import routes
const authRoutes = require('./backend/routes/auth');
const courseRoutes = require('./backend/routes/courses');
const enrollmentRoutes = require('./backend/routes/enrollments');
const userRoutes = require('./backend/routes/users');
const paymentRoutes = require('./backend/routes/payments');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Serve React app - Fixed routing
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
    // Don't handle API routes here
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Initialize database and create tables
const { initializeDatabase, testConnection } = require('./backend/config/database');

// Test database connection and initialize tables
testConnection().then(() => {
    initializeDatabase().then(() => {
        console.log('🗄️ Database initialized successfully');
    }).catch(err => {
        console.error('❌ Database initialization failed:', err);
    });
}).catch(err => {
    console.error('❌ Database connection failed:', err);
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
});

module.exports = app;
