import { Data, Effect, Option, pipe } from 'effect'
import { TursoService } from './Turso'
import { decodeUser, User, UserEmail } from '@/schema'

export class NotFoundError extends Data.TaggedError('NotFoundError')<{
  readonly message?: string
}> {}

export class UserService extends Effect.Service<UserService>()('UserService', {
  effect: Effect.gen(function* () {
    const turso = yield* TursoService

    return {
      findUserByEmail: (email: UserEmail) =>
        Effect.gen(function* () {
          const result = yield* turso.execute({
            sql: 'SELECT id FROM users WHERE email = ?',
            args: [email],
          })
          const row = yield* pipe(
            Option.fromNullable(result.rows.at(0)),
            Option.match({
              onNone: () => Effect.fail(new NotFoundError({ message: '404' })),
              onSome: (row) => Effect.succeed(row),
            })
          )
          const user = yield* decodeUser(row)

          return user
        }),
      createUser: ({ id, name, email }: Pick<User, 'id' | 'name' | 'email'>) =>
        Effect.gen(function* () {
          const now = new Date().toISOString()

          yield* turso.execute({
            sql: 'INSERT INTO users (id, name, email, created, updated) VALUES (?, ?, ?, ?, ?)',
            args: [id, name, email ?? '', now, now],
          })
        }),
    }
  }),
  dependencies: [TursoService.Default],
}) {}
