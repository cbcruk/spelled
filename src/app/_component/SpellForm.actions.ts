'use server'

import { auth } from '@/auth'
import { InvalidDataError, InvalidSessionError } from '@/errors'
import { checkSpellingWithScore } from '@/lib/open-ai'
import { turso } from '@/lib/turso'
import { Spelled } from '@/types'

export async function createSpelling(data: CheckSpellingReturnData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new InvalidSessionError()
  }

  if (!data) {
    throw new InvalidDataError()
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
    errors: [],
  }
}

type CheckSpellingState = {
  data: Spelled | null
  errors: string[]
}

export type CheckSpellingReturnData = Awaited<
  ReturnType<typeof checkSpelling>
>['data']

export async function checkSpelling(
  _prevState: CheckSpellingState,
  formData: FormData
) {
  const data = await checkSpellingWithScore(formData.get('input') as string)

  return {
    data,
    errors: [],
  }
}
