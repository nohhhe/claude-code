// Stage 2: Dependency Injection Refactoring
// 목표: 의존성 분리, 단일 책임 원칙 강화, 테스트 가능성 향상

const AuthService = require('./services/AuthService');
const ValidationService = require('./services/ValidationService');
const DatabaseService = require('./services/DatabaseService');
const EmailService = require('./services/EmailService');
const UIService = require('./services/UIService');
const PasswordService = require('./services/PasswordService');

class UserController {
    constructor(dependencies = {}) {
        // 의존성 주입 - 테스트에서 mock 객체 주입 가능
        this.passwordService = dependencies.passwordService || new PasswordService();
        this.authService = dependencies.authService || new AuthService(this.passwordService);
        this.validationService = dependencies.validationService || new ValidationService();
        this.databaseService = dependencies.databaseService || new DatabaseService();
        this.emailService = dependencies.emailService || new EmailService();
        this.uiService = dependencies.uiService || new UIService();

        this.currentUser = null;
        this.adminUsers = ['admin@example.com', 'manager@example.com'];

        // 테스트 데이터 초기화
        this._initializeTestData();
    }

    // === Public API 메서드들 ===

    async registerUser(username, email, password) {
        try {
            // 1. 입력 유효성 검증
            const validation = this.validationService.validateRegistrationData(username, email, password);
            if (!validation.isValid) {
                this.uiService.showError(validation.message);
                return { success: false, message: validation.message };
            }

            // 2. 중복 이메일 체크
            if (this.databaseService.userExists(email)) {
                const message = '이미 존재하는 이메일입니다.';
                this.uiService.showError(message);
                return { success: false, message: message };
            }

            // 3. 사용자 데이터 생성
            const userData = this._prepareUserData(username, email, password);
            
            // 4. 데이터베이스에 저장
            const savedUser = this.databaseService.saveUser(userData);

            // 5. 환영 이메일 발송
            await this.emailService.sendWelcomeEmail(savedUser);

            // 6. 자동 로그인 처리
            await this.loginUser(email, password);

            // 7. UI 업데이트
            this._handleSuccessfulRegistration();

            return { 
                success: true, 
                user: this._sanitizeUser(savedUser),
                message: '회원가입이 완료되었습니다.'
            };

        } catch (error) {
            console.error('Registration error:', error);
            const message = '회원가입 중 오류가 발생했습니다.';
            this.uiService.showError(message);
            return { success: false, message: message };
        }
    }

    async loginUser(email, password) {
        try {
            // 1. 입력 유효성 검증
            const validation = this.validationService.validateLoginData(email, password);
            if (!validation.isValid) {
                this.uiService.showError(validation.message);
                return { success: false, message: validation.message };
            }

            // 2. 인증 처리
            const authResult = this.authService.authenticate(
                this.databaseService.getAllUsers(),
                email,
                password
            );

            if (!authResult.success) {
                this.uiService.showError(authResult.message);
                return authResult;
            }

            // 3. 현재 사용자 설정
            this._setCurrentUser(authResult.user);

            // 4. UI 업데이트
            this._handleSuccessfulLogin(authResult.user);

            return {
                success: true,
                user: this._sanitizeUser(authResult.user),
                message: `환영합니다, ${authResult.user.username}님!`
            };

        } catch (error) {
            console.error('Login error:', error);
            const message = '로그인 중 오류가 발생했습니다.';
            this.uiService.showError(message);
            return { success: false, message: message };
        }
    }

    async toggleUserStatus(userId) {
        try {
            if (!this.currentUser || !this.authService.isAdmin(this.currentUser)) {
                const message = '관리자 권한이 필요합니다.';
                this.uiService.showError(message);
                return { success: false, message: message };
            }

            const user = this.databaseService.findUserById(userId);
            if (!user) {
                const message = '사용자를 찾을 수 없습니다.';
                this.uiService.showError(message);
                return { success: false, message: message };
            }

            // 상태 토글
            const newStatus = !user.isActive;
            const updatedUser = this.databaseService.updateUser(userId, { isActive: newStatus });

            // 상태 변경 이메일 발송
            await this.emailService.sendAccountStatusEmail(updatedUser, newStatus);

            // UI 업데이트
            this.uiService.updateUserList(
                this.databaseService.getAllUsers(),
                this.currentUser
            );

            const message = `사용자 상태가 ${newStatus ? '활성화' : '비활성화'}되었습니다.`;
            this.uiService.showSuccess(message);

            return { 
                success: true, 
                user: this._sanitizeUser(updatedUser),
                message: message
            };

        } catch (error) {
            console.error('Toggle user status error:', error);
            const message = '사용자 상태 변경 중 오류가 발생했습니다.';
            this.uiService.showError(message);
            return { success: false, message: message };
        }
    }

