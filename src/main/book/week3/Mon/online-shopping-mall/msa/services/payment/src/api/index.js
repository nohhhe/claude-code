const express = require('express');
const router = express.Router();

const paymentRoutes = require('./payments');

router.use('/payments', paymentRoutes);

module.exports = router;