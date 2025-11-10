import axios from 'axios'

// API Gateway를 통해 백엔드와 통신
const API_BASE_URL = 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 인증 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 만료 시 로그아웃 처리
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API 함수들
export const userAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/user/login', credentials),
  register: (userData: { email: string; password: string; name: string }) =>
    apiClient.post('/user/register', userData),
  getProfile: () => apiClient.get('/user/profile'),
}

export const productAPI = {
  getAll: () => apiClient.get('/product'),
  getById: (id: string) => apiClient.get(`/product/${id}`),
  search: (query: string) => apiClient.get(`/product/search?q=${query}`),
}

export const cartAPI = {
  getItems: () => apiClient.get('/cart'),
  addItem: (productId: string, quantity: number) =>
    apiClient.post('/cart/items', { productId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`),
  clear: () => apiClient.delete('/cart'),
}

export const orderAPI = {
  getAll: () => apiClient.get('/order'),
  getById: (id: string) => apiClient.get(`/order/${id}`),
  create: (orderData: any) => apiClient.post('/order', orderData),
  updateStatus: (id: string, status: string) =>
    apiClient.put(`/order/${id}/status`, { status }),
}

export const paymentAPI = {
  process: (paymentData: any) => apiClient.post('/payment/process', paymentData),
  getStatus: (paymentId: string) => apiClient.get(`/payment/${paymentId}/status`),
}

export const shippingAPI = {
  track: (orderId: string) => apiClient.get(`/shipping/track/${orderId}`),
  updateStatus: (orderId: string, status: string) =>
    apiClient.put(`/shipping/${orderId}`, { status }),
}

export const reviewAPI = {
  getByProduct: (productId: string) => apiClient.get(`/review/product/${productId}`),
  create: (reviewData: any) => apiClient.post('/review', reviewData),
  update: (id: string, reviewData: any) => apiClient.put(`/review/${id}`, reviewData),
  delete: (id: string) => apiClient.delete(`/review/${id}`),
}

export default apiClient