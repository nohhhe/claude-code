import request from 'supertest';
import { app } from './app';
import { prisma } from './lib/prisma';

// Mock Prisma
jest.mock('./lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('/api/users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Pass123!',
      };

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        password: 'hashed',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid',
        name: 'Test User',
        password: 'Pass123!',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });

    it('should return 409 for duplicate email', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'existing@example.com',
          name: 'Test User',
          password: 'Pass123!',
        })
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: '123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Password must be at least 6 characters');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      }));
    });

    it('should return 404 for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect(400);

      expect(response.body.error).toBe('Invalid user ID');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      const mockUpdatedUser = {
        id: 1,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
      }));
    });

    it('should return 404 for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/users/999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should return 400 for invalid email format', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });

    it('should return 409 for duplicate email on update', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.update as jest.Mock).mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'existing@example.com' })
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });

    it('should update password and hash it', async () => {
      const updateData = {
        password: 'NewPass123!',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
      });

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);

      expect(response.body).not.toHaveProperty('password');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          password: 'hashed_NewPass123!',
        }),
      });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .delete('/api/users/1')
        .expect(200);

      expect(response.body.message).toBe('User deleted successfully');
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/users/999')
        .expect(404);

      expect(response.body.error).toBe('User not found');
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .delete('/api/users/invalid')
        .expect(400);

      expect(response.body.error).toBe('Invalid user ID');
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should handle database error gracefully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/users/1')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle database connection errors', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/users/1')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
    });

    it('should sanitize user input in responses', async () => {
      const userData = {
        email: 'test@example.com',
        name: '<script>alert("xss")</script>',
        password: 'Pass123!',
      };

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: userData.email,
        name: 'alert("xss")', // sanitized name
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.name).toBe('alert("xss")');
    });

    it('should handle very large payloads', async () => {
      const largeData = {
        email: 'test@example.com',
        name: 'A'.repeat(10000),
        password: 'Pass123!',
      };

      const response = await request(app)
        .post('/api/users')
        .send(largeData)
        .expect(400);

      expect(response.body.error).toContain('too large');
    });
  });
});