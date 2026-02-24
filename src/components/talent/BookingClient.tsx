'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import type { Talent, Occasion, TalentPrice } from '@/lib/types'
import { STORAGE_URL, ORDER_TYPES } from '@/lib/types'

interface Props {
  talent: Talent
  occasions: Occasion[]
  orderType: number
}

const ORDER_LABELS: Record<number, { en: string; ar: string }> = {
  [ORDER_TYPES.VIDEO]: { en: 'Personal Video', ar: 'فيديو شخصي' },
  [ORDER_TYPES.BUSINESS]: { en: 'Business Promo', ar: 'إعلان تجاري' },
  [ORDER_TYPES.CAMPAIGN]: { en: 'Campaign', ar: 'حملة تسويقية' },
}

export default function BookingClient({ talent, occasions, orderType }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const name = lang === 'ar' && talent.name_ar ? talent.name_ar : talent.name
  const avatarUrl = talent.image
    ? `${STORAGE_URL}/${talent.image}`
    : '/assets/images/placeholder.png'

  const price: TalentPrice | undefined = talent.prices?.find((p) => p.type === orderType)
  const orderLabel = ORDER_LABELS[orderType]

  const [isForSelf, setIsForSelf] = useState(true)
  const [senderName, setSenderName] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [occasionId, setOccasionId] = useState('')
  const [message, setMessage] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [showPromo, setShowPromo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderName.trim()) {
      setError(t('Please enter your name', 'Please enter your name'))
      return
    }
    if (!isForSelf && !recipientName.trim()) {
      setError(t('Please enter the recipient name', 'Please enter the recipient name'))
      return
    }
    if (!message.trim()) {
      setError(t('Please write a message for the talent', 'Please write a message for the talent'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await axios.post('/api/book', {
        talent_id: talent.id,
        talent_slug: talent.slug,
        order_type: orderType,
        sender_name: senderName,
        recipient_name: isForSelf ? senderName : recipientName,
        occasion_id: occasionId || null,
        message,
        promo_code: promoCode || null,
      })

      if (res.data?.payment_url) {
        window.location.href = res.data.payment_url
      } else if (res.data?.redirect_url) {
        window.location.href = res.data.redirect_url
      } else {
        window.location.href = `/payment/success?order=${res.data?.code || ''}`
      }
    } catch {
      setError(
        t('Something went wrong. Please try again.', 'Something went wrong. Please try again.')
      )
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Back link */}
        <Link
          href={`/talent/${talent.slug}`}
          className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-80 transition-opacity"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← {t('Back to profile', 'Back to profile')}
        </Link>

        {/* Talent summary */}
        <div
          className="flex items-center gap-4 p-4 rounded-xl mb-8"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          <img
            src={avatarUrl}
            alt={name}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate" style={{ color: 'var(--color-text)' }}>
              {name}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
              {lang === 'ar' ? orderLabel?.ar : orderLabel?.en}
            </p>
          </div>
          {price && (
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>
                {price.currency} {price.price.toLocaleString()}
              </p>
              {price.delivery_days && (
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {price.delivery_days}d {t('delivery', 'delivery')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* For whom toggle */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
              {t('Who is this for?', 'Who is this for?')}
            </p>
            <div className="flex gap-3">
              {[
                { val: true, labelEn: 'Myself', labelAr: 'لي شخصياً' },
                { val: false, labelEn: 'Someone else', labelAr: 'لشخص آخر' },
              ].map(({ val, labelEn, labelAr }) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setIsForSelf(val)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: isForSelf === val ? 'var(--color-primary)' : 'var(--color-bg-card)',
                    color: isForSelf === val ? '#fff' : 'var(--color-text)',
                    border: `1px solid ${isForSelf === val ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  }}
                >
                  {lang === 'ar' ? labelAr : labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Your name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
              {t('Your name', 'Your name')} *
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder={t('Enter your name', 'Enter your name') as string}
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            />
          </div>

          {/* Recipient name (if for someone else) */}
          {!isForSelf && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
                {t('Recipient name', 'Recipient name')} *
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t('Enter their name', 'Enter their name') as string}
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              />
            </div>
          )}

          {/* Occasion */}
          {occasions.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
                {t('Occasion', 'Occasion')}
              </label>
              <select
                value={occasionId}
                onChange={(e) => setOccasionId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none appearance-none"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  color: occasionId ? 'var(--color-text)' : 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <option value="">{t('Select an occasion (optional)', 'Select an occasion (optional)')}</option>
                {occasions.map((occ) => (
                  <option key={occ.id} value={occ.id}>
                    {lang === 'ar' && occ.name_ar ? occ.name_ar : occ.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
              {t('Your message to', 'Your message to')} {name} *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('Tell the talent what you want them to say or do...', 'Tell the talent what you want them to say or do...') as string}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            />
            <p className="text-xs mt-1 text-right" style={{ color: 'var(--color-text-muted)' }}>
              {message.length} {t('characters', 'characters')}
            </p>
          </div>

          {/* Promo code toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowPromo(!showPromo)}
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              {showPromo ? '−' : '+'} {t('Have a promo code?', 'Have a promo code?')}
            </button>
            {showPromo && (
              <div className="mt-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={t('Enter promo code', 'Enter promo code') as string}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none uppercase"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    letterSpacing: '0.1em',
                  }}
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '...' : `${t('Continue to Payment', 'Continue to Payment')} →`}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
            {t('By booking, you agree to our', 'By booking, you agree to our')}{' '}
            <Link href="/terms-of-service" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
              {t('Terms of Service', 'Terms of Service')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
