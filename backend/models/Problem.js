const mongoose = require('mongoose');

/**
 * RubricCriterion sub-schema.
 * Represents an individual evaluation dimension with target concepts and evaluation type.
 */
const rubricCriterionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  evaluationType: {
    type: String,
    enum: ['deterministic', 'ai'],
    required: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  guidance: {
    type: String,
    default: ''
  }
}, { _id: true });

/**
 * Problem schema.
 * Defines the LLD challenge, requirements, scenarios, constraints, and rubric criteria.
 */
const problemSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  scenarios: [{
    type: String
  }],
  constraints: [{
    type: String
  }],
  rubricCriteria: [rubricCriterionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);
