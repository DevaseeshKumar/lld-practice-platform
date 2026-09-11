const Problem = require('../models/Problem');

/**
 * Problem Controller
 * 
 * Handles listing problems and retrieving problem details with rubrics.
 */

// GET /api/problems
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).sort({ createdAt: 1 });
    
    return res.status(200).json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve problems',
      error: error.message
    });
  }
};

// GET /api/problems/:idOrSlug
const getProblemByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let problem;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await Problem.findById(idOrSlug);
    }

    if (!problem) {
      problem = await Problem.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem not found for identifier: ${idOrSlug}`
      });
    }

    return res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve problem details',
      error: error.message
    });
  }
};

module.exports = {
  getAllProblems,
  getProblemByIdOrSlug
};
