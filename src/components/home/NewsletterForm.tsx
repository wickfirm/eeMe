'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

export default function NewsletterForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await axios.post('/api/subscribe', { email })
      setSubscribed(true)
    } catch {
      setError(t('Something went wrong. Please try again.', 'Something went wrong. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        <p className="font-semibold">{t('Thank you for subscribing!', 'Thank you for subscribing!')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('Your email address', 'Your email address')}
        required
        className="w-full px-4 py-3 rounded-lg text-sm outline-none"
        style={{
          backgroundColor: '#fff',
          color: '#111',
          border: '1px solid var(--color-border)',
        }}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? '...' : t('CONTINUE', 'CONTINUE')}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-start gap-2">
        <input type="checkbox" id="newsletter-agree" className="mt-0.5" />
        <label htmlFor="newsletter-agree" className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {t('Keep me in the loop with all eeMe updates.', 'Keep me in the loop with all eeMe updates.')}
        </label>
      </div>

      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {t('By sharing your email, you agree to our', 'By sharing your email, you agree to our')}{' '}
        <a href="/terms-of-service" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
          {t('Terms of Service', 'Terms of Service')}
        </a>{' '}
        {t('and', 'and')}{' '}
        <a href="/privacy-policy" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
          {t('Privacy Policy', 'Privacy Policy')}
        </a>
      </p>
    </form>
  )
}
