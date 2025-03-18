'use server'

import { getSession } from '@/auth'
import { SessionError, UnknownError } from '@/errors'
import { turso } from '@/lib/turso'
import { revalidatePath } from 'next/cache'

export async function deleteSpelling(_: unknown, formData: FormData) {
  try {
    const session = await getSession()

    if (!session) {
      throw new SessionError()
    }

    const id = formData.get('id') as string
    const result = await turso.execute({
      sql: 'DELETE FROM spelling WHERE user_id = ? AND id = ?',
      args: [session.user.id, id],
    })

    revalidatePath('/saved')

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
