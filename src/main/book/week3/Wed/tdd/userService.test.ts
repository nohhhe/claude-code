import {
  UserService,
  UserError,
  UserErrorCode,
  IPasswordHasher,
  IUserRepository,
  IEmailValidator,
  IPasswordValidator,
  User,
  InMemoryUserRepository,
} from './userService';

// ============================================
// Mock 구현체 (테스트용)
// ============================================

class MockPasswordHasher implements IPasswordHasher {
  private hashPrefix = 'hashed_';

  async hash(password: string): Promise<string> {
    return `${this.hashPrefix}${password}`;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return hashedPassword === `${this.hashPrefix}${password}`;
  }
}

class MockEmailValidator implements IEmailValidator {
  private validEmails = new Set<string>();
  private defaultValid = true;

  setValid(valid: boolean): void {
    this.defaultValid = valid;
  }

  addValidEmail(email: string): void {
    this.validEmails.add(email);
  }

  isValid(email: string): boolean {
    if (this.validEmails.size > 0) {
      return this.validEmails.has(email);
    }
    return this.defaultValid;
  }
}

class MockPasswordValidator implements IPasswordValidator {
  private strongPasswords = new Set<string>();
  private defaultStrong = true;

  setStrong(strong: boolean): void {
    this.defaultStrong = strong;
  }

  addStrongPassword(password: string): void {
    this.strongPasswords.add(password);
  }

  isStrong(password: string): boolean {
    if (this.strongPasswords.size > 0) {
      return this.strongPasswords.has(password);
    }
    return this.defaultStrong;
  }

  getRequirements(): string {
    return 'Password must be at least 8 characters';
  }
}

// ============================================
// 테스트 헬퍼
// ============================================

function createTestUserService(overrides?: {
  repository?: IUserRepository;
  hasher?: IPasswordHasher;
  emailValidator?: IEmailValidator;
  passwordValidator?: IPasswordValidator;
}): {
  userService: UserService;
  repository: InMemoryUserRepository;
  hasher: MockPasswordHasher;
  emailValidator: MockEmailValidator;
  passwordValidator: MockPasswordValidator;
} {
  const repository = (overrides?.repository as InMemoryUserRepository) ?? new InMemoryUserRepository();
  const hasher = (overrides?.hasher as MockPasswordHasher) ?? new MockPasswordHasher();
  const emailValidator = (overrides?.emailValidator as MockEmailValidator) ?? new MockEmailValidator();
  const passwordValidator = (overrides?.passwordValidator as MockPasswordValidator) ?? new MockPasswordValidator();

  const userService = new UserService(repository, hasher, emailValidator, passwordValidator);

  return { userService, repository, hasher, emailValidator, passwordValidator };
}

// ============================================
// 테스트
// ============================================

