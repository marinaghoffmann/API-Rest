const request = require('supertest');
const app = require('../app');
const prisma = require('../config/prisma');

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'test@siapesq.com' } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'test@siapesq.com' } });
  await prisma.$disconnect();
});

describe('Auth endpoints', () => {
  it('POST /api/auth/register - should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Teste User',
      email: 'test@siapesq.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toHaveProperty('id');
  });

  it('POST /api/auth/register - should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Teste User',
      email: 'test@siapesq.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(409);
  });

  it('POST /api/auth/login - should return token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@siapesq.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('POST /api/auth/login - should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@siapesq.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
  });
});