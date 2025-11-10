interface LogLevel {
  INFO: 'info'
  ERROR: 'error'
  WARN: 'warn'
  DEBUG: 'debug'
}

const LOG_LEVELS: LogLevel = {
  INFO: 'info',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug'
}

class Logger {
  private log(level: keyof LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...(meta && { meta })
    }
    
    console.log(JSON.stringify(logData, null, 2))
  }

  info(message: string, meta?: any) {
    this.log('INFO', message, meta)
  }

  error(message: string, meta?: any) {
    this.log('ERROR', message, meta)
  }

  warn(message: string, meta?: any) {
    this.log('WARN', message, meta)
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, meta)
    }
  }
}

export const logger = new Logger()