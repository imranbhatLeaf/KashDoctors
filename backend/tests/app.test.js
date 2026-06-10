const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

// Mock mongoose to avoid actual DB connection
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    connect: jest.fn().mockResolvedValue(true),
  };
});

describe('App Root', () => {
  it('should return 200 and the welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Doctor Appointment API is running...');
  });
});
