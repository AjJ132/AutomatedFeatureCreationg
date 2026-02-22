import { Request, Response, NextFunction } from "express";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
}

export function requestValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Check for required headers
  const contentType = req.headers["content-type"];

  if (["POST", "PATCH", "PUT"].includes(req.method) && !contentType?.includes("application/json")) {
    res.status(400).json({ message: "Content-Type must be application/json" });
    return;
  }

  next();
}
