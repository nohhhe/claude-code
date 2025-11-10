const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Service routes
const services = {
  user: 'http://user-service:3001',
  product: 'http://product-service:3002',
  order: 'http://order-service:3003',
  payment: 'http://payment-service:3004',
  shipping: 'http://shipping-service:3005',
  cart: 'http://cart-service:3006',
  review: 'http://review-service:3007',
  notification: 'http://notification-service:3008'
};

// Proxy routes
Object.keys(services).forEach(service => {
  app.use(`/api/${service}`, createProxyMiddleware({
    target: services[service],
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${service}`]: ''
    }
  }));
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});