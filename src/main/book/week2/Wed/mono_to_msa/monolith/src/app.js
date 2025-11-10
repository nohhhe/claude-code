const express = require('express');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce Monolith API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login)',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Monolith server running on port ${PORT}`);
});

module.exports = app;