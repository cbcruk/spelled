'use server'

import { AuthService } from '@/services/Auth'
import { TursoService } from '@/services/Turso'
import { Effect } from 'effect'
import { revalidatePath } from 'next/cache'

export const deleteSpelling = async (_: unknown, formData: FormData) =>
  await Effect.runPromise(
    Effect.gen(function* () {
      const auth = yield* AuthService
      const turso = yield* TursoService

      const userId = yield* auth.getUserId()
      const id = formData.get('id') as string
      const result = yield* turso.execute({
        sql: 'DELETE FROM spelling WHERE user_id = ? AND id = ?',
        args: [userId, id],
      })

      revalidatePath('/saved')

      return result
    }).pipe(
      Effect.provide(TursoService.Default),
      Effect.provide(AuthService.Default),
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
