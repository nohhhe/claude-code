import { Calculator } from '../utils/Calculator';

describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('addNumbers', () => {
        it('should add two numbers correctly', () => {
            expect(calculator.addNumbers(2, 3)).toBe(5);
        });

        it('should throw error for non-number first parameter', () => {
            expect(() => calculator.addNumbers('2' as any, 3)).toThrow('First parameter must be a number');
        });

        it('should throw error for NaN parameters', () => {
            expect(() => calculator.addNumbers(NaN, 3)).toThrow('Parameters cannot be NaN');
        });
    });

    describe('multiplyNumbers', () => {
        it('should multiply two numbers correctly', () => {
            expect(calculator.multiplyNumbers(4, 5)).toBe(20);
        });

        it('should throw error for non-number parameters', () => {
            expect(() => calculator.multiplyNumbers(4, '5' as any)).toThrow('Second parameter must be a number');
        });
    });

    describe('calculateDiscount', () => {
        it('should calculate premium customer discount correctly', () => {
            const result = calculator.calculateDiscount(100, 'premium', 150, 'winter');
            expect(result).toBe(70); // 100 * (1 - 0.3)
        });

        it('should calculate standard customer discount correctly', () => {
            const result = calculator.calculateDiscount(100, 'standard', 120, 'summer');
            expect(result).toBe(85); // 100 * (1 - 0.15)
        });

        it('should handle basic customer with low quantity', () => {
            const result = calculator.calculateDiscount(100, 'basic', 5, 'spring');
            expect(result).toBe(100); // no discount
        });
    });

    // 의도적으로 일부 메서드는 테스트하지 않음
    // divideNumbers, calculateTax, anotherUnusedMethod는 테스트되지 않음 (커버리지 이슈)
});