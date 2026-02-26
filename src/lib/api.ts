import { supabase } from './supabase'
import type {
  Talent,
  Category,
  TalentArticle,
  TalentPrice,
  TalentSocial,
  Page,
  HomeData,
  Occasion,
} from './types'

const PAGE_SIZE = 15

// ─── JSONB field extractor ────────────────────────────────────────────────────
// Handles fields stored as { "en": "...", "ar": "..." } JSON objects
function j(field: unknown, lang = 'en'): string {
  if (!field) return ''
  if (typeof field === 'string') {
    try { field = JSON.parse(field) } catch { return field as string }
  }
  if (typeof field === 'object' && field !== null) {
    const o = field as Record<string, string>
    return o[lang] ?? o['en'] ?? (Object.values(o)[0] as string) ?? ''
  }
  return String(field)
}

// ─── Shared row type ──────────────────────────────────────────────────────────
type Row = Record<string, unknown>

// ─── Row → Type transformers ──────────────────────────────────────────────────

function xCategory(row: Row): Category {
  return {
    id:            Number(row.id),
    name:          j(row.name, 'en'),
    name_ar:       j(row.name, 'ar') || undefined,
    slug:          String(row.slug ?? ''),
    image:         (row.image as string) || undefined,
    talents_count: (row.talents_count as number) || undefined,
  }
}

function xTalent(row: Row, lang = 'en'): Talent {
  const user = ((row.users ?? {}) as Row)

  const categories: Category[] = Array.isArray(row.talents_category)
    ? (row.talents_category as Array<{ categories: Row | null }>)
        .filter(tc => tc.categories)
        .map(tc => xCategory(tc.categories!))
    : []

  const social: TalentSocial[] = Array.isArray(row.talents_social)
    ? (row.talents_social as Row[]).map(s => ({
        id:              Number(s.id),
        social_media_id: Number(s.social_media_id),
        followers:       s.followers != null ? Number(s.followers) : undefined,
        url:             (s.url as string) || undefined,
      }))
    : []

  const prices: TalentPrice[] = Array.isArray(row.talents_prices)
    ? (row.talents_prices as Row[]).map(p => ({
        id:            Number(p.id),
        type:          Number(p.talent_price_type_id),
        price:         Number(p.price),
        currency:      'USD',
        delivery_days: p.delivery_days != null ? Number(p.delivery_days) : undefined,
      }))
    : []

  return {
    id:             Number(row.id),
    slug:           j(row.slug, lang) || j(row.slug, 'en') || '',
    name:           j(user.name, lang) || j(user.name, 'en') || '',
    name_ar:        j(user.name, 'ar') || undefined,
    description:    j(row.description, lang) || undefined,
    description_ar: j(row.description, 'ar') || undefined,
    image:          (row.image as string) || undefined,
    cover_image:    (row.cover_image as string) || undefined,
    is_available:   Boolean(row.is_available),
    is_verified:    Boolean(row.is_verified),
    categories:     categories.length ? categories : undefined,
    social:         social.length     ? social     : undefined,
    prices:         prices.length     ? prices     : undefined,
  }
}

function xArticle(row: Row, lang = 'en'): TalentArticle {
  return {
    id:         Number(row.id),
    title:      j(row.title, lang),
    title_ar:   j(row.title, 'ar') || undefined,
    slug:       String(row.slug ?? ''),
    body:       j(row.content, lang) || undefined,
    image:      (row.image as string) || undefined,
    created_at: String(row.created_at ?? ''),
    talent:     row.talents ? xTalent(row.talents as Row, lang) : undefined,
  }
}

// ─── Shared SELECT fragment for talent queries ────────────────────────────────
const TALENT_SELECT = [
  'id', 'slug', 'image', 'cover_image', 'description',
  'is_available', 'is_verified', 'is_active', 'is_published',
  'users!inner(name)',
  'talents_category(categories(id, name, slug, image))',
  'talents_social(id, social_media_id, followers, url)',
  'talents_prices(id, talent_price_type_id, order_type, price, delivery_days)',
].join(', ')

// ─── Home ────────────────────────────────────────────────────────────────────

