const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();

// CORS configuration supporting process.env.CLIENT_URL
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://lld-practice.netlify.app',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server health checks, curl, mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow origin fallback
  },
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount API router
app.use('/api', apiRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'LLD Practice Platform Backend',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      problems: '/api/problems',
      attempts: '/api/attempts',
      submissions: '/api/submissions'
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
