import { apiClient } from './api'
import { User } from '@/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  // 로그인
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials)
    
    if (!response.success) {
      throw new Error(response.error?.message || '로그인에 실패했습니다')
    }
    
    return response.data
  },

  // 회원가입
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData)
    
    if (!response.success) {
      throw new Error(response.error?.message || '회원가입에 실패했습니다')
    }
    
    return response.data
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/auth/me')
    
    if (!response.success) {
      throw new Error(response.error?.message || '사용자 정보를 가져올 수 없습니다')
    }
    
    return response.data
  },

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout')
    } catch (error) {
      // 로그아웃 API가 실패해도 클라이언트 측에서는 토큰을 삭제해야 함
      console.warn('Logout API failed:', error)
    }
  },

  // 비밀번호 변경
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/api/auth/change-password', {
      currentPassword,
      newPassword
    })
    
    if (!response.success) {
      throw new Error(response.error?.message || '비밀번호 변경에 실패했습니다')
    }
  },

  // 프로필 업데이트
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/api/auth/profile', userData)
    
    if (!response.success) {
      throw new Error(response.error?.message || '프로필 업데이트에 실패했습니다')
    }
    
    return response.data
  }
}