const request = require('supertest');
const express = require('express');
const app = express();

// Mock routes for simple unit tests or import real app if configured for testing
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('GET /api/health', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });
});
