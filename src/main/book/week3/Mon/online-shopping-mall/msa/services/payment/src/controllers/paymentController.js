const Payment = require('../models/Payment');
const MockStripeService = require('../services/stripeService');
const { publishEvent } = require('../config/rabbitmq');

const stripeService = new MockStripeService();

const createPayment = async (req, res, next) => {
  try {
    const { orderId, userId, amount, currency, paymentMethod } = req.body;
    
    // Create payment intent with Stripe (mock)
    const paymentIntent = await stripeService.createPaymentIntent(
      amount, 
      currency.toLowerCase(),
      { orderId, userId }
    );
    
    // Create payment record
    const payment = new Payment({
      orderId,
      userId,
      amount,
      currency,
      paymentMethod,
      paymentIntentId: paymentIntent.id,
      status: 'pending'
    });
    
    const savedPayment = await payment.save();
    await savedPayment.logAction('create', 'success', { paymentIntent });
    
    res.status(201).json({
      payment: savedPayment,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

const processPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { paymentMethod } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Payment cannot be processed' });
    }
    
    // Confirm payment with Stripe (mock)
    const confirmedIntent = await stripeService.confirmPaymentIntent(
      payment.paymentIntentId,
      paymentMethod
    );
    
    // Update payment status based on Stripe response
    payment.status = confirmedIntent.status === 'succeeded' ? 'completed' : 'failed';
    const updatedPayment = await payment.update();
    
    await updatedPayment.logAction('process', payment.status, { confirmedIntent });
    
    // Publish event to RabbitMQ
    if (payment.status === 'completed') {
      await publishEvent('payment.events', 'payment.completed', {
        paymentId: payment.id,
        orderId: payment.orderId,
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency
      });
    } else {
      await publishEvent('payment.events', 'payment.failed', {
        paymentId: payment.id,
        orderId: payment.orderId,
        error: confirmedIntent.last_payment_error
      });
    }
    
    res.json({
      payment: updatedPayment,
      paymentIntent: confirmedIntent
    });
  } catch (error) {
    next(error);
  }
};

const refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Payment cannot be refunded' });
    }
    
    // Create refund with Stripe (mock)
    const refund = await stripeService.createRefund(
      payment.paymentIntentId,
      amount ? amount * 100 : null, // Convert to cents
      reason
    );
    
    // Update payment status
    payment.status = 'refunded';
    const updatedPayment = await payment.update();
    
    await updatedPayment.logAction('refund', 'success', { refund });
    
    // Publish refund event
    await publishEvent('payment.events', 'payment.refunded', {
      paymentId: payment.id,
      orderId: payment.orderId,
      refundId: refund.id,
      refundAmount: refund.amount / 100, // Convert back to dollars
      reason
    });
    
    res.json({
      payment: updatedPayment,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        reason: refund.reason,
        status: refund.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({ payment });
  } catch (error) {
    next(error);
  }
};

const getPaymentsByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const payments = await Payment.findByOrderId(orderId);
    
    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

const getUserPayments = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit, offset } = req.query;
    
    const payments = await Payment.findByUserId(userId, limit, offset);
    
    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  processPayment,
  refundPayment,
  getPayment,
  getPaymentsByOrder,
  getUserPayments
};