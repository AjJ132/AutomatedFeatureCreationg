export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: unknown;
}

export class Logger {
  private logs: LogEntry[] = [];
  private level: LogLevel = LogLevel.INFO;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  debug(message: string, data?: unknown): void {
    if (this.level <= LogLevel.DEBUG) {
      this.log("DEBUG", message, data);
    }
  }

  info(message: string, data?: unknown): void {
    if (this.level <= LogLevel.INFO) {
      this.log("INFO", message, data);
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.level <= LogLevel.WARN) {
      this.log("WARN", message, data);
    }
  }

  error(message: string, data?: unknown): void {
    if (this.level <= LogLevel.ERROR) {
      this.log("ERROR", message, data);
    }
  }

  private log(level: string, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    };

    this.logs.push(entry);

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }

    console.log(`[${level}] ${message}`, data ? data : "");
  }

  getLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
