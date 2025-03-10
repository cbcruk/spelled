export class InvalidJsonError extends Error {
  name = 'InvalidJsonError'

  constructor(message = '잘못된 JSON 형식입니다.') {
    super(message)
    Object.setPrototypeOf(this, InvalidJsonError.prototype)
  }
}

export class InvalidSessionError extends Error {
  name = 'InvalidSessionError'

  constructor(message = '세션 정보가 없습니다.') {
    super(message)
    Object.setPrototypeOf(this, InvalidSessionError.prototype)
  }
}

export class InvalidDataError extends Error {
  name = 'InvalidDataError'

  constructor(message = '잘못된 데이터입니다.') {
    super(message)
    Object.setPrototypeOf(this, InvalidDataError.prototype)
  }
}
