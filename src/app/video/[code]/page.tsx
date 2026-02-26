import { getVideoPreview } from '@/lib/api'
import type { TalentVideo, Talent } from '@/lib/types'
import { STORAGE_URL } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: { code: string }
}

export default async function VideoPage({ params }: Props) {
  let video: TalentVideo | null = null
  let talent: Talent | null = null

  try {
    const res = await getVideoPreview(params.code)
    video = res.video
    talent = res.talent
    if (!video?.id) return notFound()
  } catch {
    return notFound()
  }

  const videoUrl = video.url
  const thumbnailUrl = video.thumbnail ? `${STORAGE_URL}/${video.thumbnail}` : null
  const talentName = talent?.name || ''
  const talentSlug = talent?.slug || ''
  const talentAvatarUrl = talent?.image ? `${STORAGE_URL}/${talent.image}` : null

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-2xl">

        {/* Talent attribution */}
        {talent && (
          <Link
            href={talentSlug ? `/talent/${talentSlug}` : '/talent'}
            className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity"
          >
            {talentAvatarUrl && (
              <img
                src={talentAvatarUrl}
                alt={talentName}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                A personalised video from
              </p>
              <p className="font-bold" style={{ color: 'var(--color-text)' }}>
                {talentName}
              </p>
            </div>
          </Link>
        )}

        {/* Video player */}
        <div
          className="w-full rounded-2xl overflow-hidden aspect-video"
          style={{ backgroundColor: '#000' }}
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              poster={thumbnailUrl || undefined}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Video not available
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Want your own personalised video?
          </p>
          <Link
            href={talentSlug ? `/talent/${talentSlug}` : '/talent'}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            Book {talentName || 'a Talent'} →
          </Link>
        </div>
      </div>
    </div>
  )
}
