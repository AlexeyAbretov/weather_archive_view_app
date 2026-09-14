export class ApiError extends Error {
  readonly reason: string;

  constructor(reason: string, message?: string) {
    super(message ?? reason);
    this.name = 'ApiError';
    this.reason = reason;
  }
}

export class GeocodingNotFoundError extends ApiError {
  constructor() {
    super('Город не найден', 'GeocodingNotFoundError');
    this.name = 'GeocodingNotFoundError';
  }
}
