import { PaymentRequest, PaymentResult } from '../types';

export abstract class PaymentStrategy {
  abstract processPayment(request: PaymentRequest): PaymentResult;

  protected generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  protected logTransaction(userId: string, method: string, amount: number, transactionId: string): void {
    console.log(`Transaction logged: ${userId}, ${method}, ${amount}, ${transactionId}`);
  }
}