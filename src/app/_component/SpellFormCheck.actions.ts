'use server'

import { decodeSpelled } from '@/schema'
import { OpenAIService, OpenAIServiceLive } from '@/services/OpenAI'
import { Effect } from 'effect'

export const checkSpelling = async (text: string) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const openAI = yield* OpenAIService
      const chatCompletion = yield* openAI.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: `다음 문장의 맞춤법과 문법을 검사하고, JSON 형식으로 응답하세요. 또한 수정이 얼마나 쉬운지 "difficulty" 필드를 추가하세요.
              응답포멧은 다음 구조를 따르는 JSON으로 반환해주시면 됩니다.
      
              {
                "input": "(사용자가 입력한 원본 문장)",
                "corrected": "(맞춤법과 문법이 수정된 문장)",
                "score": (0~100 사이의 점수),
                "corrections": [
                  {
                    "wrong": "(잘못된 부분)",
                    "correct": "(수정된 표현)",
                    "explanation": "(틀린 이유와 수정 방법 설명)",
                    "difficulty": "(easy | medium | hard)"
                  }
                ]
              }`,
              },
            ],
          },
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
      const content = chatCompletion.choices.at(0)?.message.content
      const data = yield* decodeSpelled(JSON.parse(content ?? ''))

      return data
    }).pipe(
      Effect.provide(OpenAIServiceLive),
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
