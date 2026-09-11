const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

router.post('/', submissionController.createSubmission);
router.get('/:id', submissionController.getSubmissionById);
router.get('/attempt/:attemptId', submissionController.getSubmissionsByAttempt);

module.exports = router;
