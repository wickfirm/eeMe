import { getPage } from '@/lib/api'
import StaticPageClient from '@/components/StaticPageClient'
import type { Page } from '@/lib/types'

export const revalidate = 86400

export default async function AboutPage() {
  let page: Page = { id: 0, title: 'About eeMe' }
  try {
    const res = (await getPage('about-eeme')) as Record<string, unknown>
    page = ((res?.page ?? res) as Page) || page
  } catch {
    // Use default
  }
  return <StaticPageClient page={page} />
}
