const request = require('supertest');
const app = require('../app');

describe('API Routes & Error Handling', () => {
  it('GET /api/health should return 200 and health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('LLD Practice Platform API');
  });

  it('GET / should return service info and endpoint list', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('LLD Practice Platform Backend');
    expect(res.body.endpoints).toBeDefined();
  });

  it('GET /api/unknown-endpoint should return 404', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/attempts with missing problemId should return 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/problemId is required/);
  });

  it('POST /api/submissions with missing fields should return 400 with missing details', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({
        attemptId: '65f1a2b3c4d5e6f7a8b9c0d1'
        // missing structured text fields
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Incomplete structured submission/);
  });
});
