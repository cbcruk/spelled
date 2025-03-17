'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LayoutAvatar() {
  const session = useSession()
  const pathname = usePathname()

  return (
    <Link
      href="/auth"
      data-active={pathname === '/auth'}
      className="w-[24px] h-[24px] bg-gray-600 rounded-full overflow-hidden data-[active=true]:border border-green-600"
    >
      {(() => {
        switch (session.status) {
          case 'authenticated':
            return (
              <Image
                src={session.data?.user?.image as string}
                alt=""
                width={24}
                height={24}
              />
            )
          default:
        }
      })()}
    </Link>
  )
}