    logout() {
        try {
            this._clearCurrentUser();
            this._handleSuccessfulLogout();
            
            const message = '로그아웃되었습니다.';
            this.uiService.showSuccess(message);
            
            return { success: true, message: message };

        } catch (error) {
            console.error('Logout error:', error);
            const message = '로그아웃 중 오류가 발생했습니다.';
            this.uiService.showError(message);
            return { success: false, message: message };
        }
    }

    // === Getter 메서드들 ===

    getCurrentUser() {
        return this.currentUser ? this._sanitizeUser(this.currentUser) : null;
    }

    getAllUsers() {
        if (!this.currentUser || !this.authService.isAdmin(this.currentUser)) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }

        const users = this.databaseService.getAllUsers().map(user => this._sanitizeUser(user));
        return { success: true, users: users };
    }

    getUserStats() {
        if (!this.currentUser || !this.authService.isAdmin(this.currentUser)) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }

        const totalUsers = this.databaseService.getUserCount();
        const activeUsers = this.databaseService.getAllUsers().filter(user => user.isActive).length;
        const adminUsers = this.databaseService.findUsersByRole('admin').length;

        return {
            success: true,
            stats: {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers,
                admins: adminUsers
            }
        };
    }

    // === Private Helper 메서드들 ===

    _prepareUserData(username, email, password) {
        return {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: this.passwordService.hash(password), // 비밀번호 해싱
            role: this._determineUserRole(email),
            isActive: true
        };
    }

    _determineUserRole(email) {
        return this.adminUsers.includes(email) ? 'admin' : 'user';
    }

    _setCurrentUser(user) {
        this.currentUser = user;
        // 전역 변수 설정 (레거시 호환성, 향후 제거 예정)
        if (typeof window !== 'undefined') {
            window.currentUser = user;
        }
    }

    _clearCurrentUser() {
        this.currentUser = null;
        if (typeof window !== 'undefined') {
            window.currentUser = null;
        }
    }

    _sanitizeUser(user) {
        // 비밀번호 등 민감한 정보 제외하고 반환
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    _handleSuccessfulRegistration() {
        this.uiService.updateUserList(
            this.databaseService.getAllUsers(),
            this.currentUser
        );
        this.uiService.clearForm();
        this.uiService.showSuccess('회원가입이 완료되었습니다.');
    }

    _handleSuccessfulLogin(user) {
        this.uiService.updateUserInfo(user);
        this.uiService.showSuccess(`환영합니다, ${user.username}님!`);
        
        if (this.authService.isAdmin(user)) {
            this.uiService.showAdminPanel(true);
            this.uiService.updateUserList(
                this.databaseService.getAllUsers(),
                user
            );
        }
    }

    _handleSuccessfulLogout() {
        this.uiService.updateUserInfo(null);
        this.uiService.clearForm();
        this.uiService.clearUserList();
        this.uiService.showAdminPanel(false);
    }

    _initializeTestData() {
        // 개발 환경에서만 테스트 데이터 추가
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            this.databaseService.seedTestData();
        }
    }

    // === 개발/테스트용 메서드들 ===

    _getServices() {
        return {
            auth: this.authService,
            validation: this.validationService,
            database: this.databaseService,
            email: this.emailService,
            ui: this.uiService,
            password: this.passwordService
        };
    }

    _resetForTesting() {
        this.currentUser = null;
        this.databaseService.clearAllData();
        this.emailService.clearEmailQueue();
        this.uiService.clearNotifications();
    }
}

module.exports = UserController;

// Stage 2 개선사항:
// ✅ 의존성 주입 패턴 적용
// ✅ 각 서비스별 단일 책임 원칙 적용
// ✅ 테스트 가능성 향상 (Mock 주입 가능)
// ✅ 관심사 분리 (Auth, Validation, Database, Email, UI)
// ✅ 에러 처리 구조화
// ✅ 비동기 처리 지원 (async/await)
// ✅ 보안 개선 (비밀번호 해싱, 데이터 sanitization)

// 다음 단계 개선 예정사항:
// 🔄 Stage 3: 고급 에러 핸들링 및 예외 처리 개선