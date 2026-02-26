import { getCategory, getCategories } from '@/lib/api'
import type { Talent, Category } from '@/lib/types'
import TalentListClient from '@/components/talent/TalentListClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 1800

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { category } = await getCategory(params.slug)
    if (!category?.name) return {}
    return {
      title: `${category.name} Talents | eeMe`,
      description: `Browse ${category.name} talents on eeMe`,
    }
  } catch {
    return {}
  }
}

export default async function CategoryPage({ params }: Props) {
  let talents: Talent[] = []
  let category: Category | null = null
  let categories: Category[] = []

  try {
    const [catRes, allCatsRes] = await Promise.all([
      getCategory(params.slug),
      getCategories(),
    ])

    category = catRes.category
    if (!category?.id) return notFound()

    talents = catRes.talents
    categories = allCatsRes
  } catch {
    return notFound()
  }

  return (
    <TalentListClient
      talents={talents}
      categories={categories}
      currentPage={1}
      totalPages={1}
      totalCount={talents.length}
      activeCategory={category}
    />
  )
}
