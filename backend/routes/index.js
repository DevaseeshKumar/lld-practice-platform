const express = require('express');
const router = express.Router();

const problemRoutes = require('./problemRoutes');
const attemptRoutes = require('./attemptRoutes');
const submissionRoutes = require('./submissionRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LLD Practice Platform API'
  });
});

// Resource routes
router.use('/problems', problemRoutes);
router.use('/attempts', attemptRoutes);
router.use('/submissions', submissionRoutes);

module.exports = router;
