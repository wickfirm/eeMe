'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { HomeData, Talent, TalentArticle, Category } from '@/lib/types'
import { STORAGE_URL } from '@/lib/types'

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
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2 }}>
            {name}
          </p>
          {catName && (
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', margin: '4px 0 0' }}>
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
      {img && (
        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', height: '280px' }}>
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
        </div>
      )}
      {article.talent && (
        <p style={{ color: '#00e5c3', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          {article.talent.name}
        </p>
      )}
      <h3 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '14px' }}>
        {truncate(title, 100)}
      </h3>
      {body && (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '18px' }}>
          {truncate(body, 220)}
        </p>
      )}
      <span style={{ color: '#ffffff', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
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
      {img && (
        <div style={{ flexShrink: 0, width: '96px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.35, marginBottom: '10px' }}>
          {truncate(title, 80)}
        </h4>
        <span style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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
      {img && (
        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', height: '200px' }}>
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
        </div>
      )}
      {article.talent && (
        <p style={{ color: '#00e5c3', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          {article.talent.name}
        </p>
      )}
      <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px' }}>
        {truncate(title, 80)}
      </h4>
      {body && (
        <p style={{ color: '#9ca3af', fontSize: '0.8rem', lineHeight: 1.55, marginBottom: '14px' }}>
          {truncate(body, 130)}
        </p>
      )}
      <span style={{ color: '#ffffff', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
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
        padding: '60px 24px 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          maxWidth: '900px',
          marginBottom: '28px',
        }}>
          WHERE YOUR DIGITAL STORY BEGINS
        </h1>

        <p style={{
          color: '#d1d5db',
          fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
          lineHeight: 1.7,
          maxWidth: '680px',
          marginBottom: '56px',
        }}>
          eeMe offers a dynamic platform for creating and managing your digital profile.
          Take control of your online presence, showcase your identity, connect with others,
          and access essential tools to elevate your personal brand.
        </p>

        {/* Hero video */}
        <div style={{
          width: '100%',
          maxWidth: '960px',
          borderRadius: '24px',
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
            style={{ width: '100%', display: 'block', maxHeight: '520px', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* ── 2. ONE CLICK AT A TIME ──────────────────────────────────── */}
      {talents.length > 0 && (
        <section style={{ backgroundColor: '#000000', padding: '96px 24px 80px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            <h2 style={{
              textAlign: 'center',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '48px',
              letterSpacing: '-0.01em',
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
                      border: `2px solid ${activeCategory === cat ? '#00e5c3' : '#2a2a2a'}`,
                      backgroundColor: 'transparent',
                      color: activeCategory === cat ? '#00e5c3' : '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 500,
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
                  backgroundColor: '#00e5c3',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
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
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '48px',
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
              { name: 'LIVENOW', color: '#ffffff' },
              { name: 'Partner', color: '#333' },
              { name: 'Partner', color: '#333' },
              { name: 'Partner', color: '#333' },
            ].map((partner, i) => (
              <div key={i} style={{
                width: '180px',
                height: '80px',
                borderRadius: '14px',
                backgroundColor: '#0d0d0d',
                border: `1px solid ${partner.color !== '#333' ? '#2a2a2a' : '#1a1a1a'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: partner.color, fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
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
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#ffffff',
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
                border: '1px solid #1f1f1f',
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
                  border: '1px solid #2a2a2a',
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '24px',
                  alignSelf: 'flex-start',
                }}>
                  {plan.label}
                </span>

                {/* Price */}
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff' }}>{plan.price}</span>
                  <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 600 }}>{plan.priceUnit}</span>
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{
                      color: '#d1d5db',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      padding: '6px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}>
                      <span style={{ color: '#00e5c3', flexShrink: 0, marginTop: '3px' }}>•</span>
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
                backgroundColor: '#00e5c3',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.95rem',
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
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '24px',
            }}>
              eeMe Subdivison
            </h2>
            <p style={{
              color: '#9ca3af',
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
                backgroundColor: '#00e5c3',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              See More
            </Link>
          </div>

          {/* Right: bubble diagram */}
          <div style={{ flex: '1 1 350px', position: 'relative', height: '380px' }}>
            {[
              { label: 'eeMe\nINNOVATION', size: 180, x: '35%', y: '25%', bg: 'radial-gradient(circle, #5a1ab0 0%, #3a0a90 60%, #200860 100%)', fontSize: '1rem', bold: true },
              { label: 'eeMe\nORIGINAL', size: 110, x: '70%', y: '5%', bg: 'radial-gradient(circle, #1a9a8a 0%, #0d6060 100%)', fontSize: '0.7rem', bold: false },
              { label: 'eeMe\nLOVE TALENT', size: 100, x: '72%', y: '45%', bg: 'radial-gradient(circle, #4a15a0 0%, #2d0a70 100%)', fontSize: '0.65rem', bold: false },
              { label: 'eeMe\nRAW TALENT', size: 100, x: '10%', y: '10%', bg: 'radial-gradient(circle, #0a8a7a 0%, #055050 100%)', fontSize: '0.65rem', bold: false },
              { label: 'eeMe\nCARES', size: 90, x: '72%', y: '75%', bg: 'radial-gradient(circle, #0a9080 0%, #056060 100%)', fontSize: '0.65rem', bold: false },
            ].map((bubble, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: bubble.x,
                top: bubble.y,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                borderRadius: '50%',
                background: bubble.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transform: 'translate(-50%, -50%)',
              }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: bubble.fontSize,
                  fontWeight: bubble.bold ? 900 : 700,
                  lineHeight: 1.3,
                  padding: '8px',
                  whiteSpace: 'pre-line',
                }}>
                  {bubble.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. HOT STAR NEWS ────────────────────────────────────────── */}
      {articles.length > 0 && (
        <section style={{ backgroundColor: '#000000', padding: '96px 24px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '48px',
              letterSpacing: '-0.01em',
            }}>
              HOT STAR NEWS
            </h2>

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
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
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

            {/* See More */}
            <div style={{ textAlign: 'center' }}>
              <Link
                href="/talent"
                style={{
                  display: 'inline-block',
                  padding: '14px 56px',
                  borderRadius: '100px',
                  backgroundColor: '#00e5c3',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                See More
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. FOSTERING CONNECTIONS CTA ────────────────────────────── */}
      <section style={{
        padding: '120px 24px',
        background: 'linear-gradient(135deg, #4a1280 0%, #2d1a70 25%, #0d3a60 60%, #00796b 85%, #00e5c3 100%)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Dot pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: 900,
            color: '#ffffff',
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
