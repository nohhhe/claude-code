import { PaymentStrategy } from './strategies/PaymentStrategy';
import { CardPaymentStrategy } from './strategies/CardPaymentStrategy';
import { TransferPaymentStrategy } from './strategies/TransferPaymentStrategy';
import { PointsPaymentStrategy } from './strategies/PointsPaymentStrategy';
import { PaymentRequest, PaymentResult } from './types';

export class PaymentProcessor {
  private strategies: Map<string, PaymentStrategy>;

  constructor() {
    this.strategies = new Map();
    this.registerStrategy('card', new CardPaymentStrategy());
    this.registerStrategy('transfer', new TransferPaymentStrategy());
    this.registerStrategy('points', new PointsPaymentStrategy());
  }

  registerStrategy(method: string, strategy: PaymentStrategy): void {
    this.strategies.set(method, strategy);
  }

  removeStrategy(method: string): void {
    this.strategies.delete(method);
  }

  processPayment(request: PaymentRequest): PaymentResult {
    const strategy = this.strategies.get(request.method);
    
    if (!strategy) {
      return {
        success: false,
        errorMessage: '지원하지 않는 결제 방식입니다'
      };
    }

    return strategy.processPayment(request);
  }

  getSupportedMethods(): string[] {
    return Array.from(this.strategies.keys());
  }
}