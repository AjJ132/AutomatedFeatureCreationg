import { Request, Response, NextFunction } from "express";

export interface ValidationError {
  field: string;
  message: string;
}

export class Validator {
  private errors: ValidationError[] = [];

  validate(field: string, value: unknown, rules: string[]): this {
    for (const rule of rules) {
      const [ruleName, ...params] = rule.split(":");

      switch (ruleName) {
        case "required":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            this.errors.push({ field, message: `${field} is required` });
          }
          break;

        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
            this.errors.push({ field, message: `${field} must be a valid email` });
          }
          break;

        case "min":
          if (value && String(value).length < parseInt(params[0])) {
            this.errors.push({
              field,
              message: `${field} must be at least ${params[0]} characters`,
            });
          }
          break;

        case "max":
          if (value && String(value).length > parseInt(params[0])) {
            this.errors.push({
              field,
              message: `${field} must not exceed ${params[0]} characters`,
            });
          }
          break;

        case "number":
          if (value && isNaN(Number(value))) {
            this.errors.push({ field, message: `${field} must be a number` });
          }
          break;
      }
    }
    return this;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  clear(): void {
    this.errors = [];
  }
}

export function validateUserInput(req: Request, res: Response, next: NextFunction): void {
  const { name, email } = req.body;
  const validator = new Validator();

  validator
    .validate("name", name, ["required", "min:2", "max:100"])
    .validate("email", email, ["required", "email"]);

  if (validator.hasErrors()) {
    res.status(400).json({ errors: validator.getErrors() });
    return;
  }

  next();
}
