import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: '관리자',
      role: Role.ADMIN,
    },
  })

  console.log('Created user:', user)

  // Create test customers
  const customer1 = await prisma.customer.create({
    data: {
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      address: '서울시 강남구',
      userId: user.id,
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-9876-5432',
      address: '서울시 서초구',
      userId: user.id,
    },
  })

  console.log('Created customers:', { customer1, customer2 })

  // Create test sales
  await prisma.sale.createMany({
    data: [
      {
        amount: 125000,
        description: '커피 및 디저트',
        userId: user.id,
        customerId: customer1.id,
      },
      {
        amount: 85000,
        description: '점심 세트',
        userId: user.id,
        customerId: customer2.id,
        date: new Date(Date.now() - 86400000), // yesterday
      },
      {
        amount: 65000,
        description: '음료 및 스낵',
        userId: user.id,
        customerId: customer1.id,
        date: new Date(Date.now() - 172800000), // 2 days ago
      },
    ],
  })

  // Create test inventory
  await prisma.inventoryItem.createMany({
    data: [
      {
        name: '아메리카노',
        description: '시그니처 아메리카노',
        quantity: 100,
        minStock: 20,
        price: 4500,
        category: '음료',
        userId: user.id,
      },
      {
        name: '샌드위치',
        description: '햄치즈 샌드위치',
        quantity: 25,
        minStock: 10,
        price: 7500,
        category: '음식',
        userId: user.id,
      },
      {
        name: '쿠키',
        description: '수제 초콜릿 쿠키',
        quantity: 50,
        minStock: 15,
        price: 3000,
        category: '디저트',
        userId: user.id,
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })