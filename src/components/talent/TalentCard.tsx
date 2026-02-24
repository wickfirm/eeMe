'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { Talent } from '@/lib/types'
import { STORAGE_URL } from '@/lib/types'

interface Props {
  talent: Talent
}

export default function TalentCard({ talent }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const displayName = lang === 'ar' && talent.name_ar ? talent.name_ar : talent.name
  const imageUrl = talent.image ? `${STORAGE_URL}/${talent.image}` : '/assets/images/placeholder.png'

  return (
    <Link
      href={`/talent/${talent.slug}`}
      className="group block text-center"
    >
      {/* Avatar */}
      <div
        className="relative mx-auto mb-3 rounded-full overflow-hidden transition-all group-hover:ring-2 group-hover:ring-[#3bbab1]"
        style={{
          width: '80px',
          height: '80px',
        }}
      >
        <img
          src={imageUrl}
          alt={displayName}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        {talent.is_available && (
          <span
            className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: '#22c55e', borderColor: 'var(--color-bg)' }}
          />
        )}
      </div>

      {/* Name */}
      <p
        className="text-xs font-semibold truncate leading-snug"
        style={{ color: 'var(--color-text)' }}
      >
        {displayName}
      </p>

      {/* Category */}
      {talent.categories && talent.categories[0] && (
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
          {lang === 'ar' && (talent.categories[0] as { name_ar?: string }).name_ar
            ? (talent.categories[0] as { name_ar?: string }).name_ar
            : talent.categories[0].name}
        </p>
      )}
    </Link>
  )
}
