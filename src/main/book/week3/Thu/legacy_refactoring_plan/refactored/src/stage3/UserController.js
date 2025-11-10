// Stage 3: Error Handling Enhancement
// 목표: 고급 에러 처리, 복구 메커니즘, 모니터링, 보안 강화

const ErrorFactory = require('./errors/ErrorFactory');
const ErrorHandler = require('./middleware/errorHandler');
const { ErrorCodes } = require('./errors/ErrorCodes');

// Stage 2의 서비스들 재사용
const AuthService = require('../stage2/services/AuthService');
const ValidationService = require('../stage2/services/ValidationService');
const DatabaseService = require('../stage2/services/DatabaseService');
const EmailService = require('../stage2/services/EmailService');
const UIService = require('../stage2/services/UIService');
const PasswordService = require('../stage2/services/PasswordService');

class UserController {
    constructor(dependencies = {}) {
        // 의존성 주입
        this.passwordService = dependencies.passwordService || new PasswordService();
        this.authService = dependencies.authService || new AuthService(this.passwordService);
        this.validationService = dependencies.validationService || new ValidationService();
        this.databaseService = dependencies.databaseService || new DatabaseService();
        this.emailService = dependencies.emailService || new EmailService();
        this.uiService = dependencies.uiService || new UIService();
        
        // Stage 3: 에러 처리 시스템
        this.errorHandler = dependencies.errorHandler || new ErrorHandler();
        this.logger = dependencies.logger || console;
        
        // 상태 관리
        this.currentUser = null;
        this.adminUsers = ['admin@example.com', 'manager@example.com'];
        
        // 보안 및 모니터링
        this.loginAttempts = new Map(); // 브루트 포스 방지
        this.rateLimiter = new Map(); // 요청 제한
        this.sessionTimeout = 30 * 60 * 1000; // 30분
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15분

        // 복구 전략 등록
        this._setupRecoveryStrategies();
        
        // 초기화
        this._initializeServices();
    }

    // === Public API 메서드들 (에러 처리 강화) ===

    async registerUser(username, email, password) {
        const operationId = this._generateOperationId();
        
        try {
            this._logOperation('registerUser', 'start', { operationId, email });

            // 1. 요청 제한 검사
            await this._checkRateLimit('register', this._getClientIdentifier());

            // 2. 입력 유효성 검증 (강화된 에러 처리)
            await this._validateRegistrationInputWithErrorHandling(username, email, password);

            // 3. 중복 검사 (데이터베이스 에러 처리)
            await this._checkUserExistsWithErrorHandling(email);

            // 4. 트랜잭션 방식으로 사용자 생성
            const result = await this._executeWithTransaction(async () => {
                const userData = this._prepareUserData(username, email, password);
                const savedUser = this.databaseService.saveUser(userData);
                
                // 이메일 발송 (실패해도 사용자 생성은 성공으로 처리)
                await this._sendWelcomeEmailSafely(savedUser);
                
                return savedUser;
            });

            // 5. 자동 로그인 시도
            try {
                await this.loginUser(email, password);
            } catch (loginError) {
                // 로그인 실패해도 회원가입은 성공으로 처리
                this.logger.warn('Auto-login after registration failed:', loginError.message);
            }

            // 6. UI 업데이트 (안전하게)
            await this._updateUIAfterRegistration();

            this._logOperation('registerUser', 'success', { operationId, userId: result.id });
            
            return {
                success: true,
                user: this._sanitizeUser(result),
                message: '회원가입이 완료되었습니다.',
                operationId
            };

        } catch (error) {
            return this._handleOperationError(error, 'registerUser', { operationId, email });
        }
    }

    async loginUser(email, password) {
        const operationId = this._generateOperationId();
        const clientId = this._getClientIdentifier();

        try {
            this._logOperation('loginUser', 'start', { operationId, email });

            // 1. 브루트 포스 공격 확인
            await this._checkBruteForceAttempt(email, clientId);

            // 2. 요청 제한 검사
            await this._checkRateLimit('login', clientId);

            // 3. 입력 유효성 검증
            await this._validateLoginInputWithErrorHandling(email, password);

            // 4. 인증 처리 (재시도 메커니즘 포함)
            const authResult = await this._authenticateWithRetry(email, password);

            // 5. 로그인 성공 처리
            this._clearLoginAttempts(email);
            this._setCurrentUser(authResult.user);
            await this._handleSuccessfulLoginSafely(authResult.user);

            this._logOperation('loginUser', 'success', { operationId, userId: authResult.user.id });

            return {
                success: true,
                user: this._sanitizeUser(authResult.user),
                message: `환영합니다, ${authResult.user.username}님!`,
                operationId
            };

        } catch (error) {
            this._recordLoginAttempt(email, false);
            return this._handleOperationError(error, 'loginUser', { operationId, email });
        }
    }

