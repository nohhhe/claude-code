import { PaymentStrategy } from './PaymentStrategy';
import { PaymentRequest, PaymentResult } from '../types';

export class PointsPaymentStrategy extends PaymentStrategy {
  processPayment(request: PaymentRequest): PaymentResult {
    if (request.pointsBalance === undefined) {
      return {
        success: false,
        errorMessage: '포인트 잔액 정보가 필요합니다'
      };
    }

    if (request.pointsBalance < request.amount) {
      return {
        success: false,
        errorMessage: '포인트가 부족합니다',
        remainingPoints: request.pointsBalance
      };
    }

    if (request.amount < 1000) {
      return {
        success: false,
        errorMessage: '최소 1000포인트 이상 사용 가능합니다',
        remainingPoints: request.pointsBalance
      };
    }

    const newBalance = request.pointsBalance - request.amount;
    const success = this.usePoints(request.userId, request.amount);
    
    if (success) {
      const transactionId = this.generateTransactionId();
      this.logTransaction(request.userId, 'points', request.amount, transactionId);
      return {
        success: true,
        transactionId,
        remainingPoints: newBalance
      };
    }

    return {
      success: false,
      errorMessage: '포인트 사용 처리 중 오류가 발생했습니다',
      remainingPoints: request.pointsBalance
    };
  }

  private usePoints(userId: string, amount: number): boolean {
    return true;
  }
}