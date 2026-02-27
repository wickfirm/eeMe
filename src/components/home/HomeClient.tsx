'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { HomeData, Talent, TalentArticle, Category } from '@/lib/types'
import { STORAGE_URL } from '@/lib/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const CTA_GRADIENT = 'linear-gradient(90deg, #09ffb5 0%, #09fff5 42%, #6995ff 79.5%, #8728ff 100%)'

// ─── Orbital Bubble Diagram ───────────────────────────────────────────────────

function OrbitalDiagram() {
  const S = 480        // container px
  const cR = 105       // center circle radius
  const oR = 178       // orbit radius
  const sR = 50        // satellite radius

  const sats = [
    { label: 'ORIGINAL',    angle: 335 },
    { label: 'LOVE\nTALENT', angle: 42  },
    { label: 'RAW\nTALENT',  angle: 215 },
    { label: 'CARES',        angle: 90  },
  ]

  return (
    <div style={{
      position: 'relative',
      width: `${S}px`,
      height: `${S}px`,
      flexShrink: 0,
      maxWidth: '100%',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 52% 50%, rgba(0,200,160,0.12) 0%, transparent 65%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Orbit ring */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${oR * 2}px`,
        height: `${oR * 2}px`,
        borderRadius: '50%',
        border: '1px solid rgba(100,220,190,0.22)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Center bubble — eeMe INNOVATION */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${cR * 2}px`,
        height: `${cR * 2}px`,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 33%, #30ead4 0%, #00b8a0 40%, #007060 80%, #003d38 100%)',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 80px rgba(0,210,170,0.45), 0 0 30px rgba(0,210,170,0.2)',
        zIndex: 2,
      }}>
        <span style={{ color: 'rgba(221,231,255,0.75)', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 400, letterSpacing: '0.06em' }}>eeMe</span>
        <span style={{ color: '#dde7ff', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '0.02em' }}>INNOVATION</span>
      </div>

      {/* Satellite bubbles */}
      {sats.map((sat, i) => {
        const rad = (sat.angle * Math.PI) / 180
        const cx = S / 2 + oR * Math.sin(rad)
        const cy = S / 2 - oR * Math.cos(rad)
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${cx}px`,
            top: `${cy}px`,
            width: `${sR * 2}px`,
            height: `${sR * 2}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 33%, #25d4a0 0%, #0d9468 50%, #065040 100%)',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 0 24px rgba(0,180,130,0.3)',
            zIndex: 2,
            padding: '4px',
          }}>
            <span style={{ color: 'rgba(221,231,255,0.65)', fontFamily: 'var(--font-heading)', fontSize: '0.45rem', fontWeight: 400, letterSpacing: '0.08em', lineHeight: 1 }}>eeMe</span>
            <span style={{ color: '#dde7ff', fontFamily: 'var(--font-heading)', fontSize: '0.6rem', fontWeight: 700, lineHeight: 1.25, whiteSpace: 'pre-line' }}>{sat.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function imgUrl(path: string | undefined): string | null {
  if (!path) return null
  return path.startsWith('http') ? path : `${STORAGE_URL}/${path}`
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(str: string, len: number): string {
  if (!str || str.length <= len) return str
  return str.substring(0, len) + '…'
}

function articleHref(article: TalentArticle): string {
  if (!article.talent?.slug) return '#'
  return `/talent/${article.talent.slug}/${article.slug}`
}

// ─── Talent portrait card ─────────────────────────────────────────────────────

function TalentPortraitCard({ talent }: { talent: Talent }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const name = lang === 'ar' && talent.name_ar ? talent.name_ar : talent.name
  const img = imgUrl(talent.image)
  const category = talent.categories?.[0]
  const catName =
    lang === 'ar' && (category as { name_ar?: string })?.name_ar
      ? (category as { name_ar?: string }).name_ar
      : category?.name

  return (
    <Link href={`/talent/${talent.slug}`} className="talent-card" style={{ display: 'block' }}>
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        aspectRatio: '3 / 4',
        backgroundColor: '#111',
      }}>
        {img ? (
          <img
            src={img}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.3s ease' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a0a40 0%, #2d1060 100%)' }} />
        )}
        {/* Purple gradient overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '40px 16px 16px',
          background: 'linear-gradient(to top, rgba(90,20,160,0.96) 0%, rgba(90,20,160,0.75) 45%, transparent 100%)',
        }}>
          <p style={{ color: '#dde7ff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.95rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2 }}>
            {name}
          </p>
          {catName && (
            <p style={{ color: 'rgba(221,231,255,0.75)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', margin: '4px 0 0' }}>
              {catName}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Article components ───────────────────────────────────────────────────────

function FeaturedArticle({ article }: { article: TalentArticle }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const title = lang === 'ar' && article.title_ar ? article.title_ar : article.title
  const body = article.body ? stripHtml(article.body) : ''
  const img = imgUrl(article.image)
  const href = articleHref(article)

  return (
    <Link href={href} className="article-link" style={{ display: 'block' }}>
      <div style={{ borderRadius: '36px', overflow: 'hidden', marginBottom: '20px', height: '280px', backgroundColor: '#292929' }}>
        {img && (
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
        )}
      </div>
      {article.talent && (
        <p style={{ color: '#09ffb5', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          {article.talent.name}
        </p>
      )}
      <h3 style={{ color: '#dde7ff', fontFamily: 'var(--font-ui)', fontSize: '2rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '14px' }}>
        {truncate(title, 100)}
      </h3>
      {body && (
        <p style={{ color: '#9ca3af', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '18px' }}>
          {truncate(body, 220)}
        </p>
      )}
      <span style={{ color: '#dde7ff', fontFamily: 'var(--font-ui)', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 400 }}>
        Read more
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}

function SidebarArticle({ article }: { article: TalentArticle }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const title = lang === 'ar' && article.title_ar ? article.title_ar : article.title
  const img = imgUrl(article.image)
  const href = articleHref(article)

  return (
    <Link href={href} className="article-link" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flexShrink: 0, width: '96px', height: '80px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#292929' }}>
        {img && (
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ color: '#dde7ff', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.35, marginBottom: '10px' }}>
          {truncate(title, 80)}
        </h4>
        <span style={{ color: '#dde7ff', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          Read more
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

function GridArticle({ article }: { article: TalentArticle }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const title = lang === 'ar' && article.title_ar ? article.title_ar : article.title
  const body = article.body ? stripHtml(article.body) : ''
  const img = imgUrl(article.image)
  const href = articleHref(article)

  return (
    <Link href={href} className="article-link" style={{ display: 'block' }}>
      <div style={{ borderRadius: '36px', overflow: 'hidden', marginBottom: '16px', height: '200px', backgroundColor: '#292929' }}>
        {img && (
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
        )}
      </div>
      {article.talent && (
        <p style={{ color: '#09ffb5', fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          {article.talent.name}
        </p>
      )}
      <h4 style={{ color: '#dde7ff', fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px' }}>
        {truncate(title, 80)}
      </h4>
      {body && (
        <p style={{ color: '#9ca3af', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', lineHeight: 1.55, marginBottom: '14px' }}>
          {truncate(body, 130)}
        </p>
      )}
      <span style={{ color: '#dde7ff', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 400 }}>
        Read more
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { data: HomeData }

export default function HomeClient({ data }: Props) {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('Trending')

  const talents: Talent[] = data?.talents ?? []
  const articles: TalentArticle[] = data?.articles ?? []
  const categories: Category[] = data?.categories ?? []

  const heroVideoUrl = `${STORAGE_URL}/pages_videos/5-video-20221128142746.mp4`
  const heroVideoPoster = `${STORAGE_URL}/pages_videos/5-video-20221128142746.png`

  // Article layout slots
  const featuredArticle = articles[0]
  const sidebarArticles = articles.slice(1, 4)
  const gridArticles = articles.slice(4, 10)

  // Category pills — use DB categories + "Trending" prefix
  const categoryPills = ['Trending', ...categories.map(c => c.name)]

  return (
    <div style={{ backgroundColor: '#000000' }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '90vh',
        background: 'radial-gradient(ellipse 90% 70% at 50% 20%, #3a1065 0%, #1e0a50 35%, #000000 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 7vw, 5.0625rem)',
          fontWeight: 600,
          color: '#dde7ff',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          maxWidth: '900px',
          marginBottom: '28px',
          textTransform: 'uppercase',
        }}>
          WHERE YOUR DIGITAL STORY BEGINS
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#dde7ff',
          fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
          lineHeight: 1.75,
          maxWidth: '680px',
          marginBottom: '56px',
          fontWeight: 400,
        }}>
          eeMe offers a dynamic platform for creating and managing your digital profile.
          Take control of your online presence, showcase your identity, connect with others,
          and access essential tools to elevate your personal brand.
        </p>

        {/* Hero video */}
        <div style={{
          width: '100%',
          maxWidth: '1312px',
          borderRadius: '64px',
          overflow: 'hidden',
          backgroundColor: '#1a0a3e',
          boxShadow: '0 40px 80px rgba(90,20,160,0.3)',
        }}>
          <video
            src={heroVideoUrl}
            poster={heroVideoPoster}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', display: 'block', maxHeight: '700px', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* ── 2. ONE CLICK AT A TIME ──────────────────────────────────── */}
      {talents.length > 0 && (
        <section style={{ backgroundColor: '#000000', padding: '96px 24px 80px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              textAlign: 'center',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              fontWeight: 600,
              color: '#dde7ff',
              marginBottom: '48px',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}>
              ONE CLICK AT A TIME
            </h2>

            {/* Category filter pills */}
            {categoryPills.length > 1 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '56px',
              }}>
                {categoryPills.slice(0, 12).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="category-pill"
                    style={{
                      padding: '10px 24px',
                      borderRadius: '100px',
                      border: `2px solid ${activeCategory === cat ? '#09ffb5' : '#484848'}`,
                      backgroundColor: 'transparent',
                      color: activeCategory === cat ? '#09ffb5' : '#dde7ff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Portrait talent cards — 2 rows of 4 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '48px',
            }}>
              {talents.slice(0, 8).map(talent => (
                <TalentPortraitCard key={talent.id} talent={talent} />
              ))}
            </div>

            {/* See More */}
            <div style={{ textAlign: 'center' }}>
              <Link
                href="/talent"
                style={{
                  display: 'inline-block',
                  padding: '14px 56px',
                  borderRadius: '100px',
                  backgroundImage: CTA_GRADIENT,
                  color: '#2c2c2c',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: '18px',
                  transition: 'opacity 0.2s',
                }}
              >
                See More
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. WHERE TALENT MEETS OPPORTUNITY (Partners) ────────────── */}
      <section style={{ backgroundColor: '#000000', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 600,
            color: '#dde7ff',
            marginBottom: '48px',
            textTransform: 'uppercase',
          }}>
            WHERE TALENT MEETS OPPORTUNITY
          </h2>
          {/* Partner logo cards */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {[
              { name: 'MUSIVV', color: '#9b51e0' },
              { name: 'LIVENOW', color: '#dde7ff' },
              { name: 'Partner', color: '#484848' },
              { name: 'Partner', color: '#484848' },
              { name: 'Partner', color: '#484848' },
            ].map((partner, i) => (
              <div key={i} style={{
                width: '347px',
                height: '147px',
                maxWidth: '100%',
                borderRadius: '30px',
                backgroundColor: '#252525',
                border: '1px solid rgba(72,72,72,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: partner.color, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em' }}>
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" style={{ backgroundColor: '#000000', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 600,
            color: '#dde7ff',
            lineHeight: 1.2,
            marginBottom: '64px',
          }}>
            Elevate Your Profile,<br />Affordable Pricing
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                label: "Talent's Media Kit",
                price: 'FREE',
                priceUnit: '',
                icon: '▶',
                features: [
                  'Your own online media kit / website',
                  'About you',
                  'Social Media Portfolio',
                  'Charity Works',
                ],
              },
              {
                label: "Talent's Booking Engine",
                price: '$3.97',
                priceUnit: '/MO',
                icon: '📊',
                features: [
                  "Everything in Talents' Media Kit, plus:",
                  'Booking or e-commerce',
                  'Basic Social Media Analytics',
                ],
              },
              {
                label: "Talent's Insights",
                price: '$5.97',
                priceUnit: '/MO',
                icon: '🔍',
                features: [
                  "Everything In TALENTS' BOOKING ENGINE, Plus:",
                  'Advanced Social Media Analytics',
                ],
              },
            ].map((plan, i) => (
              <div key={i} style={{
                backgroundColor: '#0d0d0d',
                border: '1px solid #484848',
                borderRadius: '24px',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
              }}>
                {/* Icon circle */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#1a0a40',
                  border: '2px solid #2a1a6a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '24px',
                }}>
                  {plan.icon}
                </div>

                {/* Tier pill */}
                <span style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  borderRadius: '100px',
                  backgroundColor: '#111',
                  border: '1px solid #484848',
                  color: '#9ca3af',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '24px',
                  alignSelf: 'flex-start',
                }}>
                  {plan.label}
                </span>

                {/* Price */}
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 700, color: '#dde7ff' }}>{plan.price}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#9ca3af', fontWeight: 600 }}>{plan.priceUnit}</span>
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{
                      color: '#dde7ff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      padding: '6px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}>
                      <span style={{ color: '#09ffb5', flexShrink: 0, marginTop: '3px' }}>•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              href="/on-boarding"
              style={{
                display: 'inline-block',
                padding: '14px 56px',
                borderRadius: '100px',
                backgroundImage: CTA_GRADIENT,
                color: '#2c2c2c',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '18px',
              }}
            >
              See More
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. eeMe SUBDIVISION ─────────────────────────────────────── */}
      <section style={{
        padding: '96px 24px',
        background: 'linear-gradient(180deg, #000000 0%, #1a0845 30%, #0d0530 70%, #000000 100%)',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '64px',
          alignItems: 'center',
        }}>
          {/* Left: text */}
          <div style={{ flex: '1 1 350px', minWidth: 0 }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 600,
              color: '#dde7ff',
              marginBottom: '24px',
              textTransform: 'uppercase',
            }}>
              eeMe Subdivision
            </h2>
            <p style={{
              color: '#9ca3af',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.75,
              marginBottom: '36px',
              maxWidth: '480px',
            }}>
              We are continuously looking for ways to discover innovative new talents
              and encourage fruitful collaborations. Here are some of our innovations:
            </p>
            <Link
              href="/about-eeme"
              style={{
                display: 'inline-block',
                padding: '13px 40px',
                borderRadius: '100px',
                backgroundImage: CTA_GRADIENT,
                color: '#2c2c2c',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '18px',
              }}
            >
              See More
            </Link>
          </div>

          {/* Right: orbital bubble diagram */}
          <div style={{ flex: '1 1 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <OrbitalDiagram />
          </div>
        </div>
      </section>

      {/* ── 6. HOT STAR NEWS ────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#000000', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 5.0625rem)',
            fontWeight: 600,
            color: '#dde7ff',
            marginBottom: '48px',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
          }}>
            HOT STAR NEWS
          </h2>

          {articles.length > 0 ? (
            <>
              {/* Featured + sidebar layout */}
              {(featuredArticle || sidebarArticles.length > 0) && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '32px',
                  marginBottom: '56px',
                }}>
                  {/* Featured */}
                  {featuredArticle && (
                    <div style={{ flex: '1 1 380px', minWidth: 0 }}>
                      <p style={{ color: '#9ca3af', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                        Featured News
                      </p>
                      <FeaturedArticle article={featuredArticle} />
                    </div>
                  )}

                  {/* Sidebar */}
                  {sidebarArticles.length > 0 && (
                    <div style={{ flex: '1 1 280px', minWidth: 0, paddingTop: '44px' }}>
                      {sidebarArticles.map(article => (
                        <SidebarArticle key={article.id} article={article} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Grid articles */}
              {gridArticles.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '32px',
                  marginBottom: '48px',
                }}>
                  {gridArticles.map(article => (
                    <GridArticle key={article.id} article={article} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#484848', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
              Check back soon for the latest news.
            </p>
          )}

          {/* See More */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              href="/talent"
              style={{
                display: 'inline-block',
                padding: '14px 56px',
                borderRadius: '100px',
                backgroundImage: CTA_GRADIENT,
                color: '#2c2c2c',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '18px',
              }}
            >
              See More
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. FOSTERING CONNECTIONS CTA ────────────────────────────── */}
      <section style={{
        padding: '120px 24px',
        backgroundColor: '#252525',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Dot pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(221,231,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: 600,
            color: '#dde7ff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}>
            FOSTERING CONNECTIONS<br />BETWEEN YOU &amp; YOUR<br />AUDIENCE
          </h2>
        </div>
      </section>

    </div>
  )
}
