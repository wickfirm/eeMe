import { getHomeData } from '@/lib/api'
import HomeClient from '@/components/home/HomeClient'
import type { HomeData } from '@/lib/types'

export const revalidate = 1800

export default async function HomePage() {
  let data: HomeData = {}

  try {
    data = await getHomeData()
  } catch {
    // API down or error — render shell
  }

  return <HomeClient data={data} />
}
