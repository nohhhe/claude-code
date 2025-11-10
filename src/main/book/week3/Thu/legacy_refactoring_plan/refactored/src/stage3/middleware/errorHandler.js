// Stage 3: 중앙집중식 에러 처리 미들웨어
const AppError = require('../errors/AppError');
const { ErrorCodes } = require('../errors/ErrorCodes');

class ErrorHandler {
    constructor(logger = console) {
        this.logger = logger;
        this.errorStats = new Map();
        this.alertThresholds = new Map([
            ['AUTH_INVALID_CREDENTIALS', { count: 5, window: 60000 }], // 1분간 5회
            ['SECURITY_SUSPICIOUS_ACTIVITY', { count: 3, window: 300000 }], // 5분간 3회
            ['DATABASE_CONNECTION_ERROR', { count: 1, window: 0 }] // 즉시 알림
        ]);
    }

    // 메인 에러 핸들러
    handleError(error, context = {}) {
        const appError = this._normalizeError(error);
        const errorData = this._enrichErrorData(appError, context);

        // 에러 로깅
        this._logError(errorData);

        // 에러 통계 업데이트
        this._updateErrorStats(appError);

        // 알림 체크
        this._checkAlertThresholds(appError);

        // UI/클라이언트 응답
        return this._generateResponse(appError);
    }

    // Promise 거부 처리
    handleUnhandledRejection(reason, promise) {
        const error = reason instanceof Error ? reason : new Error(String(reason));
        const appError = new AppError(
            'Unhandled Promise Rejection',
            500,
            ErrorCodes.INTERNAL_SERVER_ERROR,
            { originalReason: reason, promise: promise.toString() }
        );

        this.logger.error('Unhandled Promise Rejection:', appError.toLogData());
        
        // 심각한 오류이므로 프로세스 종료 고려
        if (this._isCriticalError(appError)) {
            this.logger.error('Critical error detected. Application may need to restart.');
            // process.exit(1); // 실제 환경에서 고려
        }

        return appError;
    }

    // 예외 처리되지 않은 에러
    handleUncaughtException(error) {
        const appError = this._normalizeError(error);
        appError.errorCode = ErrorCodes.INTERNAL_SERVER_ERROR;
        
        this.logger.error('Uncaught Exception:', appError.toLogData());
        
        // 즉시 종료 (데이터 손상 방지)
        process.exit(1);
    }

