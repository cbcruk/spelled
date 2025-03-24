'use client'

import { useActionState } from 'react'
import { createSpelling } from './SpellFormSave.actions'
import { CheckSpellingStateData } from './SpellFormCheck.actions'
import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import { Match } from 'effect'

type SpellFormSaveProps = {
  data: CheckSpellingStateData
}

export function SpellFormSave({ data }: SpellFormSaveProps) {
  const [state, formAction, isPending] = useActionState(
    () => createSpelling(data),
    null
  )

  return (
    <form action={formAction}>
      <button disabled={isPending} title="저장하기" className="cursor-pointer">
        {Match.value(state).pipe(
          Match.when({ data: Match.defined }, () => <BookmarkFilledIcon />),
          Match.orElse(() => <BookmarkIcon />)
        )}
      </button>
    </form>
  )
}
