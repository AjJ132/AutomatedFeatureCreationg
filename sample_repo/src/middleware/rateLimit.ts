import { Request, Response, NextFunction } from "express";

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
  }

  private getKey(req: Request): string {
    if (this.options.keyGenerator) {
      return this.options.keyGenerator(req);
    }
    return req.ip || "unknown";
  }

  check(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry || entry.resetTime < now) {
      entry = { count: 0, resetTime: now + this.options.windowMs };
      this.store.set(key, entry);
    }

    entry.count += 1;

    return {
      allowed: entry.count <= this.options.maxRequests,
      remaining: Math.max(0, this.options.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const { allowed, remaining, resetTime } = this.check(key);

      res.set("X-RateLimit-Limit", String(this.options.maxRequests));
      res.set("X-RateLimit-Remaining", String(remaining));
      res.set("X-RateLimit-Reset", String(Math.ceil(resetTime / 1000)));

      if (!allowed) {
        res.status(429).json({ message: "Too many requests" });
        return;
      }

      next();
    };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
