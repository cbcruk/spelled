'use client'

import { useActionState } from 'react'
import { createSpelling } from './SpellFormSave.actions'
import { CheckSpellingStateData } from './SpellFormCheck.actions'
import { BookmarkIcon } from '@radix-ui/react-icons'

type SpellFormSaveProps = {
  data: CheckSpellingStateData
}

export function SpellFormSave({ data }: SpellFormSaveProps) {
  const [, formAction, isPending] = useActionState(
    createSpelling.bind(null, data),
    {
      data: null,
      error: null,
    }
  )

  return (
    <form action={formAction}>
      <button disabled={isPending} title="저장하기" className="cursor-pointer">
        <BookmarkIcon />
      </button>
    </form>
  )
}
