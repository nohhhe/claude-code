import { PaymentProcessor, PaymentStrategy } from './index';
import { PaymentRequest, PaymentResult } from './types';

// 새로운 결제 방식 확장 예시: 암호화폐 결제
class CryptoPaymentStrategy extends PaymentStrategy {
  processPayment(request: PaymentRequest): PaymentResult {
    // 암호화폐 결제 로직
    console.log('Processing crypto payment...');
    
    const transactionId = this.generateTransactionId();
    this.logTransaction(request.userId, 'crypto', request.amount, transactionId);
    
    return {
      success: true,
      transactionId
    };
  }
}

// 사용 예시
const processor = new PaymentProcessor();

// 새로운 결제 방식 추가
processor.registerStrategy('crypto', new CryptoPaymentStrategy());

// 카드 결제 테스트
const cardPayment: PaymentRequest = {
  amount: 50000,
  currency: 'KRW',
  method: 'card',
  cardNumber: '1234567812345678',
  userId: 'user123'
};

const result1 = processor.processPayment(cardPayment);
console.log('Card Payment Result:', result1);

// 포인트 결제 테스트
const pointsPayment: PaymentRequest = {
  amount: 2000,
  currency: 'KRW',
  method: 'points',
  pointsBalance: 5000,
  userId: 'user123'
};

const result2 = processor.processPayment(pointsPayment);
console.log('Points Payment Result:', result2);

// 새로 추가된 암호화폐 결제 테스트
const cryptoPayment: PaymentRequest = {
  amount: 30000,
  currency: 'KRW',
  method: 'crypto' as any,
  userId: 'user123'
};

const result3 = processor.processPayment(cryptoPayment);
console.log('Crypto Payment Result:', result3);

// 지원되는 결제 방식 확인
console.log('Supported Methods:', processor.getSupportedMethods());