export interface MetricData {
  timestamp: number;
  value: number;
}

export interface AnalyticsSnapshot {
  totalRequests: number;
  totalErrors: number;
  averageResponseTime: number;
  uptime: number;
  timestamp: number;
}

export class Analytics {
  private metrics: Map<string, MetricData[]> = new Map();
  private startTime: number = Date.now();
  private totalRequests: number = 0;
  private totalErrors: number = 0;
  private responseTimes: number[] = [];

  recordRequest(): void {
    this.totalRequests += 1;
  }

  recordError(): void {
    this.totalErrors += 1;
  }

  recordResponseTime(ms: number): void {
    this.responseTimes.push(ms);

    // Keep only last 1000 measurements
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push({
      timestamp: Date.now(),
      value,
    });
  }

  getMetric(name: string, limit: number = 100): MetricData[] {
    const data = this.metrics.get(name) || [];
    return data.slice(-limit);
  }

  getSnapshot(): AnalyticsSnapshot {
    const avgResponseTime =
      this.responseTimes.length > 0
        ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
        : 0;

    return {
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      averageResponseTime: Math.round(avgResponseTime),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: Date.now(),
    };
  }

  reset(): void {
    this.totalRequests = 0;
    this.totalErrors = 0;
    this.responseTimes = [];
    this.metrics.clear();
    this.startTime = Date.now();
  }
}

export const analytics = new Analytics();
