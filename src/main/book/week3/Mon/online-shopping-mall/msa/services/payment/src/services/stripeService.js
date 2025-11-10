const { v4: uuidv4 } = require('uuid');

class MockStripeService {
  constructor() {
    this.paymentIntents = new Map();
    this.mockCards = {
      'card_success': { status: 'succeeded' },
      'card_decline': { status: 'failed', error: 'card_declined' },
      'card_insufficient': { status: 'failed', error: 'insufficient_funds' },
      'card_auth': { status: 'requires_action' }
    };
  }

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    const paymentIntentId = `pi_${uuidv4().replace(/-/g, '')}`;
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const paymentIntent = {
      id: paymentIntentId,
      amount: amount * 100, // Stripe uses cents
      currency,
      status: 'requires_payment_method',
      metadata,
      created: Math.floor(Date.now() / 1000),
      client_secret: `${paymentIntentId}_secret_${uuidv4()}`
    };
    
    this.paymentIntents.set(paymentIntentId, paymentIntent);
    
    console.log(`Mock Stripe: Created payment intent ${paymentIntentId} for $${amount}`);
    return paymentIntent;
  }

  async confirmPaymentIntent(paymentIntentId, paymentMethod = 'card_success') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      throw new Error(`Payment intent ${paymentIntentId} not found`);
    }

    // Simulate different payment outcomes based on payment method
    const mockCard = this.mockCards[paymentMethod] || this.mockCards['card_success'];
    
    paymentIntent.status = mockCard.status;
    paymentIntent.payment_method = paymentMethod;
    
    if (mockCard.error) {
      paymentIntent.last_payment_error = {
        code: mockCard.error,
        message: this.getErrorMessage(mockCard.error)
      };
    }
    
    this.paymentIntents.set(paymentIntentId, paymentIntent);
    
    console.log(`Mock Stripe: Confirmed payment intent ${paymentIntentId} with status ${mockCard.status}`);
    return paymentIntent;
  }

  async retrievePaymentIntent(paymentIntentId) {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      throw new Error(`Payment intent ${paymentIntentId} not found`);
    }
    
    return paymentIntent;
  }

  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      throw new Error(`Payment intent ${paymentIntentId} not found`);
    }

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Cannot refund payment that has not succeeded');
    }

    const refundAmount = amount || paymentIntent.amount;
    const refundId = `re_${uuidv4().replace(/-/g, '')}`;
    
    const refund = {
      id: refundId,
      payment_intent: paymentIntentId,
      amount: refundAmount,
      currency: paymentIntent.currency,
      reason,
      status: 'succeeded',
      created: Math.floor(Date.now() / 1000)
    };
    
    console.log(`Mock Stripe: Created refund ${refundId} for payment ${paymentIntentId}`);
    return refund;
  }

  getErrorMessage(errorCode) {
    const errorMessages = {
      'card_declined': 'Your card was declined.',
      'insufficient_funds': 'Your card has insufficient funds.',
      'expired_card': 'Your card has expired.',
      'incorrect_cvc': 'Your card\'s security code is incorrect.',
      'processing_error': 'An error occurred while processing your card.'
    };
    
    return errorMessages[errorCode] || 'An unknown error occurred.';
  }
}

module.exports = MockStripeService;