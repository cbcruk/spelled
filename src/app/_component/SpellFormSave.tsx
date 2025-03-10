'use client'

import { useActionState } from 'react'
import { CheckSpellingReturnData, createSpelling } from './SpellForm.actions'

type SpellFormSaveProps = {
  data: CheckSpellingReturnData
}

export function SpellFormSave({ data }: SpellFormSaveProps) {
  const [state, formAction, isPending] = useActionState(
    createSpelling.bind(null, data),
    {
      data: null,
      errors: [],
    }
  )

  return (
    <form action={formAction}>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button disabled={isPending}>저장하기</button>
    </form>
  )
}
