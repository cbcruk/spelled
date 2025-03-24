import { Context, Data, Layer } from 'effect'
import { InStatement, ResultSet } from '@libsql/client'
import { turso } from '@/lib/turso'

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export class TursoService extends Context.Tag('TursoService')<
  TursoService,
  {
    execute: (params: InStatement) => Promise<ResultSet>
  }
>() {}

export const TursoServiceLive = Layer.succeed(TursoService, {
  execute: (params: InStatement) => turso.execute(params),
})
