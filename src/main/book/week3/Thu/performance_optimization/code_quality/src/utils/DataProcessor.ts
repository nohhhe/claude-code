// 데이터 처리 유틸리티 - 중복 코드와 복잡도 이슈
export class DataProcessor {

    // 중복 코드 패턴 3
    public processUserArray(users: any[]): any[] {
        const result: any[] = [];
        
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user && user.active === true) {
                const processedUser = {
                    id: user.id,
                    name: user.name ? user.name.trim() : '',
                    email: user.email ? user.email.toLowerCase() : '',
                    createdAt: user.createdAt || new Date(),
                    isValid: true
                };
                result.push(processedUser);
            }
        }
        
        return result;
    }

    // 중복 코드 패턴 4 (거의 동일한 처리 로직)
    public processProductArray(products: any[]): any[] {
        const result: any[] = [];
        
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (product && product.active === true) {
                const processedProduct = {
                    id: product.id,
                    name: product.name ? product.name.trim() : '',
                    description: product.description ? product.description.toLowerCase() : '',
                    createdAt: product.createdAt || new Date(),
                    isValid: true
                };
                result.push(processedProduct);
            }
        }
        
        return result;
    }

    // 매우 복잡한 메서드 (Cyclomatic Complexity가 높음)
    public validateAndTransformData(data: any, type: string, options?: any): any {
        if (!data) {
            return null;
        }

        let result: any = {};

        if (type === 'user') {
            if (data.age) {
                if (data.age < 18) {
                    result.category = 'minor';
                    if (data.hasParent) {
                        result.status = 'approved';
                    } else {
                        result.status = 'rejected';
                    }
                } else if (data.age < 65) {
                    result.category = 'adult';
                    if (data.hasJob) {
                        if (data.income > 50000) {
                            result.status = 'premium';
                        } else if (data.income > 25000) {
                            result.status = 'standard';
                        } else {
                            result.status = 'basic';
                        }
                    } else {
                        result.status = 'unemployed';
                    }
                } else {
                    result.category = 'senior';
                    if (data.hasPension) {
                        result.status = 'retired';
                    } else {
                        result.status = 'working_senior';
                    }
                }
            }
        } else if (type === 'product') {
            if (data.price) {
                if (data.price < 10) {
                    result.priceCategory = 'low';
                    if (data.quality > 7) {
                        result.recommendation = 'highly_recommended';
                    } else if (data.quality > 5) {
                        result.recommendation = 'recommended';
                    } else {
                        result.recommendation = 'not_recommended';
                    }
                } else if (data.price < 100) {
                    result.priceCategory = 'medium';
                    if (data.quality > 8) {
                        result.recommendation = 'best_value';
                    } else if (data.quality > 6) {
                        result.recommendation = 'good_value';
                    } else {
                        result.recommendation = 'average';
                    }
                } else {
                    result.priceCategory = 'high';
                    if (data.quality > 9) {
                        result.recommendation = 'luxury';
                    } else {
                        result.recommendation = 'overpriced';
                    }
                }
            }
        } else if (type === 'order') {
            if (data.total) {
                if (data.total > 500) {
                    result.shipping = 'free';
                    if (data.priority) {
                        result.delivery = 'next_day';
                    } else {
                        result.delivery = 'standard';
                    }
                } else if (data.total > 100) {
                    result.shipping = 'reduced';
                    result.delivery = 'standard';
                } else {
                    result.shipping = 'standard';
                    result.delivery = 'economy';
                }
            }
        }

        // 추가 옵션 처리
        if (options) {
            if (options.applyDiscount) {
                if (options.discountType === 'percentage') {
                    if (options.discountValue > 50) {
                        result.discount = 'high';
                    } else if (options.discountValue > 20) {
                        result.discount = 'medium';
                    } else {
                        result.discount = 'low';
                    }
                }
            }
        }

        return result;
    }

    // 테스트되지 않는 메서드들
    public formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    public generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    // 사용되지 않는 메서드
    private internalHelper(value: any): boolean {
        return typeof value === 'object' && value !== null;
    }
}