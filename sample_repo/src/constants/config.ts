export const API_VERSION = "1.0.0";
export const API_PORT = 3000;
export const API_HOST = "localhost";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const ERROR_MESSAGES = {
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  INVALID_DATA: "Invalid data provided",
  SERVER_ERROR: "Internal server error",
};
