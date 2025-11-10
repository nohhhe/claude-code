// Stage 2: DatabaseService - 데이터 저장소 관리 분리
class DatabaseService {
    constructor() {
        this.users = [];
        this.userCounter = 1;
    }

    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    findUserById(id) {
        return this.users.find(user => user.id == id);
    }

    findUsersByRole(role) {
        return this.users.filter(user => user.role === role);
    }

    getAllUsers() {
        return [...this.users]; // 복사본 반환으로 데이터 보호
    }

    saveUser(userData) {
        const user = {
            id: this.userCounter++,
            ...userData,
            createdAt: new Date().toISOString()
        };

        this.users.push(user);
        return user;
    }

    updateUser(userId, updateData) {
        const userIndex = this.users.findIndex(user => user.id == userId);
        if (userIndex === -1) {
            return null;
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        return this.users[userIndex];
    }

    deleteUser(userId) {
        const userIndex = this.users.findIndex(user => user.id == userId);
        if (userIndex === -1) {
            return false;
        }

        this.users.splice(userIndex, 1);
        return true;
    }

    userExists(email) {
        return this.users.some(user => user.email === email);
    }

    getUserCount() {
        return this.users.length;
    }

    // 개발/테스트용 메서드
    seedTestData() {
        if (this.users.length === 0) {
            this.saveUser({
                username: '테스트관리자',
                email: 'admin@example.com',
                password: 'admin123', // Stage 3에서 해시화 예정
                role: 'admin',
                isActive: true
            });
        }
    }

    clearAllData() {
        this.users = [];
        this.userCounter = 1;
    }
}

module.exports = DatabaseService;