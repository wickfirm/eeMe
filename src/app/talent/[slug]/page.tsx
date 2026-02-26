import { getTalent } from '@/lib/api'
import TalentProfileClient from '@/components/talent/TalentProfileClient'
import type { Talent } from '@/lib/types'
import { STORAGE_URL } from '@/lib/types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { talent } = await getTalent('en', params.slug)
    if (!talent?.name) return {}
    return {
      title: `${talent.name} | eeMe`,
      description: talent.description?.slice(0, 160),
      openGraph: {
        title: talent.name,
        description: talent.description?.slice(0, 160) || '',
        images: talent.image ? [`${STORAGE_URL}/${talent.image}`] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function TalentProfilePage({ params }: Props) {
  let talent: Talent | null = null
  try {
    const res = await getTalent('en', params.slug)
    talent = res.talent
    if (!talent?.id) return notFound()
  } catch {
    return notFound()
  }

  return <TalentProfileClient talent={talent} />
}
