const express = require('express');
const router = express.Router();

const {
  createPayment,
  processPayment,
  refundPayment,
  getPayment,
  getPaymentsByOrder,
  getUserPayments
} = require('../controllers/paymentController');

const { validate } = require('../middleware/validation');
const {
  createPaymentSchema,
  processPaymentSchema,
  refundPaymentSchema,
  queryParamsSchema
} = require('../validation/schemas');

// Create a new payment
router.post('/', validate(createPaymentSchema), createPayment);

// Process/confirm a payment
router.post('/:paymentId/process', validate(processPaymentSchema), processPayment);

// Refund a payment
router.post('/:paymentId/refund', validate(refundPaymentSchema), refundPayment);

// Get payment by ID
router.get('/:paymentId', getPayment);

// Get payments by order ID
router.get('/order/:orderId', getPaymentsByOrder);

// Get user's payments with pagination
router.get('/user/:userId', validate(queryParamsSchema, 'query'), getUserPayments);

module.exports = router;