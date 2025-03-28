import { SpellResultErrorBoundary } from './SpellResultErrorBoundary'
import { Session, SessionBodyProps } from '../../_component/Session/Session'
import { SpellResultItem } from './SpellResultItem'
import { Effect, Match, Schema } from 'effect'
import { SpelledSchema } from '@/schema'
import { ResultSet } from '@libsql/client'
import { TursoService } from '@/services/Turso'
import { SessionUserId } from '@/auth'

type SpellResultBodyProps = SessionBodyProps

const decodeSpelling = (result: ResultSet) =>
  Effect.gen(function* () {
    const decoded = yield* Schema.decodeUnknown(Schema.Array(SpelledSchema))(
      result.rows.map((row) => {
        return {
          id: row['id'],
          input: row['input'],
          corrected: row['corrected'],
          score: row['score'],
          corrections: row['corrections'],
        }
      })
    )

    return decoded
  })

const findSpellingByUserId = (id: SessionUserId) =>
  Effect.gen(function* () {
    const turso = yield* TursoService
    const result = yield* turso.execute({
      sql: 'SELECT * FROM spelling WHERE user_id = ?',
      args: [id],
    })

    return result
  }).pipe(Effect.provide(TursoService.Default))

const main = (id: SessionUserId) =>
  Effect.gen(function* () {
    const result = yield* findSpellingByUserId(id)
    const data = yield* decodeSpelling(result)

    return data
  })

async function SpellResultBody({ user }: SpellResultBodyProps) {
  return (
    <div className="flex flex-col gap-4">
      {await Effect.runPromise(
        main(user.id).pipe(
          Effect.match({
            onSuccess: (rows) =>
              rows.map((row) => {
                return <SpellResultItem key={row.id} data={row} />
              }),
            onFailure: Match.valueTags({
              ParseError: () => <pre>ParseError</pre>,
              DatabaseError: () => <pre>DatabaseError</pre>,
              ConfigError: () => <pre>ConfigError</pre>,
            }),
          })
        )
      )}
    </div>
  )
}

export function SpellResult() {
  return (
    <SpellResultErrorBoundary>
      <Session>{SpellResultBody}</Session>
    </SpellResultErrorBoundary>
  )
}
