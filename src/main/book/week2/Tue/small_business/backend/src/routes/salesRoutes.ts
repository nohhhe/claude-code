import express from 'express'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Mock sales data
const mockSales = [
  {
    id: '1',
    amount: 125000,
    date: new Date(),
    description: '커피 및 디저트',
    customerId: '1'
  },
  {
    id: '2',
    amount: 85000,
    date: new Date(Date.now() - 86400000), // yesterday
    description: '점심 세트',
    customerId: '2'
  }
]

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockSales
  })
})

router.post('/', (req, res) => {
  const { amount, description, customerId } = req.body
  
  const newSale = {
    id: String(mockSales.length + 1),
    amount: parseFloat(amount),
    date: new Date(),
    description,
    customerId
  }
  
  mockSales.push(newSale)
  
  res.status(201).json({
    success: true,
    data: newSale
  })
})

router.get('/stats', (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todaySales = mockSales
    .filter(sale => new Date(sale.date) >= today)
    .reduce((sum, sale) => sum + sale.amount, 0)
  
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.amount, 0)
  
  res.json({
    success: true,
    data: {
      todaySales,
      totalSales,
      salesCount: mockSales.length
    }
  })
})

export { router as salesRoutes }