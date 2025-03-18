import { PropsWithChildren } from 'react'

type SpellResultItemInputWithMarkProps = {
  marked: string[]
}

export function SpellResultItemInputWithMark({
  marked,
  children,
}: PropsWithChildren<SpellResultItemInputWithMarkProps>) {
  return (
    <p
      className="overflow-auto p-2 rounded-lg bg-gray-800 text-xs leading-relaxed"
      ref={(el) => {
        if (!el) {
          return
        }

        const regex = new RegExp(
          marked
            .map((mark) => mark.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
            .join('|'),
          'g'
        )
        const textContent = el.textContent ?? ''

        el.innerHTML = textContent.replace(
          regex,
          '<mark class="px-0.5 rounded-md bg-red-300 font-medium">$&</mark>'
        )
      }}
    >
      {children}
    </p>
  )
}
