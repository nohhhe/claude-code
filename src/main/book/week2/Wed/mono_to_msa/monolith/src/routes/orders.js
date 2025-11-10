const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

router.post('/', (req, res) => {
  const { userId, items } = req.body;
  
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = Product.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for product ${item.productId}` });
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
    Product.updateStock(item.productId, item.quantity);
  }

  const order = Order.create({ userId, items: orderItems, totalAmount });
  res.status(201).json(order);
});

router.get('/user/:userId', (req, res) => {
  const orders = Order.findByUserId(parseInt(req.params.userId));
  res.json(orders);
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const order = Order.updateStatus(parseInt(req.params.id), status);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

module.exports = router;