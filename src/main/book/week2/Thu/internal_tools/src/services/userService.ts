export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  {
    id: 1,
    name: '김철수',
    email: 'kim.cheolsu@company.com',
    phone: '010-1234-5678',
    department: '개발팀',
    role: 'Senior Developer',
    joinDate: '2022-03-15',
    status: 'active'
  },
  {
    id: 2,
    name: '이영희',
    email: 'lee.younghee@company.com',
    phone: '010-9876-5432',
    department: '디자인팀',
    role: 'UI/UX Designer',
    joinDate: '2023-01-20',
    status: 'active'
  },
  {
    id: 3,
    name: '박민수',
    email: 'park.minsu@company.com',
    phone: '010-5555-7777',
    department: '마케팅팀',
    role: 'Marketing Manager',
    joinDate: '2021-08-10',
    status: 'inactive'
  },
  {
    id: 4,
    name: '정수연',
    email: 'jung.suyeon@company.com',
    phone: '010-3333-9999',
    department: '개발팀',
    role: 'Frontend Developer',
    joinDate: '2023-06-01',
    status: 'active'
  }
];

interface ApiError extends Error {
  code?: string;
  status?: number;
}

const createApiError = (message: string, code?: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.code = code;
  error.status = status;
  return error;
};

const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw createApiError(
          `API call failed after ${maxAttempts} attempts: ${lastError.message}`,
          'MAX_RETRIES_EXCEEDED',
          500
        );
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

export const getUserData = async (userId?: number): Promise<User | User[]> => {
  return retry(async () => {
    return new Promise<User | User[]>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simulate random network failures (20% chance)
          if (Math.random() < 0.2) {
            reject(createApiError('Network timeout', 'NETWORK_TIMEOUT', 408));
            return;
          }

          if (userId !== undefined) {
            // Validate userId
            if (!Number.isInteger(userId) || userId <= 0) {
              reject(createApiError('Invalid user ID provided', 'INVALID_USER_ID', 400));
              return;
            }

            const user = mockUsers.find(u => u.id === userId);
            if (user) {
              resolve(user);
            } else {
              reject(createApiError(
                `User with ID ${userId} not found`, 
                'USER_NOT_FOUND', 
                404
              ));
            }
          } else {
            resolve(mockUsers);
          }
        } catch (error) {
          reject(createApiError(
            `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'INTERNAL_ERROR',
            500
          ));
        }
      }, Math.random() * 1000 + 500); // 0.5-1.5초 랜덤 지연
    });
  }, 3, 1000);
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const user = await getUserData(id) as User;
    return user;
  } catch (error) {
    const apiError = error as ApiError;
    throw createApiError(
      `Failed to get user by ID ${id}: ${apiError.message}`,
      apiError.code || 'GET_USER_BY_ID_FAILED',
      apiError.status || 500
    );
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await getUserData() as User[];
    return users;
  } catch (error) {
    const apiError = error as ApiError;
    throw createApiError(
      `Failed to get all users: ${apiError.message}`,
      apiError.code || 'GET_ALL_USERS_FAILED',
      apiError.status || 500
    );
  }
};