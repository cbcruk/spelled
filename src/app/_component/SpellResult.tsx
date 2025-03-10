import { auth } from '@/auth'
import { turso } from '@/lib/turso'

export async function SpellResult() {
  const session = await auth()
  const result = await turso
    .execute({
      sql: 'SELECT * FROM spelling WHERE user_id = ?',
      args: [session?.user?.id ?? ''],
    })
    .catch(() => null)

  return <pre>{JSON.stringify(result, null, 2)}</pre>
}
