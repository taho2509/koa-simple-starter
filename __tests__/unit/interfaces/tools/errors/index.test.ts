import { BadGateway, NotFoundError, UnknownError, ValidationError } from '../../../../../src/interfaces/tools/errors'

describe('Errors', () => {
  it('should create an Unknown Error', () => {
    const error = new UnknownError('Unknown Error')

    expect(error.message).toBe('Unknown Error')
  })

  it('should create a Validation Error', () => {
    const error = new ValidationError('Error validating X', {
      errorMessages: 'The error message',
      payload: {
        data: 'DATA',
      },
    })

    expect(error.message).toBe('Validation Error')
    expect((error.toJSON() as any).metaData).toStrictEqual({
      code: 400,
      errorMessages: 'The error message',
      payload: {
        data: 'DATA',
      },
      where: 'Error validating X',
    })
  })

  it('should create a Not Found Error', () => {
    const error = new NotFoundError('Route', 'X', {
      errorMessages: 'The error message',
    })

    expect(error.message).toBe('Resource: Route of type: X, Not Found')
    expect((error.toJSON() as any).metaData).toStrictEqual({
      errorMessages: 'The error message',
    })
  })

  it('should create a Not Found Error with default type', () => {
    const error = new NotFoundError('Route')

    expect(error.message).toBe('Resource: Route of type: , Not Found')
    expect((error.toJSON() as any).metaData).toStrictEqual({})
  })

  it('should create a Bad Gateway Error', () => {
    const error = new BadGateway('Error calling api', {
      errorMessages: 'The error message',
      payload: {
        data: 'DATA',
      },
    })

    expect(error.message).toBe('External service has failed')
    expect((error.toJSON() as any).metaData).toStrictEqual({
      code: 502,
      errorMessages: 'The error message',
      payload: {
        data: 'DATA',
      },
      where: 'Error calling api',
    })
  })
})
