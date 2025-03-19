import { ComponentProps, PropsWithChildren } from 'react'

type SpellFormCheckCorrectionProps = PropsWithChildren<{
  theme?: 'red' | 'green' | 'blue'
}>

export function SpellFormCheckCorrectionLabel({
  children,
}: ComponentProps<'div'>) {
  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {children}
    </div>
  )
}

export function SpellFormCheckCorrectionBody({
  children,
}: ComponentProps<'p'>) {
  return (
    <p className="max-w-fit p-2 rounded-md text-xs font-mono bg-gray-800">
      {children}
    </p>
  )
}

export function SpellFormCheckCorrection({
  children,
}: SpellFormCheckCorrectionProps) {
  return <div className="flex flex-col gap-2">{children}</div>
}
