const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');

router.post('/', attemptController.startAttempt);
router.get('/:id', attemptController.getAttemptById);
router.get('/problem/:problemId', attemptController.getAttemptsByProblem);

module.exports = router;
