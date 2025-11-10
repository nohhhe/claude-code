const { add, multiply, validateEmail, formatUser } = require('../../src/utils');

describe('Utils', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(add(-1, -2)).toBe(-3);
    });

    test('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    test('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
    });
  });

  describe('validateEmail', () => {
    test('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });

    test('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatUser', () => {
    test('should format user object correctly', () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date('2023-01-01'),
        password: 'secret'
      };

      const formatted = formatUser(user);
      
      expect(formatted).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date('2023-01-01')
      });
      expect(formatted.password).toBeUndefined();
    });
  });
});