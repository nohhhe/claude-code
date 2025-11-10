const Joi = require('joi');

const createPaymentSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().length(3).default('USD'),
  paymentMethod: Joi.string().valid('card', 'bank_transfer', 'paypal').required()
});

const processPaymentSchema = Joi.object({
  paymentMethod: Joi.string().valid(
    'card_success', 
    'card_decline', 
    'card_insufficient', 
    'card_auth'
  ).default('card_success')
});

const refundPaymentSchema = Joi.object({
  amount: Joi.number().positive().precision(2).optional(),
  reason: Joi.string().valid(
    'requested_by_customer',
    'duplicate',
    'fraudulent',
    'subscription_canceled'
  ).default('requested_by_customer')
});

const queryParamsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
  createPaymentSchema,
  processPaymentSchema,
  refundPaymentSchema,
  queryParamsSchema
};