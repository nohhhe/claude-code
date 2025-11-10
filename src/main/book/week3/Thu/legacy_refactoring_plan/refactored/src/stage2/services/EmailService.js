// Stage 2: EmailService - 이메일 관련 기능 분리
class EmailService {
    constructor() {
        this.emailQueue = [];
    }

    // 실제 환경에서는 외부 이메일 서비스 연동
    sendWelcomeEmail(user) {
        const emailContent = {
            to: user.email,
            subject: '회원가입을 환영합니다!',
            body: `안녕하세요 ${user.username}님, 회원가입이 완료되었습니다.`,
            timestamp: new Date().toISOString(),
            type: 'welcome'
        };

        return this._queueEmail(emailContent);
    }

    sendPasswordResetEmail(user, resetToken) {
        const emailContent = {
            to: user.email,
            subject: '비밀번호 재설정 요청',
            body: `비밀번호 재설정 토큰: ${resetToken}`,
            timestamp: new Date().toISOString(),
            type: 'password_reset'
        };

        return this._queueEmail(emailContent);
    }

    sendAccountStatusEmail(user, newStatus) {
        const emailContent = {
            to: user.email,
            subject: '계정 상태 변경 알림',
            body: `귀하의 계정이 ${newStatus ? '활성화' : '비활성화'}되었습니다.`,
            timestamp: new Date().toISOString(),
            type: 'status_change'
        };

        return this._queueEmail(emailContent);
    }

    _queueEmail(emailContent) {
        this.emailQueue.push({
            id: this._generateEmailId(),
            ...emailContent,
            status: 'pending'
        });

        // 실제 환경에서는 백그라운드에서 처리
        return this._simulateEmailSend(emailContent);
    }

    _simulateEmailSend(emailContent) {
        // 개발 환경에서는 콘솔 로그로 시뮬레이션
        console.log('📧 Email sent:', {
            to: emailContent.to,
            subject: emailContent.subject,
            type: emailContent.type
        });

        return Promise.resolve({ success: true, messageId: this._generateEmailId() });
    }

    _generateEmailId() {
        return 'email_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 개발/테스트용 메서드
    getEmailQueue() {
        return [...this.emailQueue];
    }

    clearEmailQueue() {
        this.emailQueue = [];
    }
}

module.exports = EmailService;