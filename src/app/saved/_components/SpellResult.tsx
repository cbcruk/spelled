import { SpellResultErrorBoundary } from './SpellResultErrorBoundary'
import { SpellResultItem } from './SpellResultItem'
import { Effect } from 'effect'
import { decodeSpelledArray } from '@/schema'
import { TursoService } from '@/services/Turso'
import { AuthService } from '@/services/Auth'

const main = () =>
  Effect.gen(function* () {
    const tursoService = yield* TursoService
    const authService = yield* AuthService

    const id = yield* authService.getUserId()
    const result = yield* tursoService.execute({
      sql: 'SELECT id, input, corrected, score, corrections FROM spelling WHERE user_id = ?',
      args: [id],
    })
    const data = yield* decodeSpelledArray(result.rows)

    return data
  }).pipe(
    Effect.provide(TursoService.Default),
    Effect.provide(AuthService.Default)
  )

async function SpellResultBody() {
  return (
    <div className="flex flex-col gap-4">
      {await main().pipe(
        Effect.match({
          onSuccess: (rows) =>
            rows.map((row) => {
              return <SpellResultItem key={row.id} data={row} />
            }),
          onFailure: (error) => <pre>{JSON.stringify(error, null, 2)}</pre>,
        }),
        Effect.runPromise
      )}
    </div>
  )
}

export function SpellResult() {
  return (
    <SpellResultErrorBoundary>
      <SpellResultBody />
    </SpellResultErrorBoundary>
  )
}
