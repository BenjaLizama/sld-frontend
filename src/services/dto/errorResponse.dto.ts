export class ErrorResponse extends Error {
  status: number;
  code: string;
  error: string;
  developerMessage: string;
  path: string;
  timestamp: number;

  constructor(
    status: number,
    code: string,
    error: string,
    message: string,
    developerMessage: string,
    path: string,
    timestamp: number,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.error = error;
    this.developerMessage = developerMessage;
    this.path = path;
    this.timestamp = timestamp;
  }
}
