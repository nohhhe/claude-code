import { PaymentStrategy } from './PaymentStrategy';
import { PaymentRequest, PaymentResult } from '../types';

export class CardPaymentStrategy extends PaymentStrategy {
  processPayment(request: PaymentRequest): PaymentResult {
    if (!request.cardNumber) {
      return {
        success: false,
        errorMessage: '카드번호가 필요합니다'
      };
    }

    if (!this.validateCard(request.cardNumber)) {
      return {
        success: false,
        errorMessage: '유효하지 않은 카드번호입니다'
      };
    }

    if (!this.checkCardBalance(request.cardNumber, request.amount)) {
      return {
        success: false,
        errorMessage: '잔액이 부족합니다'
      };
    }

    const transactionId = this.processCardPayment(request.cardNumber, request.amount);
    
    if (transactionId) {
      this.logTransaction(request.userId, 'card', request.amount, transactionId);
      return {
        success: true,
        transactionId
      };
    }

    return {
      success: false,
      errorMessage: '카드 결제 처리 중 오류가 발생했습니다'
    };
  }

  private validateCard(cardNumber: string): boolean {
    return cardNumber.replace(/\s/g, '').length === 16;
  }

  private checkCardBalance(cardNumber: string, amount: number): boolean {
    return true;
  }

  private processCardPayment(cardNumber: string, amount: number): string | null {
    return this.generateTransactionId();
  }
}