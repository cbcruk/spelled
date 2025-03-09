import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans_KR({
  weight: ['400', '500', '900'],
  preload: false,
})

export const metadata: Metadata = {
  title: 'spelled',
  description: '맞춤법',
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className={`${notoSans.className} antialiased`}>{children}</body>
    </html>
  )
}
