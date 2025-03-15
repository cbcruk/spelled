'use client'

import { ComponentProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Layout({ children }: ComponentProps<'div'>) {
  return (
    <>
      <LayoutNav />
      <LayoutBody>{children}</LayoutBody>
    </>
  )
}

function LayoutNavLink(props: ComponentProps<typeof Link>) {
  return <Link className="data-[active=true]:text-gray-50" {...props} />
}

export function LayoutNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-4 p-4 border-b-1 border-gray-900 text-gray-400 text-sm">
      <LayoutNavLink href="/" data-active={pathname === '/'}>
        홈
      </LayoutNavLink>
      <LayoutNavLink href="/saved" data-active={pathname === '/saved'}>
        기록
      </LayoutNavLink>
    </nav>
  )
}

export function LayoutBody({ children }: ComponentProps<'div'>) {
  return <div className="p-4">{children}</div>
}
