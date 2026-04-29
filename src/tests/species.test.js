const request = require('supertest');
const app = require('../app');
const prisma = require('../config/prisma');

let token;
let createdId;

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'species_test@siapesq.com' } });
  await prisma.species.deleteMany({ where: { scientificName: 'Testus specius' } });

  await request(app).post('/api/auth/register').send({
    name: 'Species Tester',
    email: 'species_test@siapesq.com',
    password: '123456',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'species_test@siapesq.com',
    password: '123456',
  });

  token = res.body.data.token;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'species_test@siapesq.com' } });
  if (createdId) {
    await prisma.species.deleteMany({ where: { id: createdId } });
  }
  await prisma.$disconnect();
});

describe('Species endpoints', () => {
  it('GET /api/species - should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/species');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/species - should create a species', async () => {
    const res = await request(app)
      .post('/api/species')
      .set('Authorization', `Bearer ${token}`)
      .send({
        commonName: 'Espécie Teste',
        scientificName: 'Testus specius',
        category: 'ave',
        latitude: -8.05,
        longitude: -34.9,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.species).toHaveProperty('id');
    createdId = res.body.data.species.id;
  });

  it('GET /api/species - should list species', async () => {
    const res = await request(app)
      .get('/api/species')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.species)).toBe(true);
  });

  it('GET /api/species?category=ave - should filter by category', async () => {
    const res = await request(app)
      .get('/api/species?category=ave')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    res.body.data.species.forEach((s) => expect(s.category).toBe('ave'));
  });

  it('GET /api/species/stats - should return statistics', async () => {
    const res = await request(app)
      .get('/api/species/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('byCategory');
  });
});