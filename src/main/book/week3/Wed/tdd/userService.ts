// ============================================
// 타입 정의
// ============================================

export interface User {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: Date;
}

export type UserPublic = Omit<User, 'password'>;

export interface RegisterUserDto {
  readonly email: string;
  readonly password: string;
}

// ============================================
// 에러 타입 정의 (타입 안정성 강화)
// ============================================

export const UserErrorCode = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  REPOSITORY_ERROR: 'REPOSITORY_ERROR',
} as const;

export type UserErrorCodeType = typeof UserErrorCode[keyof typeof UserErrorCode];

export class UserError extends Error {
  constructor(
    public readonly code: UserErrorCodeType,
    message: string
  ) {
    super(message);
    this.name = 'UserError';
  }
}

// ============================================
// Result 타입 패턴 (에러 핸들링 개선)
// ============================================

export type Result<T, E = UserError> =
  | { success: true; data: T }
  | { success: false; error: E };

export const Result = {
  ok<T>(data: T): Result<T, never> {
    return { success: true, data };
  },
  fail<E>(error: E): Result<never, E> {
    return { success: false, error };
  },
};

// ============================================
// 의존성 인터페이스 (의존성 주입)
// ============================================

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  generateId(): string;
}

export interface IEmailValidator {
  isValid(email: string): boolean;
}

export interface IPasswordValidator {
  isStrong(password: string): boolean;
  getRequirements(): string;
}

// ============================================
// 기본 구현체
// ============================================

export class BcryptPasswordHasher implements IPasswordHasher {
  constructor(private readonly saltRounds: number = 10) {}

  async hash(password: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    return bcrypt.default.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return bcrypt.default.compare(password, hashedPassword);
  }
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 테스트용 헬퍼 메서드
  clear(): void {
    this.users.clear();
  }
}

export class DefaultEmailValidator implements IEmailValidator {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  isValid(email: string): boolean {
    return this.emailRegex.test(email);
  }
}

export class DefaultPasswordValidator implements IPasswordValidator {
  isStrong(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  getRequirements(): string {
    return 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }
}

// ============================================
// UserService (의존성 주입 적용)
// ============================================

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly emailValidator: IEmailValidator = new DefaultEmailValidator(),
    private readonly passwordValidator: IPasswordValidator = new DefaultPasswordValidator()
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<Result<UserPublic>> {
    // 이메일 유효성 검사
    if (!this.emailValidator.isValid(dto.email)) {
      return Result.fail(
        new UserError(UserErrorCode.INVALID_EMAIL_FORMAT, 'Invalid email format')
      );
    }

    // 비밀번호 강도 검사
    if (!this.passwordValidator.isStrong(dto.password)) {
      return Result.fail(
        new UserError(UserErrorCode.WEAK_PASSWORD, this.passwordValidator.getRequirements())
      );
    }

    // 중복 이메일 검사
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      return Result.fail(
        new UserError(UserErrorCode.EMAIL_ALREADY_EXISTS, 'Email already exists')
      );
    }

    // 비밀번호 해싱 및 사용자 생성
    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const newUser: User = {
      id: this.userRepository.generateId(),
      email: dto.email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await this.userRepository.save(newUser);

    // 비밀번호 제외한 사용자 정보 반환
    const { password: _, ...userPublic } = newUser;
    return Result.ok(userPublic);
  }

  async findUserByEmail(email: string): Promise<UserPublic | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const { password: _, ...userPublic } = user;
    return userPublic;
  }
}

// ============================================
// 팩토리 함수 (편의성)
// ============================================

export function createUserService(
  repository?: IUserRepository,
  hasher?: IPasswordHasher
): UserService {
  return new UserService(
    repository ?? new InMemoryUserRepository(),
    hasher ?? new BcryptPasswordHasher()
  );
}
