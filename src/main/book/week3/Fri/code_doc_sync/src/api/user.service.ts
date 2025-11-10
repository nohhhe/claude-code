/**
 * @fileoverview 사용자 관리를 담당하는 서비스 클래스
 * @module UserService
 */

import { User, UserRole } from './types';
import { UserNotFoundError, UnauthorizedError, ValidationError } from './errors';

/**
 * 사용자 생성 시 필요한 정보
 */
export interface CreateUserRequest {
  /** 이메일 주소 */
  email: string;
  /** 사용자명 */
  name: string;
  /** 비밀번호 */
  password: string;
  /** 사용자 역할 (기본값: 'user') */
  role?: UserRole;
}

/**
 * 사용자 업데이트 시 필요한 정보
 */
export interface UpdateUserRequest {
  /** 사용자명 */
  name?: string;
  /** 사용자 역할 */
  role?: UserRole;
  /** 활성 상태 */
  isActive?: boolean;
}

/**
 * 사용자 검색 필터
 */
export interface UserSearchFilter {
  /** 이메일로 검색 */
  email?: string;
  /** 역할로 필터링 */
  role?: UserRole;
  /** 활성 상태로 필터링 */
  isActive?: boolean;
  /** 생성일 범위 시작 */
  createdAfter?: Date;
  /** 생성일 범위 종료 */
  createdBefore?: Date;
}

/**
 * 페이지네이션 정보
 */
export interface PaginationOptions {
  /** 페이지 번호 (1부터 시작) */
  page?: number;
  /** 페이지 크기 */
  limit?: number;
  /** 정렬 필드 */
  sortBy?: keyof User;
  /** 정렬 방향 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 페이지네이션된 결과
 */
export interface PaginatedResult<T> {
  /** 데이터 배열 */
  data: T[];
  /** 총 항목 수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 페이지 크기 */
  limit: number;
  /** 총 페이지 수 */
  totalPages: number;
}

/**
 * 사용자 관리를 담당하는 서비스 클래스
 * 
 * 이 클래스는 사용자 CRUD 작업, 인증, 권한 관리 기능을 제공합니다.
 * 모든 메서드는 적절한 권한 검증과 에러 처리를 포함하고 있습니다.
 * 
 * @example
 * ```typescript
 * const userService = new UserService();
 * 
 * // 새 사용자 생성
 * const newUser = await userService.createUser({
 *   email: 'user@example.com',
 *   name: '김철수',
 *   password: 'securePassword123'
 * });
 * 
 * // 사용자 조회
 * const user = await userService.getUserById(newUser.userId);
 * ```
 * 
 * @since 1.0.0
 */
export class UserService {
  private readonly adminRole = 'admin';

  /**
   * UserService 생성자
   * 
   * @example
   * ```typescript
   * const userService = new UserService();
   * ```
   */
  constructor() {
    // 초기화 로직
  }

  /**
   * 새로운 사용자를 생성합니다
   * 
   * 이메일 중복 검증, 비밀번호 강도 검증을 수행하고,
   * 새로운 사용자 계정을 생성합니다.
   * 
   * @param userData - 사용자 생성 정보
   * @param requesterId - 요청자 ID (관리자 권한 필요)
   * @returns 생성된 사용자 정보를 포함하는 Promise
   * 
   * @throws {@link ValidationError} 입력 데이터가 유효하지 않을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * try {
   *   const newUser = await userService.createUser({
   *     email: 'newuser@example.com',
   *     name: '새사용자',
   *     password: 'SecurePass123!',
   *     role: 'user'
   *   }, 'ADMIN001');
   *   
   *   console.log('User created:', newUser.userId);
   * } catch (error) {
   *   if (error instanceof ValidationError) {
   *     console.error('Invalid user data:', error.message);
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 관리자 계정 생성
   * const adminUser = await userService.createUser({
   *   email: 'admin@company.com',
   *   name: '관리자',
   *   password: 'AdminPass123!',
   *   role: 'admin'
   * }, 'SUPERADMIN001');
   * ```
   * 
   * @since 1.0.0
   */
  async createUser(userData: CreateUserRequest, requesterId: string): Promise<User> {
    // 권한 검증
    await this.validateAdminPermission(requesterId);
    
    // 입력 데이터 검증
    this.validateUserData(userData);
    
    // 이메일 중복 검증
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError(`Email already exists: ${userData.email}`);
    }
    
