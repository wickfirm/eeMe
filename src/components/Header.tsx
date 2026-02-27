'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [talentsOpen, setTalentsOpen] = useState(false)
  const [lang, setLang] = useState('en')
  const talentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLang(i18next.language)
  }, [])

  // Close talents dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (talentsRef.current && !talentsRef.current.contains(e.target as Node)) {
        setTalentsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    i18next.changeLanguage(newLang)
    setLang(newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  const navLinkStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    letterSpacing: '0.01em',
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#000000', padding: '10px 20px' }}>
      {/* Pill nav */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#111111',
        borderRadius: '100px',
        padding: '10px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/images/eeme-logo.svg"
            alt="eeMe"
            style={{ height: '30px', width: 'auto' }}
          />
        </Link>

        {/* Desktop centre links */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '36px' }}>
          <Link href="/about-eeme" style={navLinkStyle}>About Emee</Link>

          {/* Talents dropdown */}
          <div ref={talentsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setTalentsOpen(v => !v)}
              style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Talents
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                style={{ transition: 'transform 0.2s', transform: talentsOpen ? 'rotate(180deg)' : 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {talentsOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '14px',
                padding: '8px 0',
                minWidth: '160px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}>
                <Link
                  href="/talent"
                  onClick={() => setTalentsOpen(false)}
                  style={{ display: 'block', padding: '10px 20px', color: '#fff', fontSize: '0.875rem', transition: 'color 0.15s' }}
                >
                  All Talents
                </Link>
              </div>
            )}
          </div>

          <Link href="/#pricing" style={navLinkStyle}>Pricing</Link>
          <Link href="/about-eeme" style={navLinkStyle}>Contact</Link>
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Language */}
          <button
            onClick={toggleLang}
            className="hidden md:block"
            style={{ ...navLinkStyle, color: '#9ca3af', fontSize: '0.8rem' }}
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          {/* Sign Up */}
          <Link
            href="/on-boarding"
            className="hidden md:inline-block"
            style={{
              backgroundColor: '#00e5c3',
              color: '#000000',
              fontWeight: 700,
              padding: '8px 26px',
              borderRadius: '100px',
              fontSize: '0.875rem',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Sign Up
          </Link>

          {/* Search */}
          <button className="hidden md:flex" style={{ ...navLinkStyle, color: '#fff' }} aria-label="Search">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(v => !v)}
            style={{ ...navLinkStyle, color: '#fff' }}
            aria-label="Menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          maxWidth: '1400px',
          margin: '8px auto 0',
          backgroundColor: '#111111',
          borderRadius: '20px',
          padding: '8px 0',
          border: '1px solid #1f1f1f',
        }}>
          {[
            { href: '/talent', label: 'All Talents' },
            { href: '/about-eeme', label: 'About Emee' },
            { href: '/#pricing', label: 'Pricing' },
            { href: '/about-eeme', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link
              key={href + label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '14px 24px',
                color: '#ffffff',
                fontSize: '0.95rem',
                borderBottom: '1px solid #1a1a1a',
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link
              href="/on-boarding"
              onClick={() => setMenuOpen(false)}
              style={{
                flex: 1,
                textAlign: 'center',
                backgroundColor: '#00e5c3',
                color: '#000',
                fontWeight: 700,
                padding: '12px',
                borderRadius: '100px',
                fontSize: '0.9rem',
              }}
            >
              Sign Up
            </Link>
            <button onClick={toggleLang} style={{ color: '#9ca3af', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
