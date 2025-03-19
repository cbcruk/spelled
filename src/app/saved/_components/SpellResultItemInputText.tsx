import { ComponentProps } from 'react'
import Highlighter from 'react-highlight-words'

type SpellResultItemInputWithMarkProps = ComponentProps<typeof Highlighter>

export function SpellResultItemInputWithMark(
  props: SpellResultItemInputWithMarkProps
) {
  return (
    <div className="overflow-auto p-2 rounded-lg bg-gray-800 text-xs leading-relaxed">
      <Highlighter {...props} />
    </div>
  )
}
