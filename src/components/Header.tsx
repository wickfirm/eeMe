'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setLang(i18next.language)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    i18next.changeLanguage(newLang)
    setLang(newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <header style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/assets/images/eeme-logo.svg" alt="eeMe" className="h-8 w-auto" />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button
              className="flex items-center gap-1 text-sm font-semibold tracking-wider uppercase"
              style={{ color: 'var(--color-text)' }}
            >
              {t('TALENTS', 'TALENTS')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
            >
              <Link
                href="/talent"
                className="block px-4 py-3 text-sm hover:text-primary transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                {t('All Talents', 'All Talents')}
              </Link>
            </div>
          </div>

          <Link
            href="/about-eeme"
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: 'var(--color-text)' }}
          >
            {t('About eeMe', 'About eeMe')}
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <svg className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('Looking for someone you love?', 'Looking for someone you love?')}
              className="bg-transparent text-sm outline-none w-56"
              style={{ color: 'var(--color-text)', '::placeholder': { color: 'var(--color-text-muted)' } } as React.CSSProperties}
            />
          </div>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--color-text)' }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2" style={{ backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/talent" className="block py-2 text-sm" style={{ color: 'var(--color-text)' }} onClick={() => setMenuOpen(false)}>
            {t('All Talents', 'All Talents')}
          </Link>
          <Link href="/about-eeme" className="block py-2 text-sm" style={{ color: 'var(--color-text)' }} onClick={() => setMenuOpen(false)}>
            {t('About eeMe', 'About eeMe')}
          </Link>
        </div>
      )}
    </header>
  )
}
