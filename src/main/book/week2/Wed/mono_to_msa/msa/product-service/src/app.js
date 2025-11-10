const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

let products = [];
let nextId = 1;

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, price, stock } = req.body;
  const product = {
    id: nextId++,
    name,
    price,
    stock,
    createdAt: new Date()
  };
  products.push(product);
  res.status(201).json(product);
});

app.patch('/api/products/:id/stock', (req, res) => {
  const { quantity } = req.body;
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (product.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }
  
  product.stock -= quantity;
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});

module.exports = app;