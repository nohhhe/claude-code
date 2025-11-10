/**
 * @fileoverview ApiService에 대한 기본 테스트
 */

import { ApiService, PaymentService, UserService, OrderService } from '../index';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
  });

  test('should create ApiService instance', () => {
    expect(apiService).toBeInstanceOf(ApiService);
  });

  test('should have payments service', () => {
    expect(apiService.payments).toBeInstanceOf(PaymentService);
  });

  test('should have users service', () => {
    expect(apiService.users).toBeInstanceOf(UserService);
  });

  test('should have orders service', () => {
    expect(apiService.orders).toBeInstanceOf(OrderService);
  });

  test('should initialize with custom config', () => {
    const customApiService = new ApiService({
      paymentApiKey: 'test-key',
      paymentApiUrl: 'https://test-api.com'
    });

    expect(customApiService).toBeInstanceOf(ApiService);
    expect(customApiService.payments).toBeInstanceOf(PaymentService);
  });
});