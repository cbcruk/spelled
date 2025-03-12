export class SessionError extends Error {
  name = 'SessionError'

  constructor(message = '세션 정보가 없습니다.') {
    super(message)
    Object.setPrototypeOf(this, SessionError.prototype)
  }
}

export class UnknownError extends Error {
  name = 'UnknownError'

  constructor(message = '알 수 없는 문제가 발생했습니다.') {
    super(message)

    Object.setPrototypeOf(this, UnknownError.prototype)
  }
}
