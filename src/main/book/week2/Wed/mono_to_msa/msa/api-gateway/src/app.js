const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', createProxyMiddleware({
  target: process.env.NODE_ENV === 'production' ? 'http://user-service:3001' : 'http://localhost:3001',
  changeOrigin: true
}));

app.use('/api/products', createProxyMiddleware({
  target: process.env.NODE_ENV === 'production' ? 'http://product-service:3002' : 'http://localhost:3002',
  changeOrigin: true
}));

app.use('/api/orders', createProxyMiddleware({
  target: process.env.NODE_ENV === 'production' ? 'http://order-service:3003' : 'http://localhost:3003',
  changeOrigin: true
}));

app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

module.exports = app;