    // 새 사용자 생성
    const userId = `USER${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    const newUser: User = {
      userId,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'user',
      createdAt: new Date(),
      isActive: true
    };
    
    return newUser;
  }

  /**
   * 사용자 ID로 사용자 정보를 조회합니다
   * 
   * @param userId - 조회할 사용자 ID
   * @param requesterId - 요청자 ID (본인 또는 관리자만 조회 가능)
   * @returns 사용자 정보를 포함하는 Promise
   * 
   * @throws {@link UserNotFoundError} 사용자를 찾을 수 없을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * try {
   *   const user = await userService.getUserById('USER123456789', 'USER123456789');
   *   console.log('User info:', {
   *     name: user.name,
   *     email: user.email,
   *     role: user.role,
   *     isActive: user.isActive
   *   });
   * } catch (error) {
   *   if (error instanceof UserNotFoundError) {
   *     console.error('User not found');
   *   }
   * }
   * ```
   * 
   * @since 1.0.0
   */
  async getUserById(userId: string, requesterId: string): Promise<User> {
    // 권한 검증 (본인 또는 관리자)
    await this.validateUserAccess(userId, requesterId);
    
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    
    return user;
  }

  /**
   * 이메일로 사용자 정보를 조회합니다
   * 
   * @param email - 조회할 이메일 주소
   * @param requesterId - 요청자 ID (관리자 권한 필요)
   * @returns 사용자 정보를 포함하는 Promise
   * 
   * @throws {@link UserNotFoundError} 사용자를 찾을 수 없을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * const user = await userService.getUserByEmail('user@example.com', 'ADMIN001');
   * console.log('Found user:', user.name);
   * ```
   * 
   * @since 1.0.0
   */
  async getUserByEmail(email: string, requesterId: string): Promise<User> {
    await this.validateAdminPermission(requesterId);
    
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UserNotFoundError(`Email: ${email}`);
    }
    
    return user;
  }

  /**
   * 사용자 정보를 업데이트합니다
   * 
   * @param userId - 업데이트할 사용자 ID
   * @param updateData - 업데이트할 데이터
   * @param requesterId - 요청자 ID
   * @returns 업데이트된 사용자 정보를 포함하는 Promise
   * 
   * @throws {@link UserNotFoundError} 사용자를 찾을 수 없을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * @throws {@link ValidationError} 업데이트 데이터가 유효하지 않을 때
   * 
   * @example
   * ```typescript
   * const updatedUser = await userService.updateUser('USER123', {
   *   name: '새로운 이름',
   *   isActive: true
   * }, 'ADMIN001');
   * 
   * console.log('User updated:', updatedUser.name);
   * ```
   * 
   * @example
   * ```typescript
   * // 사용자 역할 변경
   * const promotedUser = await userService.updateUser('USER123', {
   *   role: 'manager'
   * }, 'ADMIN001');
   * ```
   * 
   * @since 1.0.0
   */
  async updateUser(userId: string, updateData: UpdateUserRequest, requesterId: string): Promise<User> {
    // 사용자 존재 확인
    const user = await this.getUserById(userId, requesterId);
    
    // 권한 검증 (본인은 이름만 수정 가능, 관리자는 모든 필드 수정 가능)
    const isAdmin = await this.isAdmin(requesterId);
    const isSelf = userId === requesterId;
    
    if (!isAdmin && !isSelf) {
      throw new UnauthorizedError('Access denied');
    }
    
    if (!isAdmin && (updateData.role !== undefined || updateData.isActive !== undefined)) {
      throw new UnauthorizedError('Only admins can change role or active status');
    }
    
    // 업데이트 데이터 적용
    const updatedUser: User = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };
    
