'use server'

import { Effect, Option } from 'effect'
import { TursoService } from '@/services/Turso'
import { Spelled } from '@/schema'
import { AuthService } from '@/services/Auth'

export const createSpelling = async (data: Spelled | null) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const turso = yield* TursoService
      const authService = yield* AuthService

      const userId = yield* authService.getUserId()
      const body = yield* Option.fromNullable(data).pipe(
        Option.match({
          onNone: () => Effect.fail(new Error('전달된 데이터가 없습니다.')),
          onSome: (data) => Effect.succeed(data),
        })
      )
      const result = yield* turso.execute({
        sql: 'INSERT INTO spelling (user_id, input, corrected, score, corrections) VALUES(?, ?, ?, ?, ?)',
        args: [
          userId,
          body.input,
          body.corrected,
          body.score,
          JSON.stringify(body.corrections),
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
