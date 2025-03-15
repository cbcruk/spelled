import { SessionUserId } from '@/auth'
import { turso } from '@/lib/turso'
import { SpellResultErrorBoundary } from './SpellResultErrorBoundary'
import { Session, SessionBodyProps } from '../../_component/Session/Session'
import { Spelled } from '@/types'
import { SpellResultItem } from './SpellResultItem'

async function getSpelling(id: SessionUserId) {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM spelling WHERE user_id = ?',
      args: [id],
    })

    return result.rows.map((row) => {
      return {
        id: row['id'],
        input: row['input'],
        corrected: row['corrected'],
        score: row['score'],
        corrections: JSON.parse(row['corrections'] as string),
      } as unknown as Spelled
    })
  } catch (error) {
    throw error
  }
}

type SpellResultBodyProps = SessionBodyProps

async function SpellResultBody({ user }: SpellResultBodyProps) {
  const rows = await getSpelling(user.id)

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => {
        return <SpellResultItem key={row.id} data={row} />
      })}
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
