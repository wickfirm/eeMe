import { getHomeData } from '@/lib/api'
import HomeClient from '@/components/home/HomeClient'

export const revalidate = 1800

export default async function HomePage() {
  let data: Record<string, unknown> = {}

  try {
    data = await getHomeData() as Record<string, unknown>
  } catch {
    // API down or error — render shell
  }

  return <HomeClient data={data} />
}
