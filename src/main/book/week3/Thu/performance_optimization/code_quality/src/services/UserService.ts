import axios from 'axios';

// 사용자 서비스 - API 호출 및 데이터 처리
export class UserService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'https://api.example.com';
    }

    // 중복 코드 패턴 5
    public async getUserById(id: string): Promise<any> {
        try {
            if (!id) {
                throw new Error('User ID is required');
            }
            
            if (id.length < 1) {
                throw new Error('Invalid user ID');
            }

            const response = await axios.get(`${this.baseUrl}/users/${id}`);
            
            if (!response.data) {
                throw new Error('No user data received');
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // 중복 코드 패턴 6 (유사한 에러 처리 패턴)
    public async getUserByEmail(email: string): Promise<any> {
        try {
            if (!email) {
                throw new Error('Email is required');
            }
            
            if (email.length < 1) {
                throw new Error('Invalid email');
            }

            const response = await axios.get(`${this.baseUrl}/users?email=${email}`);
            
            if (!response.data) {
                throw new Error('No user data received');
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
        }
    }

    // 복잡도가 높은 사용자 생성 메서드
    public async createUser(userData: any): Promise<any> {
        if (!userData) {
            throw new Error('User data is required');
        }

        // 복잡한 유효성 검사
        if (!userData.email) {
            throw new Error('Email is required');
        } else if (!this.isValidEmail(userData.email)) {
            throw new Error('Invalid email format');
        } else if (await this.emailExists(userData.email)) {
            throw new Error('Email already exists');
        }

        if (!userData.name) {
            throw new Error('Name is required');
        } else if (userData.name.length < 2) {
            throw new Error('Name too short');
        } else if (userData.name.length > 50) {
            throw new Error('Name too long');
        }

        if (!userData.age) {
            throw new Error('Age is required');
        } else if (userData.age < 13) {
            throw new Error('User must be at least 13 years old');
        } else if (userData.age > 120) {
            throw new Error('Invalid age');
        }

        if (userData.phone) {
            if (!this.isValidPhone(userData.phone)) {
                throw new Error('Invalid phone format');
            } else if (await this.phoneExists(userData.phone)) {
                throw new Error('Phone already exists');
            }
        }

        // 사용자 타입별 추가 검증
        if (userData.type === 'premium') {
            if (!userData.creditCard) {
                throw new Error('Credit card required for premium users');
            } else if (!this.isValidCreditCard(userData.creditCard)) {
                throw new Error('Invalid credit card');
            }
        } else if (userData.type === 'business') {
            if (!userData.companyName) {
                throw new Error('Company name required for business users');
            } else if (!userData.taxId) {
                throw new Error('Tax ID required for business users');
            }
        }

        try {
            const response = await axios.post(`${this.baseUrl}/users`, userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // 도우미 메서드들 (일부는 테스트되지 않음)
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    private isValidCreditCard(card: string): boolean {
        return card.length === 16 && /^\d+$/.test(card);
    }

    // 테스트되지 않는 메서드들
    private async emailExists(email: string): Promise<boolean> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/check-email/${email}`);
            return response.data.exists;
        } catch {
            return false;
        }
    }

    private async phoneExists(phone: string): Promise<boolean> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/check-phone/${phone}`);
            return response.data.exists;
        } catch {
            return false;
        }
    }

    // 사용되지 않는 메서드
    public async deleteUser(id: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/users/${id}`);
    }

    public async updateUserLastLogin(id: string): Promise<void> {
        await axios.patch(`${this.baseUrl}/users/${id}/last-login`);
    }
}