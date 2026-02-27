'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

// Gradient from Figma: #09FFB5 → #09FFF5 → #6995FF → #8728FF
const CTA_GRADIENT = 'linear-gradient(90deg, #09ffb5 0%, #09fff5 42%, #6995ff 79.5%, #8728ff 100%)'

export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [talentsOpen, setTalentsOpen] = useState(false)
  const [lang, setLang] = useState('en')
  const talentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLang(i18next.language)
  }, [])

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

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '32px',
    color: '#dde7ff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    letterSpacing: 0,
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'transparent',
      padding: '16px 64px',
    }}>
      {/* Pill nav — exact Figma: backdrop-blur, border rgba(65,65,65,0.94), inset teal glow */}
      <div style={{
        maxWidth: '1472px',
        margin: '0 auto',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        padding: '0 32px',
        borderRadius: '100px',
        backgroundColor: 'rgba(0,0,0,0.36)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(65,65,65,0.94)',
        boxShadow: 'inset 0px 4px 3px 0px rgba(59,186,177,0.21)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/images/eeme-logo.svg"
            alt="eeMe"
            style={{ height: '35px', width: 'auto' }}
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '32px', flex: 1, justifyContent: 'flex-end' }}>
          <Link href="/about-eeme" style={linkStyle}>About Emee</Link>

          {/* Talents dropdown */}
          <div ref={talentsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setTalentsOpen(v => !v)}
              style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Talents
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#dde7ff" strokeWidth={2}
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
                backgroundColor: '#111',
                border: '1px solid rgba(65,65,65,0.94)',
                borderRadius: '14px',
                padding: '8px 0',
                minWidth: '160px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)',
              }}>
                <Link
                  href="/talent"
                  onClick={() => setTalentsOpen(false)}
                  style={{ display: 'block', padding: '10px 20px', color: '#dde7ff', fontFamily: 'var(--font-body)', fontSize: '16px' }}
                >
                  All Talents
                </Link>
              </div>
            )}
          </div>

          <Link href="/#pricing" style={linkStyle}>Pricing</Link>
          <Link href="/about-eeme" style={linkStyle}>Contact</Link>
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
          {/* Language */}
          <button
            onClick={toggleLang}
            className="hidden md:block"
            style={{ ...linkStyle, fontSize: '14px', color: '#9ca3af' }}
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          {/* Sign Up — Figma gradient button */}
          <Link
            href="/on-boarding"
            className="hidden md:flex"
            style={{
              height: '40px',
              padding: '8px 33px',
              borderRadius: '100px',
              backgroundImage: CTA_GRADIENT,
              color: '#2c2c2c',
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: '32px',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Sign Up
          </Link>

          {/* Search */}
          <button className="hidden md:flex" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dde7ff', display: 'flex', alignItems: 'center' }} aria-label="Search">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dde7ff' }}
            aria-label="Menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          maxWidth: '1472px',
          margin: '8px auto 0',
          backgroundColor: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '8px 0',
          border: '1px solid rgba(65,65,65,0.94)',
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
              style={{ display: 'block', padding: '14px 24px', color: '#dde7ff', fontFamily: 'var(--font-body)', fontSize: '16px', borderBottom: '1px solid rgba(65,65,65,0.4)' }}
            >
              {label}
            </Link>
          ))}
          <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link
              href="/on-boarding"
              onClick={() => setMenuOpen(false)}
              style={{ flex: 1, textAlign: 'center', backgroundImage: CTA_GRADIENT, color: '#2c2c2c', fontWeight: 700, padding: '12px', borderRadius: '100px', fontFamily: 'var(--font-body)', fontSize: '16px' }}
            >
              Sign Up
            </Link>
            <button onClick={toggleLang} style={{ color: '#9ca3af', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
