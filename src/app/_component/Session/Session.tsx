import { getSession, SessionWithUserId } from '@/auth'
import { FC, ReactNode } from 'react'

export type SessionBodyProps = SessionWithUserId

type SessionProps = {
  children: FC<SessionBodyProps>
  fallback?: ReactNode
}

export async function Session({ children, fallback = null }: SessionProps) {
  const session = await getSession()

  if (!session) {
    return <>{fallback}</>
  }

  return <>{children(session)}</>
}
