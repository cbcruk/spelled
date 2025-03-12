'use client'

import { useActionState } from 'react'
import { checkSpelling } from './SpellFormCheck.actions'
import { SpellFormSave } from './SpellFormSave'

type SpellFormCheckProps = {
  children: typeof SpellFormSave
}

function useCheckSpellingActionState() {
  const actionState = useActionState<
    ReturnType<typeof checkSpelling>,
    FormData
  >(checkSpelling, {
    data: null,
    error: null,
  })

  return actionState
}

export function SpellFormCheck({ children }: SpellFormCheckProps) {
  const [state, formAction, isPending] = useCheckSpellingActionState()

  return (
    <>
      <form action={formAction}>
        <textarea
          name="input"
          placeholder="맞춤법 검사를 원하는 단어나 문장을 입력해 주세요."
          defaultValue="아버지 가방에 들어가신다."
        />
        <p aria-live="polite">{state.error?.message}</p>
        <button disabled={isPending}>검사하기</button>
      </form>
      {children({
        data: state.data,
      })}
    </>
  )
}
