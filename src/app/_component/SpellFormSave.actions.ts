'use server'

import { getSession } from '@/auth'
import { SessionError, UnknownError } from '@/errors'
import { turso } from '@/lib/turso'
import { CheckSpellingStateData } from './SpellFormCheck.actions'

class DataError extends Error {
  name = 'DataError'

  constructor(message = '전달된 데이터가 없습니다.') {
    super(message)

    Object.setPrototypeOf(this, DataError.prototype)
  }
}

export async function createSpelling(data: CheckSpellingStateData) {
  try {
    const session = await getSession()

    if (!session) {
      throw new SessionError()
    }

    if (!data) {
      throw new DataError()
    }

    const result = await turso.execute({
      sql: 'INSERT INTO spelling (user_id, input, corrected, score, corrections) VALUES(?, ?, ?, ?, ?)',
      args: [
        session.user.id,
        data.input,
        data.corrected,
        data.score,
        JSON.stringify(data.corrections),
      ],
    })

    return {
      data: result.toJSON(),
      error: null,
    }
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new UnknownError(),
    }
  }
}
