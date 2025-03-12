'use client'

import { useActionState } from 'react'
import { createSpelling } from './SpellFormSave.actions'
import { CheckSpellingStateData } from './SpellFormCheck.actions'

type SpellFormSaveProps = {
  data: CheckSpellingStateData
}

export function SpellFormSave({ data }: SpellFormSaveProps) {
  const [state, formAction, isPending] = useActionState(
    createSpelling.bind(null, data),
    {
      data: null,
      error: null,
    }
  )

  return (
    <form action={formAction}>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <p aria-live="polite">{state.error?.message}</p>
      <button disabled={isPending}>저장하기</button>
    </form>
  )
}
