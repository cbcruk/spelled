'use client'

import { PropsWithChildren } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export function SpellResultErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
      {children}
    </ErrorBoundary>
  )
}
