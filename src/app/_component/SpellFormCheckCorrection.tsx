import clsx from 'clsx'
import { PropsWithChildren } from 'react'

type SpellFormCheckCorrectionProps = PropsWithChildren<{
  theme?: 'red' | 'green' | 'blue'
  label: string
}>

export function SpellFormCheckCorrection({
  label,
  theme,
  children,
}: SpellFormCheckCorrectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium">{label}</div>
      <mark
        data-theme={theme}
        className={clsx(
          'max-w-fit p-1 rounded-md text-xs font-mono bg-gray-300',
          [
            'data-[theme=red]:bg-red-200 data-[theme=red]:text-red-700',
            'data-[theme=green]:bg-green-200 data-[theme=green]:text-green-700',
            'data-[theme=blue]:bg-blue-200 data-[theme=blue]:text-blue-700',
          ]
        )}
      >
        {children}
      </mark>
    </div>
  )
}
