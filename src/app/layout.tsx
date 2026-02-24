import type { Metadata } from 'next'
import './globals.css'
import I18nProvider from '@/components/I18nProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'eeMe — Showcasing people, their news & creating connections',
    template: '%s | eeMe',
  },
  description: 'The tech platform that finally allows you to control and own your content.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://eeme.io'),
  openGraph: {
    siteName: 'eeMe',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  )
}
