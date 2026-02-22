import { Request, Response, NextFunction } from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getPaginationParams(req: Request): PaginationParams {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 20;

  page = Math.max(page, 1);
  limit = Math.min(Math.max(limit, 1), 100);

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}

export function paginateArray<T>(items: T[], page: number, limit: number): PaginatedResponse<T> {
  const total = items.length;
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: { page, limit, total, totalPages },
  };
}

export function paginationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const pagination = getPaginationParams(req);
  (req as any).pagination = pagination;
  next();
}
