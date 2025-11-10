import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// Mock user for testing
const MOCK_USER = {
  id: '1',
  email: 'admin@test.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
  name: '관리자',
  role: 'ADMIN'
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: '이메일과 비밀번호를 입력해주세요.'
      })
    }

    // Mock authentication for development
    if (email === MOCK_USER.email) {
      const isValid = await bcrypt.compare(password, MOCK_USER.password)
      
      if (isValid) {
        const token = jwt.sign(
          { userId: MOCK_USER.id },
          process.env.JWT_SECRET || 'development-secret',
          { expiresIn: '7d' }
        )

        res.json({
          success: true,
          data: {
            token,
            user: {
              id: MOCK_USER.id,
              email: MOCK_USER.email,
              name: MOCK_USER.name
            }
          }
        })
      } else {
        res.status(401).json({
          success: false,
          error: '잘못된 비밀번호입니다.'
        })
      }
    } else {
      res.status(401).json({
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    })
  }
})

router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name
      }
    }
  })
})

export { router as authRoutes }