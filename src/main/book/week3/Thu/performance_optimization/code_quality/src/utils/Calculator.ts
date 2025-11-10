// 계산 유틸리티 클래스 - 다양한 코드 품질 이슈 포함
export class Calculator {
    
    // 중복 코드 패턴 1
    public addNumbers(a: number, b: number): number {
        if (typeof a !== 'number') {
            throw new Error('First parameter must be a number');
        }
        if (typeof b !== 'number') {
            throw new Error('Second parameter must be a number');
        }
        if (isNaN(a) || isNaN(b)) {
            throw new Error('Parameters cannot be NaN');
        }
        return a + b;
    }

    // 중복 코드 패턴 2 (거의 동일한 검증 로직)
    public multiplyNumbers(a: number, b: number): number {
        if (typeof a !== 'number') {
            throw new Error('First parameter must be a number');
        }
        if (typeof b !== 'number') {
            throw new Error('Second parameter must be a number');
        }
        if (isNaN(a) || isNaN(b)) {
            throw new Error('Parameters cannot be NaN');
        }
        return a * b;
    }

    // 복잡도가 높은 메서드
    public calculateDiscount(price: number, customerType: string, quantity: number, season: string): number {
        let discount = 0;
        
        if (customerType === 'premium') {
            if (quantity > 100) {
                if (season === 'winter') {
                    discount = 0.3;
                } else if (season === 'summer') {
                    discount = 0.25;
                } else if (season === 'spring') {
                    discount = 0.2;
                } else {
                    discount = 0.15;
                }
            } else if (quantity > 50) {
                if (season === 'winter') {
                    discount = 0.2;
                } else if (season === 'summer') {
                    discount = 0.18;
                } else {
                    discount = 0.15;
                }
            } else if (quantity > 10) {
                discount = 0.1;
            } else {
                discount = 0.05;
            }
        } else if (customerType === 'standard') {
            if (quantity > 100) {
                if (season === 'winter') {
                    discount = 0.2;
                } else {
                    discount = 0.15;
                }
            } else if (quantity > 50) {
                discount = 0.1;
            } else if (quantity > 10) {
                discount = 0.05;
            }
        } else if (customerType === 'basic') {
            if (quantity > 50) {
                discount = 0.05;
            }
        }

        return price * (1 - discount);
    }

    // 테스트되지 않는 메서드들 (커버리지 이슈)
    public divideNumbers(a: number, b: number): number {
        if (b === 0) {
            throw new Error('Division by zero');
        }
        return a / b;
    }

    public calculateTax(amount: number, rate: number): number {
        if (rate < 0 || rate > 1) {
            throw new Error('Tax rate must be between 0 and 1');
        }
        return amount * rate;
    }

    // 사용되지 않는 메서드 (Dead code)
    private unusedPrivateMethod(): string {
        return 'This method is never called';
    }

    public anotherUnusedMethod(value: string): string {
        return value.toUpperCase();
    }
}