export async function getHomeData(): Promise<HomeData> {
  const [talentsRes, catsRes, articlesRes, pageRes] = await Promise.allSettled([
    supabase
      .from('talents')
      .select(TALENT_SELECT)
      .eq('is_published', true)
      .eq('is_active', true)
      .order('id', { ascending: false })
      .limit(12),

    supabase
      .from('categories')
      .select('id, name, slug, image')
      .is('parent_id', null)
      .order('id'),

    supabase
      .from('articles')
      .select('id, title, slug, content, image, created_at, talents(id, slug, image, users(name))')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),

    supabase
      .from('pages')
      .select('id, slug, title, content')
      .eq('slug', 'home')
      .maybeSingle(),
  ])

  const talents: Talent[] =
    talentsRes.status === 'fulfilled' && !talentsRes.value.error
      ? (talentsRes.value.data ?? []).map(r => xTalent(r as Row))
      : []

  const categories: Category[] =
    catsRes.status === 'fulfilled' && !catsRes.value.error
      ? (catsRes.value.data ?? []).map(r => xCategory(r as Row))
      : []

  const articles: TalentArticle[] =
    articlesRes.status === 'fulfilled' && !articlesRes.value.error
      ? (articlesRes.value.data ?? []).map(r => xArticle(r as Row))
      : []

  let page: Page | undefined
  if (
    pageRes.status === 'fulfilled' &&
    !pageRes.value.error &&
    pageRes.value.data
  ) {
    const p = pageRes.value.data as Row
    page = {
      id:       Number(p.id),
      slug:     String(p.slug ?? 'home'),
      title:    j(p.title, 'en'),
      title_ar: j(p.title, 'ar') || undefined,
      body:     j(p.content, 'en') || undefined,
      body_ar:  j(p.content, 'ar') || undefined,
    }
  }

  return { talents, categories, articles, page }
}

export async function getHomePage(): Promise<HomeData> {
  return getHomeData()
}

// ─── Talents ─────────────────────────────────────────────────────────────────

export async function getTalentIndex(page = 1) {
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from('talents')
    .select(TALENT_SELECT, { count: 'exact' })
    .eq('is_published', true)
    .eq('is_active', true)
    .order('id', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    data: (data ?? []).map(r => xTalent(r as Row)),
    meta: {
      current_page: page,
      last_page:    Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
      total:        count ?? 0,
      per_page:     PAGE_SIZE,
    },
  }
}

export async function getTalent(lang: string, slug: string) {
  const langKey = lang === 'ar' ? 'ar' : 'en'

  const { data, error } = await supabase
    .from('talents')
    .select(TALENT_SELECT)
    .filter(`slug->>${langKey}`, 'eq', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!data || error) {
    // Fallback: try English slug when Arabic lookup misses
    if (langKey !== 'en') {
      const { data: fb } = await supabase
        .from('talents')
        .select(TALENT_SELECT)
        .filter('slug->>en', 'eq', slug)
        .eq('is_published', true)
        .maybeSingle()
      if (fb) return { talent: xTalent(fb as Row, lang) }
    }
    return { talent: null }
  }

  return { talent: xTalent(data as Row, lang) }
}

export async function getTalentBookData(lang: string, slug: string) {
  const langKey = lang === 'ar' ? 'ar' : 'en'

  const { data: talentRow } = await supabase
    .from('talents')
    .select(`
      id, slug, image, cover_image, description,
      users!inner(name),
      talents_prices(id, talent_price_type_id, order_type, price, delivery_days),
      talent_addons(id, price, is_active, addons(id, name, description, order_type))
    `)
    .filter(`slug->>${langKey}`, 'eq', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!talentRow) return { talent: null, occasions: [], addons: [] }

  const t = talentRow as Row

  const [occasionsRes] = await Promise.allSettled([
    supabase.from('occasions').select('id, name').order('id'),
  ])

  const occasions: Occasion[] =
    occasionsRes.status === 'fulfilled' && !occasionsRes.value.error
      ? (occasionsRes.value.data ?? []).map((o: Row) => ({
          id:      Number(o.id),
          name:    j(o.name, langKey),
          name_ar: j(o.name, 'ar') || undefined,
        }))
      : []

  const addons = Array.isArray(t.talent_addons)
    ? (t.talent_addons as Row[])
        .filter(ta => ta.is_active)
        .map(ta => {
          const a = (ta.addons ?? {}) as Row
          return {
            id:          Number(ta.id),
            price:       Number(ta.price),
            name:        j(a.name, langKey),
            name_ar:     j(a.name, 'ar') || undefined,
            description: j(a.description, langKey) || undefined,
            order_type:  String(a.order_type ?? ''),
          }
        })
    : []

  return { talent: xTalent(t, lang), occasions, addons }
}

export async function getTalentArticle(lang: string, slug: string, title: string) {
  const langKey = lang === 'ar' ? 'ar' : 'en'

  const { data: talentRow } = await supabase
    .from('talents')
    .select('id')
    .filter(`slug->>${langKey}`, 'eq', slug)
    .maybeSingle()

  if (!talentRow) return { article: null }

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, image, created_at')
    .eq('talent_id', (talentRow as Row).id)
    .eq('slug', title)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return { article: null }

  return { article: xArticle(data as Row, lang) }
}

