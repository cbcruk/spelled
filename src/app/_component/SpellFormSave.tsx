'use client'

import { useActionState } from 'react'
import { createSpelling } from './SpellFormSave.actions'
import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import { Option } from 'effect'
import { Spelled } from '@/schema'

type SpellFormSaveProps = {
  data: Spelled
}

export function SpellFormSave({ data }: SpellFormSaveProps) {
  const [state, formAction, isPending] = useActionState(
    () => createSpelling(data),
    null
  )

  return (
    <form action={formAction}>
      <button disabled={isPending} title="저장하기" className="cursor-pointer">
        {Option.fromNullable(state).pipe(
          Option.match({
            onSome() {
              return <BookmarkFilledIcon />
            },
            onNone() {
              return <BookmarkIcon />
            },
          })
        )}
      </button>
    </form>
  )
}
