class AbstractError extends Error {
  meta: object

  constructor(message: string, meta: object = {}) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.meta = meta
  }

  toJSON() {
    return {
      message: this.message,
      meta_data: this.meta
    }
  }
}

export class ValidationError extends AbstractError {}
export class UnknownError extends AbstractError {}
export class UnauthorizeError extends AbstractError {}
export class NotFoundError extends AbstractError {
  constructor(resource: string, type: string = '', meta: object = {}) {
    super(`Resource: ${resource} of type: ${type}, Not Found`, meta)
  }
}