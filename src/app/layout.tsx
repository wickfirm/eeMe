import type { Metadata } from 'next'
import { League_Spartan, Lato, Roboto } from 'next/font/google'
import './globals.css'
import I18nProvider from '@/components/I18nProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-league-spartan',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

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
    <html lang="en" suppressHydrationWarning className={`${leagueSpartan.variable} ${lato.variable} ${roboto.variable}`}>
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
