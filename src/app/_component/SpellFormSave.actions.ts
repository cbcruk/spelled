'use server'

import { getSession, SessionError } from '@/auth'
import { CheckSpellingStateData } from './SpellFormCheck.actions'
import { Effect } from 'effect'
import { TursoService, TursoServiceLive } from '@/services/Turso'

export const createSpelling = async (data: CheckSpellingStateData) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const session = yield* getSession

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
      Effect.provide(TursoServiceLive),
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
