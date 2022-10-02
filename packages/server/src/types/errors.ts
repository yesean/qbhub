/**
 * Custom query string parsing error.
 */
export class QueryStringParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UrlParsingError';
  }
}
