import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { ROUTES } from '@/constants'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const { addNotification } = useUiStore()

  // 리다이렉트 메시지 표시
  useEffect(() => {
    const state = location.state as any
    if (state?.message) {
      addNotification({
        type: 'info',
        title: '로그인 필요',
        message: state.message
      })
    }
  }, [location.state, addNotification])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // 이전 에러 메시지 초기화
    
    if (!email || !password) {
      const errorMsg = '이메일과 비밀번호를 모두 입력해주세요.'
      setError(errorMsg)
      addNotification({
        type: 'warning',
        title: '입력 오류',
        message: errorMsg
      })
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password)
      addNotification({
        type: 'success',
        title: '로그인 성공',
        message: '환영합니다!'
      })
      // 로그인 후 원래 페이지로 돌아가기
      const state = location.state as any
      const redirectTo = state?.from || ROUTES.HOME
      navigate(redirectTo)
    } catch (error: any) {
      let errorMessage = '로그인에 실패했습니다.'
      
      if (error.response?.status === 401) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error?.message || '입력 정보를 확인해주세요.'
      } else if (error.response?.status === 500) {
        errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = '네트워크 연결을 확인해주세요.'
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message
      }
      
      setError(errorMessage)
      addNotification({
        type: 'error',
        title: '로그인 실패',
        message: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          로그인
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          계정에 로그인하여 서비스를 이용해보세요
        </p>
      </div>

      {/* 리다이렉트 안내 메시지 */}
      {location.state?.message && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                로그인 필요
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                {location.state.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                로그인 오류
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이메일
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(null) // 사용자가 입력하면 에러 메시지 제거
            }}
            className={`input-base ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="이메일을 입력해주세요"
            disabled={isLoading}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            비밀번호
          </label>
          <input 
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError(null) // 사용자가 입력하면 에러 메시지 제거
            }}
            className={`input-base ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="비밀번호를 입력해주세요"
            disabled={isLoading}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          계정이 없으신가요?{' '}
          <Link 
            to={ROUTES.REGISTER}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}