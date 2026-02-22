export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RequestContext {
  requestId: string;
  userId?: number;
  timestamp: number;
  ip: string;
  userAgent: string;
}

export interface QueryFilters {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterOptions {
  field: string;
  operator: "eq" | "ne" | "gt" | "lt" | "gte" | "lte" | "in" | "contains";
  value: unknown;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export interface RequestLog {
  method: HttpMethod;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
  userId?: number;
  error?: string;
}

export interface Entity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export interface DateRange {
  from: string;
  to: string;
}
