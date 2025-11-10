const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', (req, res) => {
  const products = Product.getAll();
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = Product.findById(parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

router.post('/', (req, res) => {
  const { name, price, stock } = req.body;
  const product = Product.create({ name, price, stock });
  res.status(201).json(product);
});

module.exports = router;