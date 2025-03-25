import NextAuth, { Profile, Session } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { Data, Effect } from 'effect'
import { TursoService, TursoServiceLive } from './services/Turso'
import { decodeUserId } from './schema'

const findUserByEmail = (email: string) =>
  Effect.gen(function* () {
    const turso = yield* TursoService
    const { rows } = yield* turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    })
    const user = yield* decodeUserId(rows.at(0))

    return user
  }).pipe(
    Effect.provide(TursoServiceLive),
    Effect.match({
      onSuccess(data) {
        return data
      },
      onFailure(e) {
        console.error(e._tag)
        return null
      },
    })
  )

const createUser = (id: string, profile: Profile) =>
  Effect.gen(function* () {
    const row = yield* findUserByEmail(profile.email ?? '')

    if (!row) {
      const now = new Date().toISOString()
      const name = profile.name ?? ''
      const turso = yield* TursoService

      yield* turso.execute({
        sql: 'INSERT INTO users (id, name, email, created, updated) VALUES (?, ?, ?, ?, ?)',
        args: [id, name, profile.email ?? '', now, now],
      })
    }
  }).pipe(Effect.provide(TursoServiceLive))

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ profile, user }) {
      return Effect.runPromise(
        Effect.gen(function* () {
          const id = user.id
          const email = profile?.email

          if (!id || !email) {
            return false
          }

          yield* createUser(id, profile)

          return Boolean(email)
        })
      )
    },
    async session({ session }) {
      return Effect.runPromise(
        Effect.gen(function* () {
          const row = yield* findUserByEmail(session.user.email)

          if (row) {
            session.user.id = row.id
          }

          return session
        })
      )
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
