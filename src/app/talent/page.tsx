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

    talents = talentRes.data
    currentPage = talentRes.meta.current_page
    totalPages = talentRes.meta.last_page
    totalCount = talentRes.meta.total

    categories = catRes
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
