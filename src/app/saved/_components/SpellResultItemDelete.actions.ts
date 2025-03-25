'use server'

import { getSession, SessionError } from '@/auth'
import { TursoService, TursoServiceLive } from '@/services/Turso'
import { Effect } from 'effect'
import { revalidatePath } from 'next/cache'

export const deleteSpelling = async (_: unknown, formData: FormData) =>
  await Effect.runPromise(
    Effect.gen(function* () {
      const session = yield* getSession

      if (!session) {
        return yield* Effect.fail(
          new SessionError({
            message: '세션정보가 없습니다.',
          })
        )
      }

      const id = formData.get('id') as string
      const turso = yield* TursoService
      const result = yield* turso.execute({
        sql: 'DELETE FROM spelling WHERE user_id = ? AND id = ?',
        args: [session.user.id, id],
      })

      revalidatePath('/saved')

      return result
    }).pipe(
      Effect.provide(TursoServiceLive),
      Effect.match({
        onSuccess(data) {
          return {
            data,
            error: null,
          }
        },
        onFailure(error) {
          return {
            data: null,
            error,
          }
        },
      })
    )
  )
