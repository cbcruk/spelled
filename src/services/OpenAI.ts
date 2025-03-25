import { Config, Context, Data, Effect, Layer } from 'effect'
import OpenAI from 'openai'

class OpenAIError extends Data.TaggedError('OpenAIError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export class OpenAIService extends Context.Tag('OpenAIService')<
  OpenAIService,
  {
    create: (
      body: OpenAI.ChatCompletionCreateParamsNonStreaming
    ) => Effect.Effect<OpenAI.ChatCompletion, OpenAIError>
  }
>() {}

export const OpenAIServiceLive = Effect.gen(function* () {
  const apiKey = yield* Config.string('OPENAI_API_KEY')
  const openAI = new OpenAI({ apiKey })

  return OpenAIService.of({
    create: (body) =>
      Effect.tryPromise({
        try: () => openAI.chat.completions.create(body),
        catch: (e) =>
          new OpenAIError({
            cause: e,
            message: 'OpenAI 요청 시 에러가 발생했습니다.',
          }),
      }),
  })
}).pipe(Layer.effect(OpenAIService))
