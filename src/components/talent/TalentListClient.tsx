'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import TalentCard from '@/components/talent/TalentCard'
import type { Talent, Category } from '@/lib/types'

interface Props {
  talents: Talent[]
  categories: Category[]
  currentPage: number
  totalPages: number
  totalCount: number
  activeCategory?: Category | null
}

export default function TalentListClient({
  talents,
  categories,
  currentPage,
  totalPages,
  totalCount,
  activeCategory,
}: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return talents
    const q = search.toLowerCase()
    return talents.filter(
      (tal) =>
        tal.name.toLowerCase().includes(q) ||
        (tal.name_ar || '').includes(q) ||
        tal.categories?.some((c) => c.name.toLowerCase().includes(q))
    )
  }, [talents, search])

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-text)' }}>
            {activeCategory
              ? (lang === 'ar' && activeCategory.name_ar ? activeCategory.name_ar : activeCategory.name)
              : t('All Talents', 'All Talents')}
          </h1>
          {totalCount > 0 && (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {totalCount} {t('talents available', 'talents available')}
            </p>
          )}
        </div>

        {/* Search bar */}
        <div className="mb-6 max-w-md">
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              style={{ color: 'var(--color-text-muted)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search talents...', 'Search talents...') as string}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--color-text)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ color: 'var(--color-text-muted)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/talent"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                backgroundColor: !activeCategory ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: !activeCategory ? '#fff' : 'var(--color-text)',
                border: `1px solid ${!activeCategory ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              {t('All', 'All')}
            </Link>
            {categories.map((cat) => {
              const isActive = activeCategory?.id === cat.id
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-card)',
                    color: isActive ? '#fff' : 'var(--color-text)',
                    border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  }}
                >
                  {lang === 'ar' && cat.name_ar ? cat.name_ar : cat.name}
                  {cat.talents_count != null && (
                    <span className="ml-1 opacity-50">({cat.talents_count})</span>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* Talent grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-8">
            {filtered.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {talents.length === 0 ? (
              <div className="spinner" />
            ) : (
              <>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  {t('No results found', 'No results found')}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {t('Try a different search', 'Try a different search')}
                </p>
              </>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !search && (
          <div className="flex items-center justify-center gap-3 mt-12">
            {currentPage > 1 && (
              <Link
                href={`/talent?page=${currentPage - 1}`}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >
                ← {t('Previous', 'Previous')}
              </Link>
            )}
            <span className="text-sm px-4" style={{ color: 'var(--color-text-muted)' }}>
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/talent?page=${currentPage + 1}`}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {t('Next', 'Next')} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
