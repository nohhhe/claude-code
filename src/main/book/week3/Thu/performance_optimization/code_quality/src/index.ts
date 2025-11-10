import { UserService } from './services/UserService';
import { Calculator } from './utils/Calculator';
import { DataProcessor } from './utils/DataProcessor';

// 메인 애플리케이션 - 의도적으로 복잡도가 높은 코드
export class Application {
    private userService: UserService;
    private calculator: Calculator;
    private dataProcessor: DataProcessor;

    constructor() {
        this.userService = new UserService();
        this.calculator = new Calculator();
        this.dataProcessor = new DataProcessor();
    }

    // 복잡도가 높은 메서드 (Cyclomatic Complexity > 10)
    public async processUserData(userId: string, data: any[]): Promise<any> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        if (!data || data.length === 0) {
            return null;
        }

        let result: any = {};
        
        // 중첩된 조건문들 - 복잡도 증가
        for (let item of data) {
            if (item.type === 'number') {
                if (item.value > 100) {
                    if (item.category === 'premium') {
                        result.premiumSum = (result.premiumSum || 0) + item.value * 1.2;
                    } else if (item.category === 'standard') {
                        result.standardSum = (result.standardSum || 0) + item.value * 1.1;
                    } else if (item.category === 'basic') {
                        result.basicSum = (result.basicSum || 0) + item.value;
                    } else {
                        result.otherSum = (result.otherSum || 0) + item.value * 0.9;
                    }
                } else if (item.value > 50) {
                    if (item.category === 'premium') {
                        result.premiumMid = (result.premiumMid || 0) + item.value;
                    } else {
                        result.standardMid = (result.standardMid || 0) + item.value;
                    }
                } else if (item.value > 0) {
                    result.lowValue = (result.lowValue || 0) + item.value;
                } else {
                    result.negativeValue = (result.negativeValue || 0) + Math.abs(item.value);
                }
            } else if (item.type === 'string') {
                if (item.value.length > 10) {
                    result.longStrings = (result.longStrings || []).concat(item.value);
                } else if (item.value.length > 5) {
                    result.mediumStrings = (result.mediumStrings || []).concat(item.value);
                } else {
                    result.shortStrings = (result.shortStrings || []).concat(item.value);
                }
            }
        }

        return result;
    }

    // 중복 코드 패턴 1
    public validateEmail(email: string): boolean {
        if (!email) {
            return false;
        }
        if (email.length < 5) {
            return false;
        }
        if (!email.includes('@')) {
            return false;
        }
        if (!email.includes('.')) {
            return false;
        }
        return true;
    }

    // 중복 코드 패턴 2 (거의 동일한 로직)
    public validatePhone(phone: string): boolean {
        if (!phone) {
            return false;
        }
        if (phone.length < 5) {
            return false;
        }
        if (!phone.includes('-')) {
            return false;
        }
        if (phone.length > 20) {
            return false;
        }
        return true;
    }

    // 테스트되지 않는 메서드 (커버리지 문제)
    public unusedMethod(): string {
        return "This method is never tested";
    }

    public anotherUntestedMethod(value: number): number {
        if (value > 100) {
            return value * 2;
        } else if (value > 50) {
            return value * 1.5;
        } else {
            return value;
        }
    }
}

// 메인 실행
async function main() {
    const app = new Application();
    
    const testData = [
        { type: 'number', value: 150, category: 'premium' },
        { type: 'number', value: 75, category: 'standard' },
        { type: 'string', value: 'Hello World Test' },
    ];

    try {
        const result = await app.processUserData('user123', testData);
        console.log('Processing result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

if (require.main === module) {
    main();
}