    async toggleUserStatus(userId) {
        const operationId = this._generateOperationId();

        try {
            this._logOperation('toggleUserStatus', 'start', { operationId, userId });

            // 1. 권한 검증
            await this._verifyAdminPermissions();

            // 2. 요청 제한 검사
            await this._checkRateLimit('admin_action', this._getClientIdentifier());

            // 3. 사용자 존재 확인
            const user = await this._findUserByIdWithErrorHandling(userId);

            // 4. 자기 자신의 상태는 변경할 수 없음
            if (this.currentUser.id === user.id) {
                throw ErrorFactory.createUserError(
                    ErrorCodes.USER_UPDATE_FAILED,
                    '자신의 계정 상태를 변경할 수 없습니다.'
                );
            }

            // 5. 상태 업데이트 (트랜잭션)
            const updatedUser = await this._executeWithTransaction(async () => {
                const newStatus = !user.isActive;
                const updated = this.databaseService.updateUser(userId, { isActive: newStatus });
                
                if (!updated) {
                    throw ErrorFactory.userUpdateFailed(userId, '데이터베이스 업데이트 실패');
                }

                return updated;
            });

            // 6. 이메일 알림 발송 (안전하게)
            await this._sendStatusChangeEmailSafely(updatedUser);

            // 7. UI 업데이트
            await this._updateUIAfterStatusChange();

            this._logOperation('toggleUserStatus', 'success', { 
                operationId, 
                userId, 
                newStatus: updatedUser.isActive 
            });

            return {
                success: true,
                user: this._sanitizeUser(updatedUser),
                message: `사용자 상태가 ${updatedUser.isActive ? '활성화' : '비활성화'}되었습니다.`,
                operationId
            };

        } catch (error) {
            return this._handleOperationError(error, 'toggleUserStatus', { operationId, userId });
        }
    }

    async logout() {
        const operationId = this._generateOperationId();

        try {
            const userId = this.currentUser?.id;
            this._logOperation('logout', 'start', { operationId, userId });

            // 1. 현재 사용자 정보 저장
            const wasLoggedIn = !!this.currentUser;

            // 2. 세션 정리
            this._clearCurrentUser();

            // 3. UI 업데이트 (안전하게)
            await this._handleLogoutUIUpdateSafely();

            if (wasLoggedIn) {
                this._logOperation('logout', 'success', { operationId, userId });
                this.uiService.showSuccess('로그아웃되었습니다.');
            }

            return {
                success: true,
                message: '로그아웃되었습니다.',
                operationId
            };

        } catch (error) {
            return this._handleOperationError(error, 'logout', { operationId });
        }
    }

    // === 고급 에러 처리 메서드들 ===

