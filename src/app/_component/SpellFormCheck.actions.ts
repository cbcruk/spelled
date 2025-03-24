'use server'

import { decodeSpelled, Spelled } from '@/schema'
import { OpenAIService, OpenAIServiceLive } from '@/services/OpenAI'
import { Effect } from 'effect'

export type CheckSpellingStateData = Spelled | null

export const checkSpelling = async (text: string) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const content = yield* OpenAIService.pipe(
        Effect.andThen((openAI) => openAI.create(text))
      ).pipe(Effect.provide(OpenAIServiceLive))
      const data = yield* decodeSpelled(JSON.parse(content ?? ''))

      return data
    }).pipe(
      Effect.match({
        onSuccess: (data) => {
          return {
            data,
          }
        },
        onFailure(error) {
          return {
            error,
          }
        },
      })
    )
  )
