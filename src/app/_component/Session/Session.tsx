import { getSession, SessionWithUserId } from '@/auth'
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
        getSession.pipe(
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
