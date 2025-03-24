import { Context, Data, Effect, Layer } from 'effect'
import { openAI } from '@/lib/open-ai'
import OpenAI from 'openai'

export class OpenAIService extends Context.Tag('OpenAIService')<
  OpenAIService,
  {
    create: (
      body: OpenAI.ChatCompletionCreateParamsNonStreaming
    ) => Effect.Effect<OpenAI.ChatCompletion, OpenAIError>
  }
>() {}

class OpenAIError extends Data.TaggedError('OpenAIError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export const OpenAIServiceLive = Layer.succeed(OpenAIService, {
  create: (body) =>
    Effect.tryPromise({
      try: async () => {
        const chatCompletion = await openAI.chat.completions.create(body)
        return chatCompletion
      },
      catch: (e) =>
        new OpenAIError({
          cause: e,
          message: 'OpenAI 요청 시 에러가 발생했습니다.',
        }),
    }),
})
