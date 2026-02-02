import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI SEO 部落格生成器 | 熱門關鍵字內容創作工具',
  description: '自動抓取熱門關鍵字，生成 SEO 優化的部落格標題和內容，支援人工審核與一鍵發布',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
