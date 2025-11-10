const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', (req, res) => {
  const users = User.getAll().map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  }));
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = User.findById(parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  });
});

module.exports = router;