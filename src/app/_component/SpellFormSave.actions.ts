'use server'

import { SessionError } from '@/auth'
import { Effect } from 'effect'
import { TursoService } from '@/services/Turso'
import { Spelled } from '@/schema'
import { AuthService } from '@/services/Auth'

export const createSpelling = async (data: Spelled | null) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const auth = yield* AuthService
      const session = yield* auth.get

      if (!session) {
        return yield* Effect.fail(
          new SessionError({
            message: '세션정보가 없습니다.',
          })
        )
      }

      if (!data) {
        return yield* Effect.fail(new Error('전달된 데이터가 없습니다.'))
      }

      const turso = yield* TursoService
      const result = yield* turso.execute({
        sql: 'INSERT INTO spelling (user_id, input, corrected, score, corrections) VALUES(?, ?, ?, ?, ?)',
        args: [
          session.user.id,
          data.input,
          data.corrected,
          data.score,
          JSON.stringify(data.corrections),
        ],
      })

      return result
    }).pipe(
      Effect.provide(TursoService.Default),
      Effect.provide(AuthService.Default),
      Effect.match({
        onSuccess(data) {
          return {
            data,
          }
        },
        onFailure(error) {
          return {
            error,
          }
        },
      })
    )
  )
