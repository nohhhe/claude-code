// Stage 1: Method Extraction Refactoring
// 목표: 큰 메서드들을 작은 단위로 분리하여 단일 책임 원칙 적용

class UserController {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.userCounter = 1;
        this.adminUsers = ['admin@example.com', 'manager@example.com'];
    }

    // 회원가입 - 메인 플로우만 담당
    registerUser(username, email, password) {
        if (!this._validateRegistrationInput(username, email, password)) {
            return false;
        }

        if (this._isEmailAlreadyExists(email)) {
            this.showError('이미 존재하는 이메일입니다.');
            return false;
        }

        const user = this._createNewUser(username, email, password);
        this.users.push(user);
        
        this._handleSuccessfulRegistration(user);
        return true;
    }

    // 로그인 - 메인 플로우만 담당
    loginUser(email, password) {
        if (!this._validateLoginInput(email, password)) {
            return false;
        }

        const user = this._findUserByCredentials(email, password);
        if (!user) {
            this.showError('이메일 또는 비밀번호가 틀렸습니다.');
            return false;
        }

        if (!this._isUserActive(user)) {
            this.showError('비활성화된 계정입니다.');
            return false;
        }

        this._setCurrentUser(user);
        this._handleSuccessfulLogin(user);
        return true;
    }

    // 사용자 상태 토글
    toggleUserStatus(userId) {
        const user = this._findUserById(userId);
        if (user) {
            user.isActive = !user.isActive;
            this.updateUserList();
        }
    }

    logout() {
        this._clearCurrentUser();
        this._updateUIAfterLogout();
        this.showSuccess('로그아웃되었습니다.');
    }

    // === 추출된 private 메서드들 ===

    // 회원가입 관련 추출된 메서드들
    _validateRegistrationInput(username, email, password) {
        if (!this._isValidUsername(username)) {
            this.showError('사용자명은 2자 이상이어야 합니다.');
            return false;
        }

        if (!this._isValidEmail(email)) {
            this.showError('유효한 이메일을 입력해주세요.');
            return false;
        }

        if (!this._isValidPassword(password)) {
            this.showError('비밀번호는 4자 이상이어야 합니다.');
            return false;
        }

        return true;
    }

    _isValidUsername(username) {
        return username && username.length >= 2;
    }

    _isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    _isValidPassword(password) {
        return password && password.length >= 4;
    }

    _isEmailAlreadyExists(email) {
        return this.users.some(user => user.email === email);
    }

    _createNewUser(username, email, password) {
        return {
            id: this.userCounter++,
            username: username,
            email: email,
            password: password, // Stage 3에서 암호화 처리 예정
            role: this._determineUserRole(email),
            createdAt: this._getCurrentTimestamp(),
            isActive: true
        };
    }

    _determineUserRole(email) {
        return this.adminUsers.includes(email) ? 'admin' : 'user';
    }

    _getCurrentTimestamp() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    _handleSuccessfulRegistration(user) {
        this.loginUser(user.email, user.password);
        this.updateUserList();
        this.clearForm();
        this.showSuccess('회원가입이 완료되었습니다.');
    }

    // 로그인 관련 추출된 메서드들
    _validateLoginInput(email, password) {
        if (!email || !password) {
            this.showError('이메일과 비밀번호를 입력해주세요.');
            return false;
        }
        return true;
    }

    _findUserByCredentials(email, password) {
        return this.users.find(user => 
            user.email === email && user.password === password
        );
    }

    _isUserActive(user) {
        return user.isActive;
    }

    _setCurrentUser(user) {
        this.currentUser = user;
        window.currentUser = user; // 전역 변수 - Stage 2에서 제거 예정
    }

    _handleSuccessfulLogin(user) {
        this.updateUserInfo();
        this.showSuccess(`환영합니다, ${user.username}님!`);
        this._showAdminPanelIfNeeded(user);
    }

    _showAdminPanelIfNeeded(user) {
        if (user.role === 'admin') {
            $('#admin-panel').show();
        }
    }

    // 공통 유틸리티 메서드들
    _findUserById(userId) {
        return this.users.find(user => user.id == userId);
    }

    _clearCurrentUser() {
        this.currentUser = null;
        window.currentUser = null;
    }

    _updateUIAfterLogout() {
        this.updateUserInfo();
        this.clearForm();
        $('#user-list').empty();
        $('#admin-panel').hide();
    }

    // === UI 관련 메서드들 (Stage 2에서 분리 예정) ===
    updateUserInfo() {
        const $userInfo = $('#user-info');
        if (this.currentUser) {
            $userInfo.html(
                `<span>환영합니다, ${this.currentUser.username}님</span>` +
                '<button onclick="userController.logout()">로그아웃</button>'
            );
            $('#order-section').show();
        } else {
            $userInfo.html('<span>로그인이 필요합니다.</span>');
            $('#order-section').hide();
        }
    }

    updateUserList() {
        const $userList = $('#user-list');
        $userList.empty();

        if (this._isCurrentUserAdmin()) {
            this._renderAdminUserList($userList);
        }
    }

    _isCurrentUserAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    _renderAdminUserList($userList) {
        $userList.append('<h3>사용자 목록 (관리자 전용)</h3>');
        
        this.users.forEach(user => {
            const userHtml = this._createUserListItemHtml(user);
            $userList.append(userHtml);
        });
    }

    _createUserListItemHtml(user) {
        const statusButton = user.isActive ? '비활성화' : '활성화';
        return `<div class="user-item">
            <span>${user.username} (${user.email}) - ${user.role}</span>
            <button onclick="userController.toggleUserStatus(${user.id})">${statusButton}</button>
        </div>`;
    }

    showError(message) {
        alert('오류: ' + message); // Stage 2에서 개선 예정
    }

    showSuccess(message) {
        alert('성공: ' + message); // Stage 2에서 개선 예정
    }

    clearForm() {
        $('#username').val('');
        $('#email').val('');
        $('#password').val('');
    }

    // 개발용 메서드
    _addTestData() {
        this.users.push({
            id: 999,
            username: '테스트관리자',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            createdAt: this._getCurrentTimestamp(),
            isActive: true
        });
    }
}

// Stage 1 개선사항:
// ✅ 대형 메서드들을 작은 단위로 분해
// ✅ 단일 책임 원칙 적용
// ✅ 가독성 향상 및 유지보수성 개선
// ✅ private 메서드 명명 규칙 적용 (_prefix)
// ✅ ES6+ 문법 활용 (const, let, arrow functions, template literals)

// 다음 단계 개선 예정사항:
// 🔄 Stage 2: 의존성 주입 적용
// 🔄 Stage 3: 에러 핸들링 개선