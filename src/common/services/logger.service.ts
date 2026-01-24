import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    console.log(`[${ctx}] ${this.formatMessage(message)}`);
  }

  error(message: any, trace?: string, context?: string) {
    const ctx = context || this.context || 'Application';
    console.error(`[${ctx}] ERROR: ${this.formatMessage(message)}`);
    if (trace) {
      console.error(`[${ctx}] TRACE: ${trace}`);
    }
  }

  warn(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    console.warn(`[${ctx}] WARN: ${this.formatMessage(message)}`);
  }

  debug(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${ctx}] DEBUG: ${this.formatMessage(message)}`);
    }
  }

  verbose(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${ctx}] VERBOSE: ${this.formatMessage(message)}`);
    }
  }

  private formatMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2);
    }
    return message;
  }
}

