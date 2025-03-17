'use client'

import { ComponentProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutAvatar } from './LayoutAvatart'

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
    <nav className="flex items-center justify-between p-4 border-b-1 border-gray-900 text-gray-400 text-sm">
      <div className="flex items-center gap-4">
        <LayoutNavLink href="/" data-active={pathname === '/'}>
          홈
        </LayoutNavLink>
        <LayoutNavLink href="/saved" data-active={pathname === '/saved'}>
          기록
        </LayoutNavLink>
      </div>
      <div className="flex">
        <LayoutAvatar />
      </div>
    </nav>
  )
}

export function LayoutBody({ children }: ComponentProps<'div'>) {
  return <div className="p-4">{children}</div>
}
