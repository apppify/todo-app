import BaseModule from './base';

export default class LoggerModule extends BaseModule {
  static moduleName = 'logger';

  private logs: string[] = [];

  async initialize(): Promise<void> {
    this.log('🟢 Logger module initialized');
  }

  log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}
