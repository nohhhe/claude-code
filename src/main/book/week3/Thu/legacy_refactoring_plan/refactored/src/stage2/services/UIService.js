// Stage 2: UIService - UI 관련 로직 분리
class UIService {
    constructor() {
        this.notifications = [];
    }

    showError(message) {
        this._addNotification('error', message);
        // 개발 환경에서는 alert, 실제 환경에서는 toast나 modal 사용
        if (typeof alert !== 'undefined') {
            alert('오류: ' + message);
        }
    }

    showSuccess(message) {
        this._addNotification('success', message);
        if (typeof alert !== 'undefined') {
            alert('성공: ' + message);
        }
    }

    showInfo(message) {
        this._addNotification('info', message);
        if (typeof alert !== 'undefined') {
            alert('알림: ' + message);
        }
    }

    updateUserInfo(currentUser) {
        if (typeof $ === 'undefined') return;

        const $userInfo = $('#user-info');
        if (currentUser) {
            $userInfo.html(
                `<span>환영합니다, ${currentUser.username}님</span>` +
                '<button onclick="userController.logout()">로그아웃</button>'
            );
            $('#order-section').show();
        } else {
            $userInfo.html('<span>로그인이 필요합니다.</span>');
            $('#order-section').hide();
        }
    }

    updateUserList(users, currentUser) {
        if (typeof $ === 'undefined') return;

        const $userList = $('#user-list');
        $userList.empty();

        if (currentUser && currentUser.role === 'admin') {
            $userList.append('<h3>사용자 목록 (관리자 전용)</h3>');
            
            users.forEach(user => {
                const userHtml = this._createUserListItemHtml(user);
                $userList.append(userHtml);
            });
        }
    }

    showAdminPanel(show = true) {
        if (typeof $ === 'undefined') return;
        
        if (show) {
            $('#admin-panel').show();
        } else {
            $('#admin-panel').hide();
        }
    }

    clearForm() {
        if (typeof $ === 'undefined') return;

        $('#username').val('');
        $('#email').val('');
        $('#password').val('');
    }

    clearUserList() {
        if (typeof $ === 'undefined') return;
        $('#user-list').empty();
    }

    _createUserListItemHtml(user) {
        const statusButton = user.isActive ? '비활성화' : '활성화';
        return `<div class="user-item">
            <span>${user.username} (${user.email}) - ${user.role}</span>
            <button onclick="userController.toggleUserStatus(${user.id})">${statusButton}</button>
        </div>`;
    }

    _addNotification(type, message) {
        this.notifications.push({
            id: this._generateNotificationId(),
            type: type,
            message: message,
            timestamp: new Date().toISOString()
        });

        // 알림 기록을 너무 많이 쌓지 않도록 제한
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(-50);
        }
    }

    _generateNotificationId() {
        return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 개발/테스트용 메서드
    getNotifications() {
        return [...this.notifications];
    }

    clearNotifications() {
        this.notifications = [];
    }
}

module.exports = UIService;