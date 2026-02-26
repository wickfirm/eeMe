import { getPage } from '@/lib/api'
import StaticPageClient from '@/components/StaticPageClient'
import type { Page } from '@/lib/types'

export const revalidate = 86400

export default async function PrivacyPage() {
  let page: Page = { id: 0, title: 'Privacy Policy' }
  try {
    const res = await getPage('privacy-policy')
    page = res || page
  } catch {
    // Use default
  }
  return <StaticPageClient page={page} />
}
