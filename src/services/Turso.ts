import { Config, Data, Effect } from 'effect'
import { createClient, InStatement } from '@libsql/client'

class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export class TursoService extends Effect.Service<TursoService>()(
  'TursoService',
  {
    effect: Effect.gen(function* () {
      const url = yield* Config.string('TURSO_DATABASE_URL')
      const authToken = yield* Config.string('TURSO_AUTH_TOKEN')
      const turso = createClient({ url, authToken })

      return {
        execute: (params: InStatement) =>
          Effect.tryPromise({
            try: () => turso.execute(params),
            catch: (e) =>
              new DatabaseError({
                message: '데이터 조회에 실패했습니다.',
                cause: e,
              }),
          }),
      }
    }),
  }
) {}
