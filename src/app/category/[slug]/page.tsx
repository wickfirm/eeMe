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
    const res = (await getCategory(params.slug)) as Record<string, unknown>
    const cat = ((res?.category ?? res) as Category) || null
    if (!cat?.name) return {}
    return {
      title: `${cat.name} Talents | eeMe`,
      description: `Browse ${cat.name} talents on eeMe`,
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

    const cr = catRes as Record<string, unknown>
    category = ((cr?.category ?? cr) as Category) || null
    if (!category?.id) return notFound()

    // Talents are usually nested inside the category response
    if (Array.isArray(cr?.talents)) {
      talents = cr.talents as Talent[]
    } else if (category && Array.isArray((category as Record<string, unknown>).talents)) {
      talents = (category as Record<string, unknown>).talents as Talent[]
    }

    const acr = allCatsRes as Record<string, unknown>
    if (Array.isArray(acr)) {
      categories = acr as Category[]
    } else if (Array.isArray(acr?.data)) {
      categories = acr.data as Category[]
    }
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