    return updatedUser;
  }

  /**
   * 사용자를 삭제합니다 (비활성화)
   * 
   * 실제로는 사용자 데이터를 삭제하지 않고 비활성화 처리합니다.
   * 
   * @param userId - 삭제할 사용자 ID
   * @param requesterId - 요청자 ID (관리자 권한 필요)
   * @returns 삭제 성공 여부를 포함하는 Promise
   * 
   * @throws {@link UserNotFoundError} 사용자를 찾을 수 없을 때
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * const success = await userService.deleteUser('USER123', 'ADMIN001');
   * if (success) {
   *   console.log('User successfully deactivated');
   * }
   * ```
   * 
   * @since 1.0.0
   */
  async deleteUser(userId: string, requesterId: string): Promise<boolean> {
    await this.validateAdminPermission(requesterId);
    
    // 사용자 존재 확인
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    
    // 비활성화 처리 (실제 삭제 대신)
    await this.updateUser(userId, { isActive: false }, requesterId);
    
    return true;
  }

  /**
   * 사용자 목록을 조회합니다 (페이지네이션 지원)
   * 
   * @param filter - 검색 필터
   * @param pagination - 페이지네이션 옵션
   * @param requesterId - 요청자 ID (관리자 권한 필요)
   * @returns 페이지네이션된 사용자 목록을 포함하는 Promise
   * 
   * @throws {@link UnauthorizedError} 권한이 없을 때
   * 
   * @example
   * ```typescript
   * // 모든 활성 사용자 조회
   * const result = await userService.getUsers(
   *   { isActive: true },
   *   { page: 1, limit: 10 },
   *   'ADMIN001'
   * );
   * 
   * console.log(`Found ${result.total} users`);
   * result.data.forEach(user => {
   *   console.log(`${user.name} (${user.email})`);
   * });
   * ```
   * 
   * @example
   * ```typescript
   * // 관리자만 조회
   * const admins = await userService.getUsers(
   *   { role: 'admin' },
   *   { page: 1, limit: 5 },
   *   'SUPERADMIN001'
   * );
   * ```
   * 
   * @since 1.0.0
   */
  async getUsers(
    filter: UserSearchFilter = {},
    pagination: PaginationOptions = {},
    requesterId: string
  ): Promise<PaginatedResult<User>> {
    await this.validateAdminPermission(requesterId);
    
    // 기본 페이지네이션 설정
    const page = pagination.page || 1;
    const limit = Math.min(pagination.limit || 10, 100); // 최대 100개
    const sortBy = pagination.sortBy || 'createdAt';
    const sortOrder = pagination.sortOrder || 'desc';
    
    // 모의 데이터 생성 (실제 구현에서는 데이터베이스 쿼리)
    const mockUsers = this.generateMockUsers(50, filter);
    
    // 정렬 적용
    mockUsers.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // 페이지네이션 적용
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = mockUsers.slice(startIndex, endIndex);
    
    return {
      data: paginatedUsers,
      total: mockUsers.length,
      page,
      limit,
      totalPages: Math.ceil(mockUsers.length / limit)
    };
  }

  /**
   * 사용자의 마지막 로그인 시간을 업데이트합니다
   * 
   * @param userId - 사용자 ID
   * @returns 업데이트 성공 여부를 포함하는 Promise
   * 
   * @example
   * ```typescript
   * await userService.updateLastLogin('USER123');
   * ```
   * 
   * @since 1.1.0
   */
  async updateLastLogin(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    
    // 마지막 로그인 시간 업데이트
    user.lastLoginAt = new Date();
    
    return true;
  }

  /**
   * 사용자가 관리자인지 확인하는 내부 메서드
   * 
   * @private
   * @param userId - 확인할 사용자 ID
   * @returns 관리자 여부
   */
  private async isAdmin(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    return user?.role === this.adminRole;
  }

  /**
   * 관리자 권한을 검증하는 내부 메서드
   * 
   * @private
   * @param requesterId - 요청자 ID
   * @throws {@link UnauthorizedError} 관리자가 아닐 때
   */
  private async validateAdminPermission(requesterId: string): Promise<void> {
    const isAdminUser = await this.isAdmin(requesterId);
    if (!isAdminUser) {
      throw new UnauthorizedError('Admin permission required');
    }
  }

  /**
   * 사용자 접근 권한을 검증하는 내부 메서드
   * 
   * @private
   * @param userId - 접근 대상 사용자 ID
   * @param requesterId - 요청자 ID
   * @throws {@link UnauthorizedError} 권한이 없을 때
   */
  private async validateUserAccess(userId: string, requesterId: string): Promise<void> {
    const isSelf = userId === requesterId;
    const isAdminUser = await this.isAdmin(requesterId);
    
    if (!isSelf && !isAdminUser) {
      throw new UnauthorizedError('Access denied');
    }
  }

  /**
   * 사용자 생성 데이터를 검증하는 내부 메서드
   * 
   * @private
   * @param userData - 검증할 사용자 데이터
   * @throws {@link ValidationError} 데이터가 유효하지 않을 때
   */
  private validateUserData(userData: CreateUserRequest): void {
    if (!userData.email || !userData.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }
    
    if (!userData.name || userData.name.length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }
    
    if (!userData.password || userData.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
  }

  /**
   * 사용자 ID로 사용자를 찾는 내부 메서드
   * 
   * @private
   * @param userId - 찾을 사용자 ID
   * @returns 사용자 정보 또는 null
   */
  private async findUserById(userId: string): Promise<User | null> {
    // 실제 구현에서는 데이터베이스 쿼리
    const userExists = Math.random() > 0.1; // 90% 확률로 사용자 존재
    
    if (!userExists) {
      return null;
    }
    
    return {
      userId,
      email: 'user@example.com',
      name: '테스트 사용자',
      role: userId.includes('ADMIN') ? 'admin' : 'user',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    };
  }

  /**
   * 이메일로 사용자를 찾는 내부 메서드
   * 
   * @private
   * @param email - 찾을 이메일
   * @returns 사용자 정보 또는 null
   */
  private async findUserByEmail(email: string): Promise<User | null> {
    // 실제 구현에서는 데이터베이스 쿼리
    if (email === 'existing@example.com') {
      return {
        userId: 'USER_EXISTING',
        email,
        name: '기존 사용자',
        role: 'user',
        createdAt: new Date(),
        isActive: true
      };
    }
    
    return null;
  }

  /**
   * 모의 사용자 데이터를 생성하는 내부 메서드
   * 
   * @private
   * @param count - 생성할 사용자 수
   * @param filter - 적용할 필터
   * @returns 모의 사용자 배열
   */
  private generateMockUsers(count: number, filter: UserSearchFilter): User[] {
    const users: User[] = [];
    const roles: UserRole[] = ['admin', 'user', 'manager', 'guest'];
    
    for (let i = 0; i < count; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const isActive = Math.random() > 0.2; // 80% 활성
      const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      
      const user: User = {
        userId: `USER${i.toString().padStart(3, '0')}`,
        email: `user${i}@example.com`,
        name: `사용자 ${i}`,
        role,
        createdAt,
        isActive,
        lastLoginAt: isActive ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
      };
      
      // 필터 적용
      if (filter.role && user.role !== filter.role) continue;
      if (filter.isActive !== undefined && user.isActive !== filter.isActive) continue;
      if (filter.email && !user.email.includes(filter.email)) continue;
      if (filter.createdAfter && user.createdAt < filter.createdAfter) continue;
      if (filter.createdBefore && user.createdAt > filter.createdBefore) continue;
      
      users.push(user);
    }
    
    return users;
  }
}