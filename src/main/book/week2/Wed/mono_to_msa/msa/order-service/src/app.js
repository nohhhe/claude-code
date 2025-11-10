const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

let orders = [];
let nextId = 1;

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${item.productId}`);
      const product = productResponse.data;
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${item.productId}` 
        });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }

    for (const item of items) {
      await axios.patch(`${PRODUCT_SERVICE_URL}/api/products/${item.productId}/stock`, {
        quantity: item.quantity
      });
    }

    const order = {
      id: nextId++,
      userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      createdAt: new Date()
    };
    
    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ message: 'Order creation failed' });
  }
});

app.get('/api/orders/user/:userId', (req, res) => {
  const userOrders = orders.filter(order => order.userId === parseInt(req.params.userId));
  res.json(userOrders);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  order.status = status;
  res.json(order);
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});

module.exports = app;