export async function getTalentFilmography(slug: string) {
  try {
    const { data: talentRow } = await supabase
      .from('talents')
      .select('id')
      .filter('slug->>en', 'eq', slug)
      .maybeSingle()

    if (!talentRow) return { filmography: [] }

    const { data, error } = await supabase
      .from('filmography')
      .select('*')
      .eq('talent_id', (talentRow as Row).id)
      .order('year', { ascending: false })

    if (error) return { filmography: [] }
    return { filmography: data ?? [] }
  } catch {
    return { filmography: [] }
  }
}

export async function getTalentSpot(lang: string, slug: string, type: string) {
  try {
    const langKey = lang === 'ar' ? 'ar' : 'en'

    const { data: talentRow } = await supabase
      .from('talents')
      .select('id')
      .filter(`slug->>${langKey}`, 'eq', slug)
      .maybeSingle()

    if (!talentRow) return { spot: null }

    const { data } = await supabase
      .from('talent_spots')
      .select('*')
      .eq('talent_id', (talentRow as Row).id)
      .eq('type', type)
      .maybeSingle()

    return { spot: data ?? null }
  } catch {
    return { spot: null }
  }
}

export async function getTalentInsight(lang: string, slug: string, type: string) {
  try {
    const langKey = lang === 'ar' ? 'ar' : 'en'

    const { data: talentRow } = await supabase
      .from('talents')
      .select('id')
      .filter(`slug->>${langKey}`, 'eq', slug)
      .maybeSingle()

    if (!talentRow) return { insights: [] }

    const { data } = await supabase
      .from('insights')
      .select('*')
      .eq('talent_id', (talentRow as Row).id)
      .eq('type', type)
      .order('created_at', { ascending: false })

    return { insights: data ?? [] }
  } catch {
    return { insights: [] }
  }
}

export async function getLatestArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, image, created_at, talents(id, slug, image, users(name))')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return []
  return (data ?? []).map(r => xArticle(r as Row))
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, image')
    .is('parent_id', null)
    .order('id')

  if (error) return []
  return (data ?? []).map(r => xCategory(r as Row))
}

export async function getCategory(slug: string) {
  const { data: catRow, error } = await supabase
    .from('categories')
    .select('id, name, slug, image')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !catRow) return { category: null, talents: [] }

  const category = xCategory(catRow as Row)

  // Get talent IDs that belong to this category
  const { data: links } = await supabase
    .from('talents_category')
    .select('talent_id')
    .eq('category_id', category.id)

  const ids = (links ?? []).map(r => (r as Row).talent_id as number)
  if (!ids.length) return { category, talents: [] }

  const { data: talentRows } = await supabase
    .from('talents')
    .select(TALENT_SELECT)
    .in('id', ids)
    .eq('is_published', true)
    .eq('is_active', true)
    .order('id', { ascending: false })

  const talents = (talentRows ?? []).map(r => xTalent(r as Row))

  return { category: { ...category, talents_count: talents.length }, talents }
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('id, slug, title, content')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null

  const p = data as Row
  return {
    id:       Number(p.id),
    slug:     String(p.slug ?? slug),
    title:    j(p.title, 'en'),
    title_ar: j(p.title, 'ar') || undefined,
    body:     j(p.content, 'en') || undefined,
    body_ar:  j(p.content, 'ar') || undefined,
  }
}

// ─── Video ───────────────────────────────────────────────────────────────────

export async function getVideoPreview(code: string) {
  const { data, error } = await supabase
    .from('videos')
    .select('id, code, url, thumbnail, is_active, created_at, talents(id, slug, image, users(name))')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return { video: null }

  const v = data as Row
  return {
    video: {
      id:         Number(v.id),
      code:       String(v.code),
      url:        (v.url as string) ?? '',
      thumbnail:  (v.thumbnail as string) ?? '',
      is_public:  true,
      created_at: String(v.created_at ?? ''),
      talent:     v.talents ? xTalent(v.talents as Row) : undefined,
    },
  }
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export async function getOnboardingData() {
  const [catRes, occRes] = await Promise.allSettled([
    supabase.from('categories').select('id, name, slug, image').is('parent_id', null).order('id'),
    supabase.from('occasions').select('id, name').order('id'),
  ])

  const categories: Category[] =
    catRes.status === 'fulfilled' && !catRes.value.error
      ? (catRes.value.data ?? []).map(r => xCategory(r as Row))
      : []

  const occasions: Occasion[] =
    occRes.status === 'fulfilled' && !occRes.value.error
      ? (occRes.value.data ?? []).map((o: Row) => ({
          id:      Number(o.id),
          name:    j(o.name, 'en'),
          name_ar: j(o.name, 'ar') || undefined,
        }))
      : []

  return { categories, occasions }
}
