// Stage 2: PasswordService - 비밀번호 관련 보안 로직 분리
class PasswordService {
    constructor() {
        // Stage 3에서 실제 해싱 라이브러리 연동 예정
        this.saltRounds = 10;
    }

    // 임시 구현 - Stage 3에서 bcrypt 등으로 교체 예정
    hash(password) {
        // 개발 단계에서는 단순 인코딩 (보안상 안전하지 않음)
        return this._simpleHash(password);
    }

    verify(plainPassword, hashedPassword) {
        // 현재는 평문 비교, Stage 3에서 실제 해시 비교로 교체
        if (hashedPassword.startsWith('hashed_')) {
            return this._simpleHash(plainPassword) === hashedPassword;
        }
        
        // 레거시 호환성 - 평문 비밀번호 지원 (Stage 3에서 제거 예정)
        return plainPassword === hashedPassword;
    }

    generateRandomPassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        return password;
    }

    validatePasswordStrength(password) {
        const result = {
            isStrong: true,
            issues: []
        };

        if (password.length < 8) {
            result.isStrong = false;
            result.issues.push('비밀번호는 8자 이상이어야 합니다.');
        }

        if (!/[a-z]/.test(password)) {
            result.isStrong = false;
            result.issues.push('소문자를 포함해야 합니다.');
        }

        if (!/[A-Z]/.test(password)) {
            result.isStrong = false;
            result.issues.push('대문자를 포함해야 합니다.');
        }

        if (!/\d/.test(password)) {
            result.isStrong = false;
            result.issues.push('숫자를 포함해야 합니다.');
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            result.isStrong = false;
            result.issues.push('특수문자를 포함해야 합니다.');
        }

        return result;
    }

    // 임시 구현 메서드들 - Stage 3에서 실제 암호화로 교체
    _simpleHash(password) {
        // 이는 보안상 안전하지 않은 방법입니다. 실제 환경에서는 사용하지 마세요.
        return 'hashed_' + Buffer.from(password + 'salt123').toString('base64');
    }

    // Stage 3 예정: bcrypt 연동
    /*
    async hashWithBcrypt(password) {
        const bcrypt = require('bcrypt');
        return await bcrypt.hash(password, this.saltRounds);
    }

    async verifyWithBcrypt(plainPassword, hashedPassword) {
        const bcrypt = require('bcrypt');
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
    */
}

module.exports = PasswordService;