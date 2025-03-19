'use client'

import { ComponentProps, useActionState } from 'react'
import { checkSpelling } from './SpellFormCheck.actions'
import { SpellFormSave } from './SpellFormSave'
import {
  SpellFormCheckCorrection,
  SpellFormCheckCorrectionBody,
  SpellFormCheckCorrectionLabel,
} from './SpellFormCheckCorrection'
import { Difficulty } from '@/constants'
import {
  ArrowRightIcon,
  DividerVerticalIcon,
  InputIcon,
  MagicWandIcon,
  TargetIcon,
} from '@radix-ui/react-icons'

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
              className="w-full p-2 bg-green-600 rounded-lg text-xs hover:font-bold hover:shadow cursor-pointer transition-all disabled:opacity-20"
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
            <SpellFormCheckCorrection>
              <SpellFormCheckCorrectionLabel>
                <TargetIcon /> 점수
              </SpellFormCheckCorrectionLabel>
              <SpellFormCheckCorrectionBody>
                {state.data?.score ?? '0'}점
              </SpellFormCheckCorrectionBody>
            </SpellFormCheckCorrection>

            <SpellFormCheckCorrection>
              <SpellFormCheckCorrectionLabel>
                <InputIcon /> 원본 텍스트
              </SpellFormCheckCorrectionLabel>
              <SpellFormCheckCorrectionBody>
                {state.data?.input ?? '-'}
              </SpellFormCheckCorrectionBody>
            </SpellFormCheckCorrection>

            <SpellFormCheckCorrection>
              <SpellFormCheckCorrectionLabel>
                <MagicWandIcon /> 수정된 텍스트
              </SpellFormCheckCorrectionLabel>
              <SpellFormCheckCorrectionBody>
                {state.data?.corrected ?? '-'}
              </SpellFormCheckCorrectionBody>
            </SpellFormCheckCorrection>

            <hr className="border-gray-800" />
            <div className="flex flex-col gap-2">
              {state.data?.corrections.map((correction, index) => {
                return (
                  <div key={index}>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="inline-flex items-center gap-1 font-mono">
                        <span className="p-1 rounded-lg bg-red-300 text-red-900">
                          {correction.wrong}
                        </span>
                        <ArrowRightIcon />
                        <span className="p-1 rounded-lg bg-green-300 text-green-900">
                          {correction.correct}
                        </span>
                      </div>
                      <DividerVerticalIcon />
                      <span className="p-1 py-0.5 text-xs bg-purple-300 text-purple-800 rounded-lg font-medium">
                        {Difficulty.toHangul(correction.difficulty)}
                      </span>
                    </div>
                    <p className="inline-flex gap-1 py-2 text-sm">
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
