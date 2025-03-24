import NextAuth, { Session } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { turso } from './lib/turso'
import { Data, Effect } from 'effect'

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

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export class SessionError extends Data.TaggedError('SessionError')<{
  readonly message: string
}> {}

export const getSession = Effect.tryPromise({
  try: () => auth() as Promise<SessionWithUserId | null>,
  catch: (e) =>
    new AuthError({ cause: e, message: '인증에러가 발생했습니다.' }),
})
