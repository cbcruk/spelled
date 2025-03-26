import { SessionWithUserId } from '@/auth'
import { AuthService } from '@/services/Auth'
import { Effect, Match } from 'effect'
import { FC, ReactNode } from 'react'

export type SessionBodyProps = SessionWithUserId

type SessionProps = {
  children: FC<SessionBodyProps>
  fallback?: ReactNode
}

export async function Session({ children, fallback = null }: SessionProps) {
  return (
    <>
      {await Effect.runPromise(
        Effect.gen(function* () {
          const auth = yield* AuthService
          const session = yield* auth.get

          return session
        }).pipe(
          Effect.provide(AuthService.Default),
          Effect.match({
            onSuccess: (session) =>
              Match.value(session).pipe(
                Match.when(null, () => <>{fallback}</>),
                Match.orElse((session) => <>{children(session)}</>)
              ),
            onFailure: (error) => <pre>{error.message}</pre>,
          })
        )
      )}
    </>
  )
}
