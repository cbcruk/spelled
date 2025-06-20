import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { Effect, pipe } from 'effect'
import { decodeSignInUser } from './schema'
import { UserService } from './services/User'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user }) {
      return Effect.gen(function* () {
        const userService = yield* UserService
        const validatedUser = yield* decodeSignInUser(user)

        yield* pipe(
          userService.findUserByEmail(validatedUser.email),
          Effect.catchTag('NotFoundError', () =>
            userService.createUser({
              id: validatedUser.id,
              name: validatedUser.name,
              email: validatedUser.email,
            })
          )
        )

        return true
      }).pipe(Effect.provide(UserService.Default), Effect.runPromise)
    },
    async session({ session }) {
      return Effect.gen(function* () {
        const userService = yield* UserService

        yield* pipe(
          userService.findUserByEmail(session.user.email),
          Effect.matchEffect({
            onSuccess: (user) =>
              Effect.sync(() => {
                session.user.id = user.id
              }),
            onFailure: () => Effect.void,
          })
        )

        return session
      }).pipe(Effect.provide(UserService.Default), Effect.runPromise)
    },
  },
})
