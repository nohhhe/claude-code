// Stage 3: ErrorFactory - 에러 생성 팩토리
const AppError = require('./AppError');
const { ErrorCodes, ErrorMessages, StatusCodes } = require('./ErrorCodes');

class ErrorFactory {
    static createValidationError(errorCode, customMessage = null, details = null) {
        const message = customMessage || ErrorMessages[errorCode] || 'Validation error';
        const statusCode = StatusCodes[errorCode] || 400;
        
        return new AppError(message, statusCode, errorCode, details);
    }

    static createAuthenticationError(errorCode, customMessage = null, details = null) {
        const message = customMessage || ErrorMessages[errorCode] || 'Authentication error';
        const statusCode = StatusCodes[errorCode] || 401;
        
        return new AppError(message, statusCode, errorCode, details);
    }

    static createUserError(errorCode, customMessage = null, details = null) {
        const message = customMessage || ErrorMessages[errorCode] || 'User error';
        const statusCode = StatusCodes[errorCode] || 400;
        
        return new AppError(message, statusCode, errorCode, details);
    }

    static createDatabaseError(errorCode, customMessage = null, details = null) {
        const message = customMessage || ErrorMessages[errorCode] || 'Database error';
        const statusCode = StatusCodes[errorCode] || 500;
        
        return new AppError(message, statusCode, errorCode, details);
    }

    static createEmailError(errorCode, customMessage = null, details = null) {
        const message = customMessage || ErrorMessages[errorCode] || 'Email error';
        const statusCode = StatusCodes[errorCode] || 500;
        
        return new AppError(message, statusCode, errorCode, details);
    }

    static createSecurityError(errorCode, customMessage = null, details = null) {
        const message = customMessage || ErrorMessages[errorCode] || 'Security error';
        const statusCode = StatusCodes[errorCode] || 403;
        
        return new AppError(message, statusCode, errorCode, details);
    }

    static createSystemError(errorCode = ErrorCodes.INTERNAL_SERVER_ERROR, customMessage = null, details = null) {
        const message = customMessage || ErrorMessages[errorCode] || 'System error';
        const statusCode = StatusCodes[errorCode] || 500;
        
        return new AppError(message, statusCode, errorCode, details);
    }

    // 편의 메서드들
    static usernameRequired(details = null) {
        return this.createValidationError(ErrorCodes.VALIDATION_USERNAME_REQUIRED, null, details);
    }

    static usernameTooShort(minLength = 2, details = null) {
        const message = `사용자명은 ${minLength}자 이상이어야 합니다.`;
        return this.createValidationError(ErrorCodes.VALIDATION_USERNAME_TOO_SHORT, message, details);
    }

    static emailRequired(details = null) {
        return this.createValidationError(ErrorCodes.VALIDATION_EMAIL_REQUIRED, null, details);
    }

    static emailInvalid(email = null, details = null) {
        const emailDetails = email ? { email, ...details } : details;
        return this.createValidationError(ErrorCodes.VALIDATION_EMAIL_INVALID, null, emailDetails);
    }

    static passwordRequired(details = null) {
        return this.createValidationError(ErrorCodes.VALIDATION_PASSWORD_REQUIRED, null, details);
    }

    static passwordTooShort(minLength = 4, details = null) {
        const message = `비밀번호는 ${minLength}자 이상이어야 합니다.`;
        return this.createValidationError(ErrorCodes.VALIDATION_PASSWORD_TOO_SHORT, message, details);
    }

    static passwordTooWeak(requirements = [], details = null) {
        let message = '비밀번호가 너무 약합니다.';
        if (requirements.length > 0) {
            message += ' 다음 조건을 만족해야 합니다: ' + requirements.join(', ');
        }
        
        return this.createValidationError(
            ErrorCodes.VALIDATION_PASSWORD_TOO_WEAK, 
            message, 
            { requirements, ...details }
        );
    }

