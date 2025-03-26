import { auth, SessionWithUserId } from '@/auth'
import { Data, Effect } from 'effect'

export class AuthError extends Data.TaggedError('AuthError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
  succeed: {
    get: Effect.tryPromise({
      try: () => auth() as Promise<SessionWithUserId | null>,
      catch: (e) =>
        new AuthError({ cause: e, message: '인증에러가 발생했습니다.' }),
    }),
  },
}) {}
