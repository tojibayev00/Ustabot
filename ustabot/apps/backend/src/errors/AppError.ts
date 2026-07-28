export interface ErrorDetail {
  field?: string;
  message: string;
}

/**
 * Ilovadagi barcha operatsion (kutilgan) xatoliklar shu klassdan meros oladi.
 * error.middleware.ts shu klass instance'larini standart formatga o'giradi.
 */
export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: ErrorDetail[];
  /** true bo'lsa — bu kutilgan (operational) xatolik, dastur ichki holati buzilmagan */
  public readonly isOperational: boolean;

  constructor(
    message: string,
    status: number,
    code: string,
    details: ErrorDetail[] = [],
    isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