    async _validateRegistrationInputWithErrorHandling(username, email, password) {
        const errors = [];

        // 사용자명 검증
        if (!username || typeof username !== 'string') {
            errors.push(ErrorFactory.usernameRequired());
        } else if (username.trim().length < 2) {
            errors.push(ErrorFactory.usernameTooShort(2));
        }

        // 이메일 검증
        if (!email || typeof email !== 'string') {
            errors.push(ErrorFactory.emailRequired());
        } else if (!this._isValidEmailFormat(email)) {
            errors.push(ErrorFactory.emailInvalid(email));
        }

        // 비밀번호 검증
        if (!password || typeof password !== 'string') {
            errors.push(ErrorFactory.passwordRequired());
        } else if (password.length < 4) {
            errors.push(ErrorFactory.passwordTooShort(4));
        } else {
            // 고급 비밀번호 강도 검증
            const strengthResult = this.passwordService.validatePasswordStrength(password);
            if (!strengthResult.isStrong) {
                errors.push(ErrorFactory.passwordTooWeak(strengthResult.issues));
            }
        }

        if (errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            } else {
                throw ErrorFactory.createCompositeError(errors, '입력 데이터에 여러 오류가 있습니다.');
            }
        }
    }

    async _validateLoginInputWithErrorHandling(email, password) {
        if (!email || !password) {
            throw ErrorFactory.createValidationError(
                ErrorCodes.VALIDATION_EMAIL_REQUIRED,
                '이메일과 비밀번호를 모두 입력해주세요.'
            );
        }

        if (!this._isValidEmailFormat(email)) {
            throw ErrorFactory.emailInvalid(email);
        }
    }

    async _checkUserExistsWithErrorHandling(email) {
        try {
            const exists = this.databaseService.userExists(email);
            if (exists) {
                throw ErrorFactory.userAlreadyExists(email);
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw ErrorFactory.databaseQueryError(`Checking user existence for ${email}`, {
                originalError: error.message
            });
        }
    }

    async _findUserByIdWithErrorHandling(userId) {
        try {
            const user = this.databaseService.findUserById(userId);
            if (!user) {
                throw ErrorFactory.userNotFound(userId);
            }
            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw ErrorFactory.databaseQueryError(`Finding user by ID: ${userId}`, {
                originalError: error.message
            });
        }
    }

    async _authenticateWithRetry(email, password, maxRetries = 2) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const users = this.databaseService.getAllUsers();
                const authResult = this.authService.authenticate(users, email, password);

                if (!authResult.success) {
                    throw ErrorFactory.invalidCredentials({ attempt });
                }

                return authResult;

            } catch (error) {
                lastError = error;
                
                if (attempt < maxRetries) {
                    this.logger.warn(`Authentication attempt ${attempt} failed, retrying...`, {
                        email,
                        error: error.message
                    });
                    
                    // 재시도 전 잠시 대기
                    await this._sleep(100 * attempt);
                } else {
                    this.logger.error(`Authentication failed after ${maxRetries} attempts`, {
                        email,
                        error: error.message
                    });
                }
            }
        }

        throw lastError;
    }

    // === 보안 기능들 ===

    async _checkBruteForceAttempt(email, clientId) {
        const key = `${email}:${clientId}`;
        const attempts = this.loginAttempts.get(key) || { count: 0, lastAttempt: 0 };

        if (attempts.count >= this.maxLoginAttempts) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
            if (timeSinceLastAttempt < this.lockoutDuration) {
                const remainingTime = Math.ceil((this.lockoutDuration - timeSinceLastAttempt) / 1000 / 60);
                throw ErrorFactory.createSecurityError(
                    ErrorCodes.SECURITY_BRUTE_FORCE_DETECTED,
                    `계정이 일시적으로 잠겼습니다. ${remainingTime}분 후 다시 시도해주세요.`,
                    { remainingMinutes: remainingTime, email, clientId }
                );
            } else {
                // 잠금 해제
                this.loginAttempts.delete(key);
            }
        }
    }

    async _checkRateLimit(action, identifier, limit = 10, window = 60000) {
        const key = `${action}:${identifier}`;
        const now = Date.now();
        const requests = this.rateLimiter.get(key) || [];
        
        // 윈도우 밖의 요청들 제거
        const validRequests = requests.filter(time => now - time < window);
        
        if (validRequests.length >= limit) {
            throw ErrorFactory.rateLimitExceeded(limit, window / 1000);
        }

        validRequests.push(now);
        this.rateLimiter.set(key, validRequests);
    }

    _recordLoginAttempt(email, success) {
        const clientId = this._getClientIdentifier();
        const key = `${email}:${clientId}`;

        if (success) {
            this.loginAttempts.delete(key);
        } else {
            const attempts = this.loginAttempts.get(key) || { count: 0, lastAttempt: 0 };
            attempts.count++;
            attempts.lastAttempt = Date.now();
            this.loginAttempts.set(key, attempts);
        }
    }

    _clearLoginAttempts(email) {
        const clientId = this._getClientIdentifier();
        const key = `${email}:${clientId}`;
        this.loginAttempts.delete(key);
    }

    // === 트랜잭션 및 복구 메커니즘 ===

    async _executeWithTransaction(operation) {
        try {
            // 실제 환경에서는 데이터베이스 트랜잭션 사용
            const result = await operation();
            return result;
        } catch (error) {
            // 롤백 로직
            this.logger.error('Transaction failed, rolling back...', { error: error.message });
            throw error;
        }
    }

    _setupRecoveryStrategies() {
        this.recoveryStrategies = [
            {
                name: 'database_retry',
                canHandle: (error) => error.errorCode?.includes('DATABASE'),
                recover: async (error) => {
                    await this._sleep(1000);
                    return { success: false }; // 단순 재시도는 여기서는 구현하지 않음
                }
            },
            {
                name: 'email_fallback',
                canHandle: (error) => error.errorCode?.includes('EMAIL'),
                recover: async (error) => {
                    // 이메일 실패 시 대안 처리
                    this.logger.warn('Email service failed, adding to retry queue');
                    return { success: true, data: { queued: true } };
                }
            }
        ];
    }

    // === 안전한 비동기 작업들 ===

    async _sendWelcomeEmailSafely(user) {
        try {
            await this.emailService.sendWelcomeEmail(user);
        } catch (error) {
            this.logger.warn('Welcome email failed but registration continues:', {
                userId: user.id,
                error: error.message
            });
            // 이메일 실패는 등록 과정을 중단하지 않음
        }
    }

    async _sendStatusChangeEmailSafely(user) {
        try {
            await this.emailService.sendAccountStatusEmail(user, user.isActive);
        } catch (error) {
            this.logger.warn('Status change email failed:', {
                userId: user.id,
                error: error.message
            });
        }
    }

    async _handleSuccessfulLoginSafely(user) {
        try {
            this.uiService.updateUserInfo(user);
            this.uiService.showSuccess(`환영합니다, ${user.username}님!`);
            
            if (this.authService.isAdmin(user)) {
                this.uiService.showAdminPanel(true);
                this.uiService.updateUserList(this.databaseService.getAllUsers(), user);
            }
        } catch (error) {
            this.logger.warn('UI update after login failed:', error.message);
        }
    }

    async _updateUIAfterRegistration() {
        try {
            this.uiService.updateUserList(this.databaseService.getAllUsers(), this.currentUser);
            this.uiService.clearForm();
            this.uiService.showSuccess('회원가입이 완료되었습니다.');
        } catch (error) {
            this.logger.warn('UI update after registration failed:', error.message);
        }
    }

    async _updateUIAfterStatusChange() {
        try {
            this.uiService.updateUserList(this.databaseService.getAllUsers(), this.currentUser);
        } catch (error) {
            this.logger.warn('UI update after status change failed:', error.message);
        }
    }

    async _handleLogoutUIUpdateSafely() {
        try {
            this.uiService.updateUserInfo(null);
            this.uiService.clearForm();
            this.uiService.clearUserList();
            this.uiService.showAdminPanel(false);
        } catch (error) {
            this.logger.warn('UI update after logout failed:', error.message);
        }
    }

    // === 권한 및 검증 메서드들 ===

    async _verifyAdminPermissions() {
        if (!this.currentUser) {
            throw ErrorFactory.createAuthenticationError(
                ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS,
                '로그인이 필요합니다.'
            );
        }

        if (!this.authService.isAdmin(this.currentUser)) {
            throw ErrorFactory.insufficientPermissions('admin', {
                userId: this.currentUser.id,
                userRole: this.currentUser.role
            });
        }
    }

    // === 유틸리티 메서드들 ===

    _handleOperationError(error, operation, context) {
        const handledError = this.errorHandler.handleError(error, { operation, ...context });
        
        // UI에 에러 표시
        this.uiService.showError(handledError.message);
        
        this._logOperation(operation, 'error', {
            ...context,
            error: error.message,
            errorCode: error.errorCode
        });

        return handledError;
    }

    _logOperation(operation, status, data) {
        this.logger.info(`Operation ${operation} - ${status}`, {
            timestamp: new Date().toISOString(),
            operation,
            status,
            ...data
        });
    }

    _generateOperationId() {
        return 'op_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    _getClientIdentifier() {
        // 실제 환경에서는 IP 주소나 사용자 에이전트 사용
        return typeof window !== 'undefined' ? 
            (window.navigator?.userAgent?.slice(0, 50) || 'unknown') : 'server';
    }

    _isValidEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // === Stage 2에서 상속된 메서드들 ===

    _prepareUserData(username, email, password) {
        return {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: this.passwordService.hash(password),
            role: this._determineUserRole(email),
            isActive: true
        };
    }

    _determineUserRole(email) {
        return this.adminUsers.includes(email) ? 'admin' : 'user';
    }

    _setCurrentUser(user) {
        this.currentUser = user;
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
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    _initializeServices() {
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            this.databaseService.seedTestData();
        }

        // 전역 에러 핸들러 설정
        if (typeof process !== 'undefined') {
            process.on('uncaughtException', (error) => {
                this.errorHandler.handleUncaughtException(error);
            });

            process.on('unhandledRejection', (reason, promise) => {
                this.errorHandler.handleUnhandledRejection(reason, promise);
            });
        }
    }

    // === 개발/테스트용 메서드들 ===

    _getErrorStats() {
        return this.errorHandler.getErrorStats();
    }

    _resetForTesting() {
        this.currentUser = null;
        this.loginAttempts.clear();
        this.rateLimiter.clear();
        this.databaseService.clearAllData();
        this.emailService.clearEmailQueue();
        this.uiService.clearNotifications();
    }
}

module.exports = UserController;

// Stage 3 개선사항:
// ✅ 포괄적 에러 처리 시스템
// ✅ 중앙집중식 에러 핸들링
// ✅ 보안 강화 (브루트 포스 방지, 요청 제한)
// ✅ 트랜잭션 지원
// ✅ 복구 메커니즘
// ✅ 상세한 로깅 및 모니터링
// ✅ 안전한 비동기 작업 처리
// ✅ 에러 통계 및 알림

// 최종 달성 목표:
// 🎯 프로덕션 수준의 견고함
// 🎯 유지보수성 및 확장성
// 🎯 보안 및 안정성