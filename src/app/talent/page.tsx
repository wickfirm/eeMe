import { getTalentIndex, getCategories } from '@/lib/api'
import TalentListClient from '@/components/talent/TalentListClient'
import type { Talent, Category } from '@/lib/types'

export const revalidate = 1800

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function TalentPage({ searchParams }: Props) {
  const rawPage = searchParams?.page
  const page = Math.max(1, parseInt(typeof rawPage === 'string' ? rawPage : '1', 10))

  let talents: Talent[] = []
  let categories: Category[] = []
  let totalPages = 1
  let totalCount = 0
  let currentPage = page

  try {
    const [talentRes, catRes] = await Promise.all([
      getTalentIndex(page),
      getCategories(),
    ])

    // Handle both flat array and paginated { data, meta } response
    const tr = talentRes as Record<string, unknown>
    if (Array.isArray(tr)) {
      talents = tr as Talent[]
      totalCount = talents.length
    } else if (Array.isArray((tr as Record<string, unknown>)?.data)) {
      talents = (tr as Record<string, unknown>).data as Talent[]
      const meta = (tr as Record<string, unknown>).meta as Record<string, number> | undefined
      currentPage = meta?.current_page ?? page
      totalPages = meta?.last_page ?? 1
      totalCount = meta?.total ?? talents.length
    }

    const cr = catRes as Record<string, unknown>
    if (Array.isArray(cr)) {
      categories = cr as Category[]
    } else if (Array.isArray((cr as Record<string, unknown>)?.data)) {
      categories = (cr as Record<string, unknown>).data as Category[]
    }
  } catch {
    // API down — render empty shell
  }

  return (
    <TalentListClient
      talents={talents}
      categories={categories}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  )
}
