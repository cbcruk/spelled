import { Config, Data, Effect } from 'effect'
import OpenAI from 'openai'

class OpenAIError extends Data.TaggedError('OpenAIError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export class OpenAIService extends Effect.Service<OpenAIService>()(
  'OpenAIService',
  {
    effect: Effect.gen(function* () {
      const apiKey = yield* Config.string('OPENAI_API_KEY')
      const openAI = new OpenAI({ apiKey })

      return {
        create: (body: OpenAI.ChatCompletionCreateParamsNonStreaming) =>
          Effect.tryPromise({
            try: () => openAI.chat.completions.create(body),
            catch: (e) =>
              new OpenAIError({
                cause: e,
                message: 'OpenAI 요청 중 에러가 발생했습니다.',
              }),
          }),
      }
    }),
  }
) {}
