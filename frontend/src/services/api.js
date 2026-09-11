const BASE_URL = '/api';

export const api = {
  async checkHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  async getProblems() {
    const res = await fetch(`${BASE_URL}/problems`);
    const data = await res.json();
    return data.data || [];
  },

  async getProblem(idOrSlug) {
    const res = await fetch(`${BASE_URL}/problems/${idOrSlug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch problem');
    return data.data;
  },

  async startAttempt(problemId, learnerId = 'guest_learner') {
    const res = await fetch(`${BASE_URL}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId, learnerId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to start attempt');
    return data.data;
  },

  async getAttempt(attemptId) {
    const res = await fetch(`${BASE_URL}/attempts/${attemptId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load attempt');
    return data.data;
  },

  async submitDesign(submissionData) {
    const res = await fetch(`${BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit design');
    return data.data;
  },

  async getSubmissionsByAttempt(attemptId) {
    const res = await fetch(`${BASE_URL}/submissions/attempt/${attemptId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load submissions');
    return data.data || [];
  }
};
