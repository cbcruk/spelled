'use server'

import { Effect } from 'effect'
import { TursoService } from '@/services/Turso'
import { Spelled } from '@/schema'
import { AuthService } from '@/services/Auth'

export const createSpelling = async (body: Spelled) =>
  Effect.gen(function* () {
    const turso = yield* TursoService
    const authService = yield* AuthService

    const userId = yield* authService.getUserId()
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
    }),
    Effect.runPromise
  )
