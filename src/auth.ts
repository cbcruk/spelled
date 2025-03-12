import NextAuth, { Session } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { turso } from './lib/turso'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ profile, user }) {
      const email = profile?.email
      const id = user.id

      if (!email || !id) {
        return false
      }

      const { rows } = await turso.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [email],
      })

      if (rows.length === 0) {
        const now = new Date().toISOString()
        const name = profile.name ?? ''

        await turso.execute({
          sql: 'INSERT INTO users (id, name, email, created, updated) VALUES (?, ?, ?, ?, ?)',
          args: [id, name, email, now, now],
        })
      }

      return Boolean(profile?.email)
    },
    async session({ session }) {
      const { rows } = await turso.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [session.user.email],
      })
      const row = rows.at(0)

      if (row) {
        session.user.id = row.id as string
      }

      return session
    },
  },
})

export type SessionUserId = string

export type SessionWithUserId = Session & {
  user: {
    id: SessionUserId
  }
}

export async function getSession() {
  const session = (await auth()) as SessionWithUserId

  return session
}
