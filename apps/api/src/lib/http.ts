export function apiError(message: string) {
  return {
    success: false,
    message,
  };
}

export function badRequest(message: string) {
  return apiError(message);
}

export function unauthorized(message = "Unauthorized") {
  return apiError(message);
}

export function forbidden(message = "Forbidden") {
  return apiError(message);
}

export function notFound(message = "Not found") {
  return apiError(message);
}

export function ok<T>(data: T) {
  return {
    success: true,
    data,
  };
}

export function created<T>(data: T) {
  return ok(data);
}