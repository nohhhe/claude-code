// Stage 2: ValidationService - 유효성 검증 로직 분리
class ValidationService {
    validateUsername(username) {
        if (!username || typeof username !== 'string') {
            return { isValid: false, message: '사용자명을 입력해주세요.' };
        }
        
        if (username.length < 2) {
            return { isValid: false, message: '사용자명은 2자 이상이어야 합니다.' };
        }

        return { isValid: true };
    }

    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { isValid: false, message: '이메일을 입력해주세요.' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: '유효한 이메일을 입력해주세요.' };
        }

        return { isValid: true };
    }

    validatePassword(password) {
        if (!password || typeof password !== 'string') {
            return { isValid: false, message: '비밀번호를 입력해주세요.' };
        }

        if (password.length < 4) {
            return { isValid: false, message: '비밀번호는 4자 이상이어야 합니다.' };
        }

        return { isValid: true };
    }

    validateRegistrationData(username, email, password) {
        const usernameValidation = this.validateUsername(username);
        if (!usernameValidation.isValid) {
            return usernameValidation;
        }

        const emailValidation = this.validateEmail(email);
        if (!emailValidation.isValid) {
            return emailValidation;
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            return passwordValidation;
        }

        return { isValid: true };
    }

    validateLoginData(email, password) {
        if (!email || !password) {
            return { isValid: false, message: '이메일과 비밀번호를 입력해주세요.' };
        }

        return { isValid: true };
    }
}

module.exports = ValidationService;