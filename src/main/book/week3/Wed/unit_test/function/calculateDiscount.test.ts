import { calculateDiscount } from './calculateDiscount';

describe('calculateDiscount', () => {
  describe('정상 케이스', () => {
    it('should calculate discount correctly', () => {
      expect(calculateDiscount(100, 10)).toBe(90);
      expect(calculateDiscount(200, 25)).toBe(150);
      expect(calculateDiscount(50, 50)).toBe(25);
    });

    it('should handle zero discount', () => {
      expect(calculateDiscount(100, 0)).toBe(100);
    });

    it('should handle 100% discount', () => {
      expect(calculateDiscount(100, 100)).toBe(0);
    });
  });

  describe('엣지 케이스', () => {
    it('should throw error for negative price', () => {
      expect(() => calculateDiscount(-100, 10)).toThrow('Invalid input');
    });

    it('should throw error for negative discount rate', () => {
      expect(() => calculateDiscount(100, -10)).toThrow('Invalid input');
    });

    it('should throw error for discount rate over 100', () => {
      expect(() => calculateDiscount(100, 101)).toThrow('Invalid input');
    });

    it('should handle floating point numbers', () => {
      expect(calculateDiscount(99.99, 10)).toBeCloseTo(89.991, 2);
    });
  });

  describe('경계값 테스트', () => {
    it('should handle zero price', () => {
      expect(calculateDiscount(0, 50)).toBe(0);
    });

    it('should handle very large numbers', () => {
      expect(calculateDiscount(Number.MAX_SAFE_INTEGER, 1))
        .toBeCloseTo(Number.MAX_SAFE_INTEGER * 0.99);
    });
  });
});