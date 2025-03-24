import { SpellResultErrorBoundary } from './SpellResultErrorBoundary'
import { Session, SessionBodyProps } from '../../_component/Session/Session'
import { SpellResultItem } from './SpellResultItem'
import { Effect, Match, Schema } from 'effect'
import { SpelledSchema } from '@/schema'
import { ResultSet } from '@libsql/client'
import { DatabaseError, TursoService, TursoServiceLive } from '@/services/Turso'
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
  TursoService.pipe(
    Effect.andThen((turso) =>
      Effect.tryPromise({
        try: async () => {
          const result = await turso.execute({
            sql: 'SELECT * FROM spelling WHERE user_id = ?',
            args: [id],
          })

          return result
        },
        catch: (e) =>
          new DatabaseError({
            cause: e,
            message: `데이터 조회에 실패했습니다.`,
          }),
      })
    )
  )

const main = (id: SessionUserId) =>
  Effect.gen(function* () {
    const result = yield* findSpellingByUserId(id)
    const data = yield* decodeSpelling(result)

    return data
  }).pipe(Effect.provide(TursoServiceLive))

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
              DatabaseError: (error) => (
                <pre>DatabaseError: {error.message}</pre>
              ),
              ParseError: (error) => <pre>ParseError: {error.message}</pre>,
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
