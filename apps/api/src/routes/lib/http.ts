export function badRequest(message: string) {
  return {
    success: false,
    message,
  };
}

export function created<T>(data: T) {
  return {
    success: true,
    data,
  };
}