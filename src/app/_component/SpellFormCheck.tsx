'use client'

import { useActionState } from 'react'
import { checkSpelling } from './SpellForm.actions'
import { SpellFormSave } from './SpellFormSave'

type SpellFormCheckProps = {
  children: typeof SpellFormSave
}

export function SpellFormCheck({ children }: SpellFormCheckProps) {
  const [state, formAction, isPending] = useActionState(checkSpelling, {
    data: null,
    errors: [],
  })

  return (
    <>
      <form action={formAction}>
        <textarea
          name="input"
          placeholder="맞춤법 검사를 원하는 단어나 문장을 입력해 주세요."
          defaultValue="아버지 가방에 들어가신다."
        />
        <button disabled={isPending}>검사하기</button>
      </form>
      {children({
        data: state.data,
      })}
    </>
  )
}
