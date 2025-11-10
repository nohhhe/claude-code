import { UserService } from './userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('registerUser', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      const result = await userService.registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe(userData.email);
      expect(result.user?.password).not.toBe(userData.password); // 해싱 확인
    });

    it('should reject duplicate email', async () => {
      await userService.registerUser({
        email: 'test@example.com',
        password: 'Pass123!'
      });

      const result = await userService.registerUser({
        email: 'test@example.com',
        password: 'AnotherPass123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already exists');
    });
  });
});