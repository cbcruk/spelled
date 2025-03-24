import { Context, Data, Effect, Layer } from 'effect'
import { openAI } from '@/lib/open-ai'

export class OpenAIService extends Context.Tag('OpenAIService')<
  OpenAIService,
  {
    create: (text: string) => Effect.Effect<string | null, OpenAIError>
  }
>() {}

class OpenAIError extends Data.TaggedError('OpenAIError')<{
  readonly message: string
  readonly cause: unknown
}> {}

export const OpenAIServiceLive = Layer.succeed(OpenAIService, {
  create: (text: string) =>
    Effect.tryPromise({
      try: async () => {
        const chatCompletion = await openAI.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text,
                },
              ],
            },
          ],
          response_format: {
            type: 'text',
          },
          temperature: 1,
          max_completion_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })

        return chatCompletion.choices[0]?.message.content
      },
      catch: (e) =>
        new OpenAIError({
          cause: e,
          message: 'OpenAI 요청 시 에러가 발생했습니다.',
        }),
    }),
})
