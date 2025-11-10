export class Logger {
  private static formatTimestamp(): string {
    const now = new Date();
    return `[${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
  }

  private static writeToLog(level: string, message: string): void {
    const logEntry = `${this.formatTimestamp()} ${level}: ${message}\n`;
    
    // In a real app, this would write to a file or send to a logging service
    // For demo purposes, we'll append to a simulated log
    console.error(logEntry.trim());
    
    // Simulate file writing (in browser, this would use different methods)
    if (typeof window !== 'undefined') {
      const existingLogs = localStorage.getItem('error_logs') || '';
      localStorage.setItem('error_logs', existingLogs + logEntry);
    }
  }

  static error(message: string): void {
    this.writeToLog('ERROR', message);
  }

  static warn(message: string): void {
    this.writeToLog('WARN', message);
  }

  static info(message: string): void {
    this.writeToLog('INFO', message);
  }

  static triggerTestError(): void {
    this.error('Intentional test error triggered from UI - Component failed to render properly');
  }
}