import { getTalentBookData } from '@/lib/api'
import BookingClient from '@/components/talent/BookingClient'
import type { Talent, Occasion } from '@/lib/types'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BookingPage({ params, searchParams }: Props) {
  const rawType = searchParams?.type
  const orderType = parseInt(typeof rawType === 'string' ? rawType : '1', 10)

  let talent: Talent | null = null
  let occasions: Occasion[] = []

  try {
    const res = (await getTalentBookData('en', params.slug)) as Record<string, unknown>
    talent = ((res?.talent ?? res) as Talent) || null
    if (!talent?.id) return notFound()
    if (Array.isArray(res?.occasions)) {
      occasions = res.occasions as Occasion[]
    }
  } catch {
    return notFound()
  }

  return <BookingClient talent={talent} occasions={occasions} orderType={orderType} />
}
