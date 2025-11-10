import { PaymentStrategy } from './PaymentStrategy';
import { PaymentRequest, PaymentResult } from '../types';

export class TransferPaymentStrategy extends PaymentStrategy {
  processPayment(request: PaymentRequest): PaymentResult {
    if (!request.accountNumber) {
      return {
        success: false,
        errorMessage: '계좌번호가 필요합니다'
      };
    }

    if (!this.validateAccount(request.accountNumber)) {
      return {
        success: false,
        errorMessage: '유효하지 않은 계좌번호입니다'
      };
    }

    if (!this.checkAccountBalance(request.accountNumber, request.amount)) {
      return {
        success: false,
        errorMessage: '계좌 잔액이 부족합니다'
      };
    }

    if (!this.checkDailyTransferLimit(request.accountNumber, request.amount)) {
      return {
        success: false,
        errorMessage: '일일 이체 한도를 초과했습니다'
      };
    }

    const transactionId = this.processAccountTransfer(request.accountNumber, request.amount);
    
    if (transactionId) {
      this.logTransaction(request.userId, 'transfer', request.amount, transactionId);
      return {
        success: true,
        transactionId
      };
    }

    return {
      success: false,
      errorMessage: '계좌이체 처리 중 오류가 발생했습니다'
    };
  }

  private validateAccount(accountNumber: string): boolean {
    return accountNumber.length >= 10;
  }

  private checkAccountBalance(accountNumber: string, amount: number): boolean {
    return true;
  }

  private checkDailyTransferLimit(accountNumber: string, amount: number): boolean {
    return true;
  }

  private processAccountTransfer(accountNumber: string, amount: number): string | null {
    return this.generateTransactionId();
  }
}