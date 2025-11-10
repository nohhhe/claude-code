export interface PaymentRequest {
  amount: number;
  currency: string;
  method: 'card' | 'transfer' | 'points';
  cardNumber?: string;
  accountNumber?: string;
  pointsBalance?: number;
  userId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  remainingPoints?: number;
}