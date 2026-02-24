'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { Talent } from '@/lib/types'
import { STORAGE_URL, SOCIAL_IDS, ORDER_TYPES } from '@/lib/types'

function formatCount(n?: number): string {
  if (!n) return '–'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K`
  return n.toLocaleString()
}

const ORDER_LABELS: Record<number, { en: string; ar: string; descEn: string; descAr: string }> = {
  [ORDER_TYPES.VIDEO]: {
    en: 'Personal Video',
    ar: 'فيديو شخصي',
    descEn: 'A personalised shoutout just for you',
    descAr: 'فيديو شخصي مخصص لك',
  },
  [ORDER_TYPES.BUSINESS]: {
    en: 'Business Promo',
    ar: 'إعلان تجاري',
    descEn: 'Promote your brand or business',
    descAr: 'روّج لعلامتك التجارية',
  },
  [ORDER_TYPES.CAMPAIGN]: {
    en: 'Campaign',
    ar: 'حملة تسويقية',
    descEn: 'Full ambassador campaign',
    descAr: 'حملة سفير كاملة',
  },
}

export default function TalentProfileClient({ talent }: { talent: Talent }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const name = lang === 'ar' && talent.name_ar ? talent.name_ar : talent.name
  const bio =
    lang === 'ar' && talent.description_ar ? talent.description_ar : talent.description || ''
  const coverUrl = talent.cover_image ? `${STORAGE_URL}/${talent.cover_image}` : null
  const avatarUrl = talent.image
    ? `${STORAGE_URL}/${talent.image}`
    : '/assets/images/placeholder.png'

  const socialStats = [
    { id: SOCIAL_IDS.INSTAGRAM, label: 'Instagram', color: '#E1306C' },
    { id: SOCIAL_IDS.TIKTOK, label: 'TikTok', color: '#69C9D0' },
    { id: SOCIAL_IDS.YOUTUBE, label: 'YouTube', color: '#FF4444' },
  ]
    .map((s) => ({
      ...s,
      data: talent.social?.find((ts) => ts.social_media_id === s.id),
    }))
    .filter((s) => s.data && s.data.followers)

  const youtubePlatform = talent.platforms?.find((p) => p.embed_id)

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Cover Banner */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '300px', backgroundColor: 'var(--color-bg-card)' }}
      >
        {coverUrl && (
          <img src={coverUrl} alt={name} className="w-full h-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(33,31,32,0.2) 30%, rgba(33,31,32,1) 100%)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 mb-8 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl}
              alt={name}
              className="w-32 h-32 rounded-full object-cover border-4"
              style={{ borderColor: 'var(--color-bg)' }}
            />
            {talent.is_available && (
              <span
                className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: '#22c55e', borderColor: 'var(--color-bg)' }}
              />
            )}
          </div>

          {/* Name + info */}
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-3xl font-black" style={{ color: 'var(--color-text)' }}>
                {name}
              </h1>
              {talent.is_verified && (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-label="Verified">
                  <circle cx="11" cy="11" r="11" fill="#3bbab1" />
                  <path
                    d="M6 11.5l3.5 3.5 6-7"
                    stroke="#fff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {talent.is_available && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(34,197,94,0.12)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  {t('Available', 'Available')}
                </span>
              )}
            </div>

            {talent.categories && talent.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {talent.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="text-xs px-3 py-1 rounded-full font-medium hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {lang === 'ar' && cat.name_ar ? cat.name_ar : cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Social Stats bar */}
        {socialStats.length > 0 && (
          <div
            className="flex flex-wrap gap-8 mb-10 py-5 px-6 rounded-xl"
            style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
          >
            {socialStats.map(({ label, color, data }) => (
              <div key={label} className="flex flex-col">
                <span
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color }}
                >
                  {label}
                </span>
                <span className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>
                  {formatCount(data?.followers)}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {t('followers', 'followers')}
                </span>
                {data?.engagement_rate != null && (
                  <span className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {data.engagement_rate.toFixed(1)}% {t('eng.', 'eng.')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">

          {/* LEFT: Bio + YouTube + Platforms */}
          <div className="lg:col-span-2 space-y-8">

            {bio && (
              <section>
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('About', 'About')}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {bio}
                </p>
              </section>
            )}

            {youtubePlatform?.embed_id && (
              <section>
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('Featured Video', 'Featured Video')}
                </h2>
                <div
                  className="rounded-xl overflow-hidden aspect-video"
                  style={{ backgroundColor: '#000' }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubePlatform.embed_id}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${name} – Featured Video`}
                  />
                </div>
              </section>
            )}

            {talent.platforms && talent.platforms.length > 0 && (
              <section>
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('Follow On', 'Follow On')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {talent.platforms.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: 'var(--color-bg-card)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {p.platform?.name || 'Link'}
                      <svg
                        className="w-3 h-3 opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT: Booking panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <h2 className="text-xl font-black" style={{ color: 'var(--color-text)' }}>
                {t('Book Me', 'Book Me')}
              </h2>

              {talent.prices && talent.prices.length > 0 ? (
                talent.prices.map((price) => {
                  const lbl = ORDER_LABELS[price.type]
                  return (
                    <div
                      key={price.id}
                      className="rounded-xl p-5"
                      style={{
                        backgroundColor: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-0.5"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {lang === 'ar' ? lbl?.ar : lbl?.en}
                      </p>
                      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? lbl?.descAr : lbl?.descEn}
                      </p>
                      <div className="flex items-end justify-between mb-4">
                        <span
                          className="text-3xl font-black"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {price.currency} {price.price.toLocaleString()}
                        </span>
                        {price.delivery_days && (
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {price.delivery_days}d {t('delivery', 'delivery')}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/talent/${talent.slug}/book?type=${price.type}`}
                        className="flex items-center justify-center w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                      >
                        {t('Book Now', 'Book Now')} →
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div
                  className="rounded-xl p-6 text-center"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {t('Contact for pricing', 'Contact for pricing')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
