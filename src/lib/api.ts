const API_URL = process.env.API_URL || 'https://apis.eeme.io/api'
const API_HOST = process.env.API_HOST || 'eeme.io'

async function apiFetch<T>(path: string, options?: RequestInit & { revalidate?: number | false }): Promise<T> {
  const { revalidate, ...fetchOptions } = options || {}
  const url = `${API_URL}${path}`

  const res = await fetch(url, {
    ...fetchOptions,
    next: revalidate !== undefined ? { revalidate } : { revalidate: 3600 },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...fetchOptions.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${path}`)
  }

  return res.json()
}

// ─── Home ────────────────────────────────────────────────────────────────────

export async function getHomeData() {
  return apiFetch(`/home/data?host=${API_HOST}`, { revalidate: 1800 })
}

export async function getHomePage() {
  return apiFetch(`/home?host=${API_HOST}`, { revalidate: 3600 })
}

// ─── Talents ─────────────────────────────────────────────────────────────────

export async function getTalentIndex(page = 1) {
  return apiFetch(`/talent?host=${API_HOST}&page=${page}`, { revalidate: 1800 })
}

export async function getTalent(lang: string, slug: string) {
  return apiFetch(`/talent/${lang}/${slug}?host=${API_HOST}`, { revalidate: 3600 })
}

export async function getTalentBookData(lang: string, slug: string) {
  return apiFetch(`/talent/${lang}/${slug}/book?host=${API_HOST}`, { revalidate: false })
}

export async function getTalentArticle(lang: string, slug: string, title: string) {
  return apiFetch(`/talent/${lang}/${slug}/article?host=${API_HOST}&title=${title}`, { revalidate: 3600 })
}

export async function getTalentFilmography(slug: string) {
  return apiFetch(`/filmography/${slug}?host=${API_HOST}`, { revalidate: 3600 })
}

export async function getTalentSpot(lang: string, slug: string, type: string) {
  return apiFetch(`/talent/${lang}/${slug}/spot/${type}?host=${API_HOST}`, { revalidate: 1800 })
}

export async function getTalentInsight(lang: string, slug: string, type: string) {
  return apiFetch(`/talent/${lang}/${slug}/insight/type/${type}?host=${API_HOST}`, { revalidate: 3600 })
}

export async function getLatestArticles() {
  return apiFetch(`/latest-articles?host=${API_HOST}`, { revalidate: 1800 })
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories() {
  return apiFetch(`/category?host=${API_HOST}`, { revalidate: 3600 })
}

export async function getCategory(slug: string) {
  return apiFetch(`/category/${slug}?host=${API_HOST}`, { revalidate: 1800 })
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getPage(slug: string) {
  return apiFetch(`/page/${slug}?host=${API_HOST}`, { revalidate: 86400 })
}

// ─── Video ───────────────────────────────────────────────────────────────────

export async function getVideoPreview(code: string) {
  return apiFetch(`/video/${code}/preview?host=${API_HOST}`, { revalidate: false })
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export async function getOnboardingData() {
  return apiFetch(`/on-boarding?host=${API_HOST}`, { revalidate: 86400 })
}