    static invalidCredentials(details = null) {
        return this.createAuthenticationError(ErrorCodes.AUTH_INVALID_CREDENTIALS, null, details);
    }

    static userNotFound(identifier = null, details = null) {
        const userDetails = identifier ? { identifier, ...details } : details;
        return this.createAuthenticationError(ErrorCodes.AUTH_USER_NOT_FOUND, null, userDetails);
    }

    static accountInactive(details = null) {
        return this.createAuthenticationError(ErrorCodes.AUTH_ACCOUNT_INACTIVE, null, details);
    }

    static insufficientPermissions(requiredRole = null, details = null) {
        const permissionDetails = requiredRole ? { requiredRole, ...details } : details;
        return this.createAuthenticationError(ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS, null, permissionDetails);
    }

    static userAlreadyExists(email = null, details = null) {
        const userDetails = email ? { email, ...details } : details;
        return this.createUserError(ErrorCodes.USER_ALREADY_EXISTS, null, userDetails);
    }

    static userCreationFailed(reason = null, details = null) {
        const message = reason ? `사용자 생성에 실패했습니다: ${reason}` : null;
        const errorDetails = reason ? { reason, ...details } : details;
        return this.createUserError(ErrorCodes.USER_CREATION_FAILED, message, errorDetails);
    }

    static userUpdateFailed(userId = null, reason = null, details = null) {
        const message = reason ? `사용자 정보 업데이트에 실패했습니다: ${reason}` : null;
        const errorDetails = { userId, reason, ...details };
        return this.createUserError(ErrorCodes.USER_UPDATE_FAILED, message, errorDetails);
    }

    static databaseConnectionError(details = null) {
        return this.createDatabaseError(ErrorCodes.DATABASE_CONNECTION_ERROR, null, details);
    }

    static databaseQueryError(query = null, details = null) {
        const queryDetails = query ? { query, ...details } : details;
        return this.createDatabaseError(ErrorCodes.DATABASE_QUERY_ERROR, null, queryDetails);
    }

    static emailServiceUnavailable(details = null) {
        return this.createEmailError(ErrorCodes.EMAIL_SERVICE_UNAVAILABLE, null, details);
    }

    static emailSendFailed(recipient = null, details = null) {
        const emailDetails = recipient ? { recipient, ...details } : details;
        return this.createEmailError(ErrorCodes.EMAIL_SEND_FAILED, null, emailDetails);
    }

    static suspiciousActivity(activity = null, details = null) {
        const securityDetails = activity ? { activity, ...details } : details;
        return this.createSecurityError(ErrorCodes.SECURITY_SUSPICIOUS_ACTIVITY, null, securityDetails);
    }

    static rateLimitExceeded(limit = null, window = null, details = null) {
        let message = '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        if (limit && window) {
            message = `${window} 동안 최대 ${limit}번의 요청만 허용됩니다. 잠시 후 다시 시도해주세요.`;
        }
        
        const rateLimitDetails = { limit, window, ...details };
        return this.createSecurityError(ErrorCodes.RATE_LIMIT_EXCEEDED, message, rateLimitDetails);
    }

    // 기존 Error 객체를 AppError로 래핑
    static wrapError(error, errorCode = ErrorCodes.INTERNAL_SERVER_ERROR, additionalDetails = null) {
        if (error instanceof AppError) {
            return error;
        }

        const details = {
            originalError: error.message,
            originalStack: error.stack,
            ...additionalDetails
        };

        return this.createSystemError(errorCode, error.message, details);
    }

    // 여러 에러를 하나로 합성
    static createCompositeError(errors, message = '여러 오류가 발생했습니다.') {
        const details = {
            errors: errors.map(err => err instanceof AppError ? err.toJSON() : {
                message: err.message,
                stack: err.stack
            })
        };

        return new AppError(message, 400, ErrorCodes.INTERNAL_SERVER_ERROR, details);
    }
}

module.exports = ErrorFactory;