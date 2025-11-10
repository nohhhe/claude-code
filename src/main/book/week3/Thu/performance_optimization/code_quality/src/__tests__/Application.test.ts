import { Application } from '../index';

describe('Application', () => {
    let app: Application;

    beforeEach(() => {
        app = new Application();
    });

    describe('processUserData', () => {
        it('should throw error when userId is empty', async () => {
            await expect(app.processUserData('', [])).rejects.toThrow('User ID is required');
        });

        it('should return null when data array is empty', async () => {
            const result = await app.processUserData('user123', []);
            expect(result).toBeNull();
        });

        it('should process premium number data correctly', async () => {
            const testData = [
                { type: 'number', value: 150, category: 'premium' }
            ];
            
            const result = await app.processUserData('user123', testData);
            expect(result.premiumSum).toBe(180); // 150 * 1.2
        });

        it('should process standard number data correctly', async () => {
            const testData = [
                { type: 'number', value: 120, category: 'standard' }
            ];
            
            const result = await app.processUserData('user123', testData);
            expect(result.standardSum).toBe(132); // 120 * 1.1
        });

        it('should process string data correctly', async () => {
            const testData = [
                { type: 'string', value: 'Hello World Test Long String' }
            ];
            
            const result = await app.processUserData('user123', testData);
            expect(result.longStrings).toContain('Hello World Test Long String');
        });
    });

    describe('validateEmail', () => {
        it('should return false for empty email', () => {
            expect(app.validateEmail('')).toBe(false);
        });

        it('should return false for email without @', () => {
            expect(app.validateEmail('testtest.com')).toBe(false);
        });

        it('should return true for valid email', () => {
            expect(app.validateEmail('test@test.com')).toBe(true);
        });
    });

    describe('validatePhone', () => {
        it('should return false for empty phone', () => {
            expect(app.validatePhone('')).toBe(false);
        });

        it('should return false for phone without dash', () => {
            expect(app.validatePhone('1234567890')).toBe(false);
        });

        it('should return true for valid phone', () => {
            expect(app.validatePhone('123-456-7890')).toBe(true);
        });
    });

    // 의도적으로 일부 메서드는 테스트하지 않음 (커버리지 이슈 시연)
    // unusedMethod와 anotherUntestedMethod는 테스트되지 않음
});