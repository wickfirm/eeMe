'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import NewsletterForm from '@/components/home/NewsletterForm'
import type { HomeData, Talent, TalentArticle } from '@/lib/types'
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
  return str.substring(0, len) + '...'
}

function articleHref(article: TalentArticle): string {
  if (!article.talent?.slug) return '#'
  return `/talent/${article.talent.slug}/${article.slug}`
}

// ─── Article sub-components ───────────────────────────────────────────────────

function AsideArticle({ article }: { article: TalentArticle }) {
  const { i18n } = useTranslation()
  const lang  = i18n.language
  const title = lang === 'ar' && article.title_ar ? article.title_ar : article.title
  const body  = article.body ? stripHtml(article.body) : ''
  const href  = articleHref(article)
  const img   = imgUrl(article.image)

  return (
    <div className="mb-5">
      <Link href={href} className="group block rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        {img && (
          <div className="overflow-hidden" style={{ height: '160px' }}>
            <img src={img} alt={title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </div>
        )}
        <div className="p-3">
          {article.talent && (
            <p className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: 'var(--color-primary)' }}>
              {article.talent.name}
            </p>
          )}
          <p className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--color-text)' }}>
            {truncate(title, 70)}
          </p>
          {body && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {truncate(body, 160)}
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}

function HorizontalArticle({ article }: { article: TalentArticle }) {
  const { i18n } = useTranslation()
  const lang  = i18n.language
  const title = lang === 'ar' && article.title_ar ? article.title_ar : article.title
  const body  = article.body ? stripHtml(article.body) : ''
  const href  = articleHref(article)
  const img   = imgUrl(article.image)

  return (
    <Link href={href} className="group flex mb-4 rounded-lg overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
      {img && (
        <div className="flex-shrink-0 overflow-hidden" style={{ width: '42%', maxHeight: '190px' }}>
          <img src={img} alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
      )}
      <div className="p-4 flex flex-col justify-center" style={{ flex: 1, minWidth: 0 }}>
        {article.talent && (
          <p className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--color-primary)' }}>
            {article.talent.name}
          </p>
        )}
        <p className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--color-text)' }}>
          {truncate(title, 120)}
        </p>
        {body && (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {truncate(body, 280)}
          </p>
        )}
      </div>
    </Link>
  )
}

function VerticalArticle({ article }: { article: TalentArticle }) {
  const { i18n } = useTranslation()
  const lang  = i18n.language
  const title = lang === 'ar' && article.title_ar ? article.title_ar : article.title
  const body  = article.body ? stripHtml(article.body) : ''
  const href  = articleHref(article)
  const img   = imgUrl(article.image)

  return (
    <Link href={href} className="group block rounded-lg overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
      {img && (
        <div className="overflow-hidden" style={{ height: '130px' }}>
          <img src={img} alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
      )}
      <div className="p-3">
        {article.talent && (
          <p className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: 'var(--color-primary)' }}>
            {article.talent.name}
          </p>
        )}
        <p className="text-sm font-bold leading-snug mb-1" style={{ color: 'var(--color-text)' }}>
          {truncate(title, 60)}
        </p>
        {body && (
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--color-text-muted)' }}>
            {truncate(body, 200)}
          </p>
        )}
      </div>
    </Link>
  )
}

// 6-article block: 2 aside (left) + 1 horizontal + 3 vertical (right)
function ArticleBlock({ articles }: { articles: TalentArticle[] }) {
  if (!articles.length) return null
  const aside      = articles.slice(0, 2)
  const horizontal = articles[2]
  const verticals  = articles.slice(3, 6)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
      <div className="lg:col-span-4">
        {aside.map(a => <AsideArticle key={a.id} article={a} />)}
      </div>
      <div className="lg:col-span-8">
        {horizontal && <HorizontalArticle article={horizontal} />}
        {verticals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {verticals.map(a => <VerticalArticle key={a.id} article={a} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Portrait talent card ─────────────────────────────────────────────────────

function TalentPortraitCard({ talent }: { talent: Talent }) {
  const { i18n } = useTranslation()
  const lang        = i18n.language
  const displayName = lang === 'ar' && talent.name_ar ? talent.name_ar : talent.name
  const image       = imgUrl(talent.image)
  const category    = talent.categories?.[0]
  const catName     = lang === 'ar' && (category as { name_ar?: string })?.name_ar
    ? (category as { name_ar?: string }).name_ar
    : category?.name

  return (
    <Link href={`/talent/${talent.slug}`} className="group block" style={{ minWidth: 0 }}>
      <div className="rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        <div className="overflow-hidden" style={{ height: '200px' }}>
          {image
            ? <img src={image} alt={displayName}
                className="w-full h-full object-cover object-top transition-transform group-hover:scale-105" />
            : <div className="w-full h-full" style={{ backgroundColor: 'var(--color-border)' }} />
          }
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold truncate flex items-center gap-1"
            style={{ color: 'var(--color-text)' }}>
            <span className="truncate">{displayName}</span>
            {talent.is_verified && (
              <span className="flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </p>
          {catName && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
              {catName}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { data: HomeData }

export default function HomeClient({ data }: Props) {
  const { t } = useTranslation()

  const talents:  Talent[]        = data?.talents  ?? []
  const articles: TalentArticle[] = data?.articles ?? []

  const heroVideoUrl    = `${STORAGE_URL}/pages_videos/5-video-20221128142746.mp4`
  const heroVideoPoster = `${STORAGE_URL}/pages_videos/5-video-20221128142746.png`

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Video */}
            <div className="relative rounded-xl overflow-hidden aspect-video"
              style={{ backgroundColor: 'var(--color-bg-card)' }}>
              <video
                src={heroVideoUrl}
                poster={heroVideoPoster}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* CTA */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4"
                style={{ color: 'var(--color-text)' }}>
                {t('digitalHome', 'YOUR DIGITAL HOME')}
              </h1>
              <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {t('homeDescription', 'The tech platform that finally allows you to control and own your content.')}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ────────────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="py-12" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {[0, 6, 12].map(start =>
              articles.slice(start, start + 6).length > 0
                ? <ArticleBlock key={start} articles={articles.slice(start, start + 6)} />
                : null
            )}
          </div>
        </section>
      )}

      {/* ── Purple quote banner ─────────────────────────────── */}
      <section className="py-16 text-center" style={{ backgroundColor: '#7b4f9c' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">
            {t('qoute1', 'Creating a space for you and your audience to connect.')}
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>- EEME -</p>
        </div>
      </section>

      {/* ── Check out these profiles ────────────────────────── */}
      {talents.length > 0 && (
        <section className="py-12" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>
              {t('checkProfile', 'Check out these profiles')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {talents.map(talent => (
                <TalentPortraitCard key={talent.id} talent={talent} />
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link
                href="/talent"
                className="font-bold px-12 py-3 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)', color: '#0a0a0a' }}
              >
                {t('seeMore', 'See More')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Ready to connect? CTA ───────────────────────────── */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-6" style={{ color: '#0a0a0a' }}>
            {t('readyConnect', 'Ready to connect?')}
          </h2>
          <Link
            href="/talent"
            className="inline-block font-bold px-10 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#0a0a0a', color: 'var(--color-primary)' }}
          >
            {t('browseProfiles', 'Browse Profiles')}
          </Link>
        </div>
      </section>

    </div>
  )
}
