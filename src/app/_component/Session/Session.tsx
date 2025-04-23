import { AuthService } from '@/services/Auth'
import { Effect, Match, pipe } from 'effect'
import { DefaultSession, User } from 'next-auth'
import { FC, ReactNode } from 'react'

export type SessionBodyProps = DefaultSession

type SessionProps = {
  children: FC<SessionBodyProps>
  fallback?: ReactNode
}

export type SessionUserBodyProps = Extract<DefaultSession['user'], User>

export async function Session({ children, fallback = null }: SessionProps) {
  return (
    <>
      {await Effect.gen(function* () {
        const auth = yield* AuthService
        const session = yield* auth.getSession()

        return session
      }).pipe(
        Effect.provide(AuthService.Default),
        Effect.match({
          onSuccess: (session) => <>{children(session)}</>,
          onFailure: (error) =>
            pipe(
              Match.value(error._tag),
              Match.when('SessionError', () => <>{fallback}</>),
              Match.orElse((error) => (
                <pre>{JSON.stringify(error, null, 2)}</pre>
              ))
            ),
        }),
        Effect.runPromise
      )}
    </>
  )
}