    // 비동기 에러 핸들러 (Express 미들웨어 스타일)
    asyncErrorHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(error => {
                const handledError = this.handleError(error, {
                    method: req?.method,
                    url: req?.url,
                    userAgent: req?.get('User-Agent'),
                    ip: req?.ip
                });
                
                if (next) {
                    next(handledError);
                } else {
                    throw handledError;
                }
            });
        };
    }

    // 에러 복구 시도
    attemptErrorRecovery(error, recoveryStrategies = []) {
        const appError = this._normalizeError(error);
        
        for (const strategy of recoveryStrategies) {
            try {
                if (strategy.canHandle(appError)) {
                    const result = strategy.recover(appError);
                    if (result.success) {
                        this.logger.info('Error recovery successful:', {
                            errorCode: appError.errorCode,
                            strategy: strategy.name,
                            recoveryData: result.data
                        });
                        return result;
                    }
                }
            } catch (recoveryError) {
                this.logger.warn('Error recovery failed:', {
                    originalError: appError.errorCode,
                    recoveryError: recoveryError.message,
                    strategy: strategy.name
                });
            }
        }

        this.logger.warn('No recovery strategy succeeded for error:', appError.errorCode);
        return { success: false, error: appError };
    }

    // 에러 통계 조회
    getErrorStats(timeWindow = 3600000) { // 기본 1시간
        const now = Date.now();
        const stats = {};

        for (const [errorCode, entries] of this.errorStats) {
            const recentEntries = entries.filter(entry => now - entry.timestamp < timeWindow);
            if (recentEntries.length > 0) {
                stats[errorCode] = {
                    count: recentEntries.length,
                    firstOccurrence: Math.min(...recentEntries.map(e => e.timestamp)),
                    lastOccurrence: Math.max(...recentEntries.map(e => e.timestamp)),
                    contexts: recentEntries.map(e => e.context).slice(-5) // 최근 5개
                };
            }
        }

        return stats;
    }

    // === Private Methods ===

    _normalizeError(error) {
        if (error instanceof AppError) {
            return error;
        }

        // 일반적인 에러 타입들 처리
        if (error.name === 'ValidationError') {
            return new AppError(error.message, 400, ErrorCodes.VALIDATION_EMAIL_INVALID, {
                originalError: error.name
            });
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return new AppError(
                'Service connection failed',
                503,
                ErrorCodes.SERVICE_UNAVAILABLE,
                { originalCode: error.code, originalMessage: error.message }
            );
        }

        // 기본 시스템 에러
        return new AppError(
            error.message || 'Unknown error occurred',
            500,
            ErrorCodes.INTERNAL_SERVER_ERROR,
            {
                originalName: error.name,
                originalStack: error.stack
            }
        );
    }

    _enrichErrorData(appError, context) {
        return {
            ...appError.toLogData(),
            context: {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                nodeVersion: process.version,
                platform: process.platform,
                pid: process.pid,
                memory: process.memoryUsage(),
                ...context
            }
        };
    }

    _logError(errorData) {
        const severity = errorData.severity;
        const logMethod = this.logger[severity] || this.logger.error;

        logMethod.call(this.logger, `${errorData.errorCode}: ${errorData.message}`, {
            ...errorData,
            // 민감한 정보 마스킹
            message: this._maskSensitiveData(errorData.message),
            details: this._maskSensitiveDetails(errorData.details)
        });
    }

    _updateErrorStats(appError) {
        if (!this.errorStats.has(appError.errorCode)) {
            this.errorStats.set(appError.errorCode, []);
        }

        const entries = this.errorStats.get(appError.errorCode);
        entries.push({
            timestamp: Date.now(),
            context: appError.details
        });

        // 오래된 엔트리 정리 (24시간 이상)
        const dayAgo = Date.now() - 86400000;
        const filteredEntries = entries.filter(entry => entry.timestamp > dayAgo);
        this.errorStats.set(appError.errorCode, filteredEntries);
    }

    _checkAlertThresholds(appError) {
        const threshold = this.alertThresholds.get(appError.errorCode);
        if (!threshold) return;

        const now = Date.now();
        const entries = this.errorStats.get(appError.errorCode) || [];
        const recentEntries = entries.filter(entry => 
            now - entry.timestamp < threshold.window
        );

        if (recentEntries.length >= threshold.count) {
            this._triggerAlert(appError, {
                count: recentEntries.length,
                window: threshold.window,
                threshold: threshold.count
            });
        }
    }

    _triggerAlert(appError, alertData) {
        this.logger.error('ALERT: Error threshold exceeded!', {
            errorCode: appError.errorCode,
            message: appError.message,
            alertData: alertData,
            timestamp: new Date().toISOString()
        });

        // 실제 환경에서는 알림 시스템 연동 (Slack, Email, SMS 등)
        // this._sendSlackAlert(appError, alertData);
        // this._sendEmailAlert(appError, alertData);
    }

    _generateResponse(appError) {
        const response = appError.toSafeResponse();

        // 프로덕션 환경에서는 내부 에러 상세 정보 숨김
        if (process.env.NODE_ENV === 'production' && appError.statusCode >= 500) {
            response.message = '내부 서버 오류가 발생했습니다.';
            delete response.details;
        }

        return response;
    }

    _isCriticalError(appError) {
        const criticalCodes = [
            ErrorCodes.DATABASE_CONNECTION_ERROR,
            ErrorCodes.DATABASE_TRANSACTION_ERROR,
            ErrorCodes.SERVICE_UNAVAILABLE
        ];

        return criticalCodes.includes(appError.errorCode) ||
               appError.statusCode >= 500;
    }

    _maskSensitiveData(message) {
        // 이메일, 비밀번호, 토큰 등 마스킹
        return message
            .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '***@***.***')
            .replace(/(password|token|key|secret)[=:]\s*\S+/gi, '$1=***')
            .replace(/\b\d{4}[\d\s-]{8,}\d{4}\b/g, '****-****-****-****'); // 카드번호 패턴
    }

    _maskSensitiveDetails(details) {
        if (!details || typeof details !== 'object') return details;

        const masked = { ...details };
        const sensitiveKeys = ['password', 'token', 'secret', 'key', 'creditCard'];

        for (const key of sensitiveKeys) {
            if (masked[key]) {
                masked[key] = '***';
            }
        }

        return masked;
    }
}

module.exports = ErrorHandler;