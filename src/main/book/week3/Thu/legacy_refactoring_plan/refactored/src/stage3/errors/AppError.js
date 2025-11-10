// Stage 3: AppError - 커스텀 에러 클래스
class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
        super(message);
        
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.isOperational = true;

        // V8 스택 트레이스 최적화
        Error.captureStackTrace(this, this.constructor);
    }

    // 에러를 JSON으로 직렬화
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            errorCode: this.errorCode,
            details: this.details,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }

    // 클라이언트용 안전한 응답 생성
    toSafeResponse() {
        return {
            success: false,
            message: this.message,
            errorCode: this.errorCode,
            timestamp: this.timestamp,
            ...(this.details && { details: this.details })
        };
    }

    // 로그용 상세 정보
    toLogData() {
        return {
            ...this.toJSON(),
            severity: this._determineSeverity(),
            category: this._determineCategory()
        };
    }

    _determineSeverity() {
        if (this.statusCode >= 500) return 'error';
        if (this.statusCode >= 400) return 'warning';
        return 'info';
    }

    _determineCategory() {
        if (this.errorCode.includes('AUTH')) return 'authentication';
        if (this.errorCode.includes('VALIDATION')) return 'validation';
        if (this.errorCode.includes('DATABASE')) return 'database';
        if (this.errorCode.includes('EMAIL')) return 'email';
        return 'general';
    }
}

module.exports = AppError;