import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      isAdmin?: boolean;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Missing authorization token" });
    return;
  }

  // Mock JWT verification
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    req.userId = payload.userId;
    req.isAdmin = payload.isAdmin || false;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAdmin) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