describe('UserService', () => {
  describe('registerUser', () => {
    describe('성공 케이스', () => {
      it('유효한 데이터로 새 사용자를 등록할 수 있다', async () => {
        const { userService } = createTestUserService();
        const userData = {
          email: 'test@example.com',
          password: 'SecurePass123!',
        };

        const result = await userService.registerUser(userData);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.email).toBe(userData.email);
          expect(result.data.id).toBeDefined();
          expect(result.data.createdAt).toBeInstanceOf(Date);
          // 비밀번호는 반환되지 않음
          expect((result.data as unknown as { password?: string }).password).toBeUndefined();
        }
      });

      it('등록된 사용자의 비밀번호는 해싱되어 저장된다', async () => {
        const { userService, repository, hasher } = createTestUserService();
        const userData = {
          email: 'test@example.com',
          password: 'SecurePass123!',
        };

        await userService.registerUser(userData);

        const savedUser = await repository.findByEmail(userData.email);
        expect(savedUser).not.toBeNull();
        expect(savedUser!.password).not.toBe(userData.password);
        expect(await hasher.compare(userData.password, savedUser!.password)).toBe(true);
      });
    });

    describe('이메일 중복 검사', () => {
      it('이미 존재하는 이메일로 등록 시 실패한다', async () => {
        const { userService } = createTestUserService();

        await userService.registerUser({
          email: 'test@example.com',
          password: 'FirstPass123!',
        });

        const result = await userService.registerUser({
          email: 'test@example.com',
          password: 'SecondPass456!',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeInstanceOf(UserError);
          expect(result.error.code).toBe(UserErrorCode.EMAIL_ALREADY_EXISTS);
          expect(result.error.message).toBe('Email already exists');
        }
      });
    });

    describe('이메일 유효성 검사', () => {
      it('잘못된 형식의 이메일로 등록 시 실패한다', async () => {
        const { userService, emailValidator } = createTestUserService();
        emailValidator.setValid(false);

        const result = await userService.registerUser({
          email: 'invalid-email',
          password: 'SecurePass123!',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe(UserErrorCode.INVALID_EMAIL_FORMAT);
        }
      });
    });

    describe('비밀번호 강도 검사', () => {
      it('약한 비밀번호로 등록 시 실패한다', async () => {
        const { userService, passwordValidator } = createTestUserService();
        passwordValidator.setStrong(false);

        const result = await userService.registerUser({
          email: 'test@example.com',
          password: 'weak',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe(UserErrorCode.WEAK_PASSWORD);
        }
      });
    });
  });

  describe('findUserByEmail', () => {
    it('존재하는 사용자를 이메일로 찾을 수 있다', async () => {
      const { userService } = createTestUserService();
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      await userService.registerUser(userData);
      const foundUser = await userService.findUserByEmail(userData.email);

      expect(foundUser).not.toBeNull();
      expect(foundUser!.email).toBe(userData.email);
      expect((foundUser as unknown as { password?: string }).password).toBeUndefined();
    });

    it('존재하지 않는 이메일로 검색 시 null을 반환한다', async () => {
      const { userService } = createTestUserService();

      const foundUser = await userService.findUserByEmail('nonexistent@example.com');

      expect(foundUser).toBeNull();
    });
  });
});

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it('사용자를 저장하고 이메일로 찾을 수 있다', async () => {
    const user: User = {
      id: 'test-id',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
    };

    await repository.save(user);
    const found = await repository.findByEmail(user.email);

    expect(found).toEqual(user);
  });

  it('존재하지 않는 이메일은 null을 반환한다', async () => {
    const found = await repository.findByEmail('nonexistent@example.com');
    expect(found).toBeNull();
  });

  it('고유한 ID를 생성한다', () => {
    const id1 = repository.generateId();
    const id2 = repository.generateId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^user_\d+_[a-z0-9]+$/);
  });

  it('clear()로 모든 사용자를 삭제할 수 있다', async () => {
    const user: User = {
      id: 'test-id',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
    };

    await repository.save(user);
    repository.clear();
    const found = await repository.findByEmail(user.email);

    expect(found).toBeNull();
  });
});

describe('Result 타입 패턴', () => {
  it('성공 결과를 타입 안전하게 처리할 수 있다', async () => {
    const { userService } = createTestUserService();

    const result = await userService.registerUser({
      email: 'test@example.com',
      password: 'SecurePass123!',
    });

    // 타입 가드를 통한 안전한 접근
    if (result.success) {
      // TypeScript가 result.data의 타입을 UserPublic으로 추론
      const email: string = result.data.email;
      expect(email).toBe('test@example.com');
    } else {
      fail('Expected success');
    }
  });

  it('실패 결과를 타입 안전하게 처리할 수 있다', async () => {
    const { userService, emailValidator } = createTestUserService();
    emailValidator.setValid(false);

    const result = await userService.registerUser({
      email: 'invalid',
      password: 'SecurePass123!',
    });

    // 타입 가드를 통한 안전한 접근
    if (!result.success) {
      // TypeScript가 result.error의 타입을 UserError로 추론
      const code: string = result.error.code;
      expect(code).toBe(UserErrorCode.INVALID_EMAIL_FORMAT);
    } else {
      fail('Expected failure');
    }
  });
});
