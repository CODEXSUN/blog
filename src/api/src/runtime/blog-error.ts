export type BlogErrorInput = {
  code: string;
  details?: unknown;
  message: string;
  statusCode: number;
};

export class BlogError extends Error {
  readonly code: string;
  readonly details?: unknown;
  readonly statusCode: number;

  constructor(input: BlogErrorInput) {
    super(input.message);
    this.name = "BlogError";
    this.code = input.code;
    this.statusCode = input.statusCode;
    if ("details" in input) this.details = input.details;
  }

  static conflict(message: string, details?: unknown) {
    return new BlogError({ code: "CONFLICT", details, message, statusCode: 409 });
  }

  static forbidden(message = "Forbidden", details?: unknown) {
    return new BlogError({ code: "FORBIDDEN", details, message, statusCode: 403 });
  }

  static notFound(message = "Not Found", details?: unknown) {
    return new BlogError({ code: "NOT_FOUND", details, message, statusCode: 404 });
  }

  static unauthorized(message = "Unauthorized", details?: unknown) {
    return new BlogError({ code: "UNAUTHORIZED", details, message, statusCode: 401 });
  }

  static validation(message: string, details?: unknown) {
    return new BlogError({ code: "VALIDATION_ERROR", details, message, statusCode: 400 });
  }
}
