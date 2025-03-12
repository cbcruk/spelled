import { SessionUserId } from '@/auth'
import { turso } from '@/lib/turso'
import { SpellResultErrorBoundary } from './SpellResultErrorBoundary'
import { Session, SessionBodyProps } from './Session'

async function getSpelling(id: SessionUserId) {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM spelling WHERE user_id = ?',
      args: [id],
    })

    return result
  } catch (error) {
    throw error
  }
}

type SpellResultBodyProps = SessionBodyProps

async function SpellResultBody({ user }: SpellResultBodyProps) {
  const data = await getSpelling(user.id)

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export function SpellResult() {
  return (
    <SpellResultErrorBoundary>
      <Session>{SpellResultBody}</Session>
    </SpellResultErrorBoundary>
  )
}
