'use client'

import { useTranslation } from 'react-i18next'
import type { Page } from '@/lib/types'

interface Props {
  page: Page
}

export default function StaticPageClient({ page }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const title = lang === 'ar' && page.title_ar ? page.title_ar : page.title
  const body = lang === 'ar' && page.body_ar ? page.body_ar : page.body || ''

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-black mb-8" style={{ color: 'var(--color-text)' }}>
          {title}
        </h1>
        <div
          className="prose-sm max-w-none leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </div>
  )
}
