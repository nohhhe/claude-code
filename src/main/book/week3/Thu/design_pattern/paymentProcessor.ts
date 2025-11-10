interface PaymentRequest {
  amount: number;
  currency: string;
  method: 'card' | 'transfer' | 'points';
  cardNumber?: string;
  accountNumber?: string;
  pointsBalance?: number;
  userId: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  remainingPoints?: number;
}

class PaymentProcessor {
  processPayment(request: PaymentRequest): PaymentResult {
    if (request.method === 'card') {
      // 카드 결제 로직
      if (!request.cardNumber) {
        return {
          success: false,
          errorMessage: '카드번호가 필요합니다'
        };
      }

      if (request.cardNumber.length < 16) {
        return {
          success: false,
          errorMessage: '유효하지 않은 카드번호입니다'
        };
      }

      // 카드 유효성 검증
      if (!this.validateCard(request.cardNumber)) {
        return {
          success: false,
          errorMessage: '카드 검증에 실패했습니다'
        };
      }

      // 잔액 확인
      if (!this.checkCardBalance(request.cardNumber, request.amount)) {
        return {
          success: false,
          errorMessage: '잔액이 부족합니다'
        };
      }

      // 결제 처리
      const transactionId = this.processCardPayment(request.cardNumber, request.amount);
      
      if (transactionId) {
        this.logTransaction(request.userId, 'card', request.amount, transactionId);
        return {
          success: true,
          transactionId
        };
      } else {
        return {
          success: false,
          errorMessage: '카드 결제 처리 중 오류가 발생했습니다'
        };
      }

    } else if (request.method === 'transfer') {
      // 계좌이체 로직
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

      // 계좌 잔액 확인
      if (!this.checkAccountBalance(request.accountNumber, request.amount)) {
        return {
          success: false,
          errorMessage: '계좌 잔액이 부족합니다'
        };
      }

      // 일일 이체 한도 확인
      if (!this.checkDailyTransferLimit(request.accountNumber, request.amount)) {
        return {
          success: false,
          errorMessage: '일일 이체 한도를 초과했습니다'
        };
      }

      // 계좌이체 처리
      const transactionId = this.processAccountTransfer(request.accountNumber, request.amount);
      
      if (transactionId) {
        this.logTransaction(request.userId, 'transfer', request.amount, transactionId);
        return {
          success: true,
          transactionId
        };
      } else {
        return {
          success: false,
          errorMessage: '계좌이체 처리 중 오류가 발생했습니다'
        };
      }

    } else if (request.method === 'points') {
      // 포인트 결제 로직
      if (request.pointsBalance === undefined) {
        return {
          success: false,
          errorMessage: '포인트 잔액 정보가 필요합니다'
        };
      }

      // 포인트 잔액 확인
      if (request.pointsBalance < request.amount) {
        return {
          success: false,
          errorMessage: '포인트가 부족합니다',
          remainingPoints: request.pointsBalance
        };
      }

      // 최소 사용 포인트 확인
      if (request.amount < 1000) {
        return {
          success: false,
          errorMessage: '최소 1000포인트 이상 사용 가능합니다',
          remainingPoints: request.pointsBalance
        };
      }

      // 포인트 사용 처리
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
      } else {
        return {
          success: false,
          errorMessage: '포인트 사용 처리 중 오류가 발생했습니다',
          remainingPoints: request.pointsBalance
        };
      }

    } else {
      return {
        success: false,
        errorMessage: '지원하지 않는 결제 방식입니다'
      };
    }
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

  private usePoints(userId: string, amount: number): boolean {
    return true;
  }

  private generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  private logTransaction(userId: string, method: string, amount: number, transactionId: string): void {
    console.log(`Transaction logged: ${userId}, ${method}, ${amount}, ${transactionId}`);
  }
}

export { PaymentProcessor, PaymentRequest, PaymentResult };