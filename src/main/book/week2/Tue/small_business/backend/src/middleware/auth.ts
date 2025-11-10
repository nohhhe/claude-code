import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface AuthRequest extends Request {
  userId?: string
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      error: '액세스 토큰이 필요합니다.'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret') as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: '유효하지 않은 토큰입니다.'
    })
  }
}