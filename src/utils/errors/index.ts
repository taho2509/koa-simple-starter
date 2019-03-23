class AbstractError extends Error {
  meta: object

  constructor(message: string, meta: object = {}) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.meta = meta
  }
}

export class ValidationError extends AbstractError {}
export class UnknownError extends AbstractError {}
export class UnauthorizeError extends AbstractError {}