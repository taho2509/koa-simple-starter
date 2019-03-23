class AbstractError extends Error {
  private meta: object

  constructor(message: string, meta: object = {}) {
    super(message)

    Error.call(this)
    Error.captureStackTrace(this)
    this.name = this.constructor.name
    this.meta = meta
  }
}

export class ValidationError extends AbstractError {}
export class UnknownError extends AbstractError {}
export class UnauthorizeError extends AbstractError {}