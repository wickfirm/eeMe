'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import TalentCard from '@/components/talent/TalentCard'
import NewsletterForm from '@/components/home/NewsletterForm'
import type { HomeData, Talent, TalentArticle } from '@/lib/types'
import { STORAGE_URL } from '@/lib/types'

interface Props {
  data: HomeData
}

export default function HomeClient({ data }: Props) {
  const { t } = useTranslation()

  const talents: Talent[] = data?.talents ?? []
  const articles: TalentArticle[] = data?.articles ?? []
  const page = data?.page ?? null
  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Hero placeholder */}
          <div className="relative rounded-xl overflow-hidden aspect-video" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner" />
            </div>
          </div>

          {/* Hero CTA */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--color-text)' }}>
              {page?.title || t('YOUR DIGITAL HOME', 'YOUR DIGITAL HOME')}
            </h1>
            <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {page?.body || t('hero_description', 'The tech platform that finally allows you to control and own your content.')}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Featured Talents */}
      {talents.length > 0 && (
        <section className="py-12" style={{ backgroundColor: 'var(--color-bg-card)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {t('Featured Talents', 'Featured Talents')}
              </h2>
              <Link href="/talent" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                {t('View all', 'View all')} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {talents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles / News */}
      {articles.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              {t('Latest News', 'Latest News')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 6).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {talents.length === 0 && articles.length === 0 && (
        <div className="flex justify-center py-24">
          <div className="spinner" />
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article }: { article: TalentArticle }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const title = lang === 'ar' && article.title_ar ? article.title_ar : article.title
  const talentSlug = article.talent?.slug

  return (
    <Link
      href={talentSlug ? `/talent/${talentSlug}/${article.slug}` : '#'}
      className="group block rounded-xl overflow-hidden transition-transform hover:-translate-y-1"
      style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
    >
      {article.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={`${STORAGE_URL}/${article.image}`}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        {article.talent && (
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-primary)' }}>
            {article.talent.name}
          </p>
        )}
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug" style={{ color: 'var(--color-text)' }}>
          {title}
        </h3>
      </div>
    </Link>
  )
}
