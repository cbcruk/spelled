import { auth } from '@/auth'
import { turso } from '@/lib/turso'

async function Home() {
  const session = await auth()
  const result = await turso.execute('SELECT * FROM checks').catch(() => {})

  return <pre>{JSON.stringify({ session, result }, null, 2)}</pre>
}

export default Home
