const request = require('supertest');
const app = require('../../src/index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up test database
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  // Clean up and close connections
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up before each test
  await prisma.user.deleteMany({});
});

describe('API Integration Tests', () => {
  describe('GET /', () => {
    test('should return hello world message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toEqual({
        message: 'Hello World!',
        status: 'ok'
      });
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Users API', () => {
    test('should get empty users list initially', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.id).toBeDefined();
    });

    test('should get users after creating one', async () => {
      // Create a user first
      await request(app)
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com'
        });

      // Get users
      const response = await request(app)
        .get('/users')
        .expect(200);
      
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Jane Doe');
      expect(response.body[0].email).toBe('jane@example.com');
    });
  });
});