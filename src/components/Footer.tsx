'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubscribed(true)
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer style={{ backgroundColor: '#000000', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 32px 32px' }}>

        {/* Top section: logo/links left, subscribe right */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', justifyContent: 'space-between', marginBottom: '48px' }}>

          {/* Left column */}
          <div style={{ flex: '1 1 400px', minWidth: 0 }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'inline-block', marginBottom: '32px' }}>
              <img src="/assets/images/eeme-logo.svg" alt="eeMe" style={{ height: '36px', width: 'auto' }} />
            </Link>

            {/* Nav links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
              {[
                { href: '/about-eeme', label: 'About eeMe' },
                { href: '/talent', label: 'Talents' },
                { href: '/on-boarding', label: 'Onboarding' },
                { href: '/about-eeme', label: 'Contact' },
              ].map(({ href, label }) => (
                <Link key={href + label} href={href} style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 500 }}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Payment logos */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: 600, marginRight: '4px' }}>Payment</span>
              {[
                { label: 'VISA', width: 52 },
                { label: 'Mastercard', width: 72 },
                { label: 'Verified by Visa', width: 88 },
                { label: 'MC SecureCode', width: 88 },
                { label: '\\WU', width: 52 },
              ].map(({ label, width }) => (
                <div key={label} style={{
                  backgroundColor: '#0d0d0d',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  width: `${width}px`,
                  textAlign: 'center',
                  color: '#cccccc',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Subscribe */}
          <div style={{ flex: '0 0 340px', minWidth: '280px' }}>
            <p style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
              Subscribe
            </p>

            {subscribed ? (
              <p style={{ color: '#00e5c3', fontSize: '0.9rem' }}>Thank you for subscribing!</p>
            ) : (
              <>
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      flex: '1 1 180px',
                      padding: '12px 20px',
                      borderRadius: '100px',
                      backgroundColor: '#0d0d0d',
                      border: '1px solid #2a2a2a',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '100px',
                      backgroundColor: '#00e5c3',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: loading ? 'default' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {loading ? '...' : 'Subscribe'}
                  </button>
                </form>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '12px', lineHeight: 1.5 }}>
                  By subscribing you agree to with our{' '}
                  <Link href="/privacy-policy" style={{ color: '#9ca3af', textDecoration: 'underline' }}>
                    Privacy Policy
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            {/* Copyright */}
            <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} Relume. All rights reserved.
            </p>

            {/* Legal links + socials */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
              <Link href="/privacy-policy" style={{ color: '#6b7280', fontSize: '0.8rem' }}>Privacy Policy</Link>
              <Link href="/terms-of-service" style={{ color: '#6b7280', fontSize: '0.8rem' }}>Terms of Service</Link>
              <span style={{ color: '#6b7280', fontSize: '0.8rem', cursor: 'pointer' }}>Cookies Settings</span>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {/* Facebook */}
                <SocialIcon href="https://facebook.com">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </SocialIcon>
                {/* Instagram */}
                <SocialIcon href="https://instagram.com">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </SocialIcon>
                {/* X / Twitter */}
                <SocialIcon href="https://x.com">
                  <path d="M4 4l16 16M20 4L4 20" />
                </SocialIcon>
                {/* LinkedIn */}
                <SocialIcon href="https://linkedin.com">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </SocialIcon>
                {/* YouTube */}
                <SocialIcon href="https://youtube.com">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}>
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {children}
      </svg>
    </a>
  )
}
