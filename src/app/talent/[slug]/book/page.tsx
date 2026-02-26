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
    const res = await getTalentBookData('en', params.slug)
    talent = res.talent
    if (!talent?.id) return notFound()
    occasions = res.occasions
  } catch {
    return notFound()
  }

  return <BookingClient talent={talent} occasions={occasions} orderType={orderType} />
}
