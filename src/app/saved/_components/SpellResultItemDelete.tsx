import { TrashIcon } from '@radix-ui/react-icons'
import { useActionState } from 'react'
import { deleteSpelling } from './SpellResultItemDelete.actions'
import { Spelled } from '@/schema'

type SpellResultItemDeleteProps = Pick<Spelled, 'id'>

export function SpellResultItemDelete({ id }: SpellResultItemDeleteProps) {
  const [, formAction, isPending] = useActionState(deleteSpelling, {
    data: null,
    error: null,
  })

  return (
    <form action={formAction}>
      <input type="hidden" name="id" defaultValue={id} />
      <button
        type="submit"
        className="flex items-center justify-center w-[20px] h-[20px] rounded-lg hover:bg-red-400 aspect-square cursor-pointer disabled:opacity-20"
        disabled={isPending}
      >
        <TrashIcon />
      </button>
    </form>
  )
}
