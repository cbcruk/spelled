'use client'

import { ComponentProps, useActionState } from 'react'
import { checkSpelling } from './SpellFormCheck.actions'
import { SpellFormSave } from './SpellFormSave'
import { SpellFormCheckCorrection } from './SpellFormCheckCorrection'
import { Difficulty } from '@/constants'

type SpellFormCheckProps = {
  children: typeof SpellFormSave
}

function useCheckSpellingActionState() {
  const initialState = {
    data: null,
    error: null,
  }
  const actionState = useActionState<
    ReturnType<typeof checkSpelling>,
    FormData
  >(checkSpelling, initialState)

  return actionState
}

function SpellFormCheckCard({ children }: ComponentProps<'div'>) {
  return (
    <div className="p-4 border border-gray-600 rounded-lg w-full">
      {children}
    </div>
  )
}

export function SpellFormCheck({ children }: SpellFormCheckProps) {
  const [state, formAction, isPending] = useCheckSpellingActionState()

  return (
    <div className="flex flex-col gap-4">
      <SpellFormCheckCard>
        <div className="flex flex-col gap-1 pb-4">
          <h2 className="font-bold">원문</h2>
          <p className="text-sm text-gray-600">
            맞춤법 검사를 원하는 문장을 입력해 주세요.
          </p>
        </div>
        <form action={formAction} className="flex flex-col">
          <textarea
            name="input"
            placeholder="문장을 입력하거나 붙여넣기 해 주세요."
            className="w-full p-2 border border-gray-600 rounded-lg text-sm"
            rows={4}
            required
          />
          <div className="pt-4">
            <button
              disabled={isPending}
              className="w-full p-2 bg-green-600 rounded-lg text-xs hover:font-bold hover:shadow cursor-pointer transition-all disabled:opacity-25"
            >
              검사하기
            </button>
          </div>
        </form>
      </SpellFormCheckCard>
      {state.data && (
        <SpellFormCheckCard>
          <div className="flex flex-col gap-1 pb-4">
            <div className="flex justify-between">
              <h2 className="font-bold">교정</h2>
              {children({
                data: state.data,
              })}
            </div>
            <p className="text-sm text-gray-600">
              제안된 수정 사항을 검토하세요.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <SpellFormCheckCorrection label="점수">
              {state.data?.score ?? '-'}
            </SpellFormCheckCorrection>
            <SpellFormCheckCorrection label="원본 텍스트">
              {state.data?.input ?? '-'}
            </SpellFormCheckCorrection>
            <SpellFormCheckCorrection label="수정된 텍스트">
              {state.data?.corrected ?? '-'}
            </SpellFormCheckCorrection>
            <hr className="border-gray-600" />
            <div className="p-0">
              {state.data?.corrections.map((correction, index) => {
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center text-xs">
                      <div className="inline-flex items-center gap-1 font-mono">
                        <span className="p-1 rounded-lg bg-red-200 text-red-800">
                          {correction.wrong}
                        </span>
                        →
                        <span className="p-1 rounded-lg bg-green-200 text-green-800">
                          {correction.correct}
                        </span>
                      </div>
                    </div>
                    <p className="inline-flex gap-1 py-2 text-sm">
                      <span data-difficulty={correction.difficulty}>
                        {Difficulty.toEmoji(correction.difficulty)}
                      </span>
                      {correction.explanation}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </SpellFormCheckCard>
      )}
    </div>
  )
}
