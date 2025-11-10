// Stage 2: AuthService - 인증 관련 로직 분리
class AuthService {
    constructor(passwordService) {
        this.passwordService = passwordService;
    }

    authenticate(users, email, password) {
        const user = users.find(user => user.email === email);
        if (!user) {
            return { success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' };
        }

        const isPasswordValid = this.passwordService.verify(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' };
        }

        if (!user.isActive) {
            return { success: false, message: '비활성화된 계정입니다.' };
        }

        return { success: true, user: user };
    }

    isAdmin(user) {
        return user && user.role === 'admin';
    }
}

module.exports = AuthService;