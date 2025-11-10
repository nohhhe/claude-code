import { DataProcessor } from '../utils/DataProcessor';

describe('DataProcessor', () => {
    let processor: DataProcessor;

    beforeEach(() => {
        processor = new DataProcessor();
    });

    describe('processUserArray', () => {
        it('should process active users correctly', () => {
            const users = [
                { id: '1', name: '  John Doe  ', email: 'JOHN@TEST.COM', active: true },
                { id: '2', name: 'Jane Smith', email: 'jane@test.com', active: false },
                { id: '3', name: 'Bob Wilson', email: 'bob@test.com', active: true }
            ];

            const result = processor.processUserArray(users);
            
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].email).toBe('john@test.com');
            expect(result[1].name).toBe('Bob Wilson');
        });

        it('should handle empty array', () => {
            const result = processor.processUserArray([]);
            expect(result).toEqual([]);
        });
    });

    describe('processProductArray', () => {
        it('should process active products correctly', () => {
            const products = [
                { id: '1', name: '  Product 1  ', description: 'GREAT PRODUCT', active: true },
                { id: '2', name: 'Product 2', description: 'another product', active: false }
            ];

            const result = processor.processProductArray(products);
            
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Product 1');
            expect(result[0].description).toBe('great product');
        });
    });

    describe('validateAndTransformData', () => {
        it('should validate user data correctly', () => {
            const userData = {
                age: 25,
                hasJob: true,
                income: 60000
            };

            const result = processor.validateAndTransformData(userData, 'user');
            
            expect(result.category).toBe('adult');
            expect(result.status).toBe('premium');
        });

        it('should validate product data correctly', () => {
            const productData = {
                price: 50,
                quality: 8
            };

            const result = processor.validateAndTransformData(productData, 'product');
            
            expect(result.priceCategory).toBe('medium');
            expect(result.recommendation).toBe('best_value');
        });

        it('should return null for empty data', () => {
            const result = processor.validateAndTransformData(null, 'user');
            expect(result).toBeNull();
        });
    });

    // 의도적으로 일부 메서드는 테스트하지 않음
    // formatDate, generateId는 테스트되지 않음 (커버리지 이슈)
});