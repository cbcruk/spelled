import { auth } from '@/auth'

export async function Session() {
  const session = await auth()

  return <pre>{JSON.stringify(session, null, 2)}</pre>
}
