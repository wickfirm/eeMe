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

// ─── JSON/JSONB field extractor ───────────────────────────────────────────────
// Handles both true JSONB and varchar columns containing {"en":"…","ar":"…"}
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

type Row = Record<string, unknown>

// ─── Safe data extractors for Promise.allSettled results ──────────────────────
// Supabase allSettled results type .data as T | GenericStringError[] — must go
// through unknown to avoid TypeScript's overlap check.
type SBResult = PromiseSettledResult<{ data: unknown; error: unknown }>
function sd(res: SBResult): Row[] {
  if (res.status !== 'fulfilled' || res.value.error) return []
  return (res.value.data as unknown as Row[]) ?? []
}
function sdOne(res: SBResult): Row | null {
  if (res.status !== 'fulfilled' || res.value.error) return null
  return (res.value.data as unknown as Row) ?? null
}

// ─── Flat SELECT — no FK joins (FK constraints absent in this schema) ─────────
// is_published / is_active are smallint (1/0), NOT boolean
const TALENT_SELECT =
  'id, user_id, slug, image, cover_image, description, ' +
  'is_available, is_verified, is_active, is_published'

// ─── Batch-fetch users by IDs → { [userId]: userRow } ────────────────────────
async function fetchUserMap(ids: number[]): Promise<Record<number, Row>> {
  const uniq = Array.from(new Set(ids.filter(Boolean)))
  if (!uniq.length) return {}
  const { data } = await supabase.from('users').select('id, name').in('id', uniq)
  const map: Record<number, Row> = {}
  for (const u of data ?? []) map[Number((u as Row).id)] = u as Row
  return map
}

// ─── Build userMap from a list of talent rows ─────────────────────────────────
async function userMapFromTalents(rows: Row[]): Promise<Record<number, Row>> {
  const ids = rows.map(r => Number(r.user_id)).filter(Boolean)
  return fetchUserMap(ids)
}

// ─── Fetch junction data for a single talent ID ───────────────────────────────
// Returns social, prices, categories via direct queries (no FK join syntax)
async function fetchTalentJunctions(talentId: number) {
  const [socialRes, pricesRes, catLinksRes] = await Promise.allSettled([
    supabase
      .from('talents_social')
      .select('id, social_media_id, followers, url')
      .eq('talent_id', talentId),

    supabase
      .from('talents_prices')
      .select('id, talent_price_type_id, order_type, price, delivery_days')
      .eq('talent_id', talentId),

    supabase
      .from('talents_category')
      .select('category_id')
      .eq('talent_id', talentId),
  ])

  const social: TalentSocial[] = sd(socialRes).map(s => ({
    id:              Number(s.id),
    social_media_id: Number(s.social_media_id),
    followers:       s.followers != null ? Number(s.followers) : undefined,
    url:             (s.url as string) || undefined,
  }))

  const prices: TalentPrice[] = sd(pricesRes).map(p => ({
    id:            Number(p.id),
    type:          Number(p.talent_price_type_id),
    price:         Number(p.price),
    currency:      'USD',
    delivery_days: p.delivery_days != null ? Number(p.delivery_days) : undefined,
  }))

  let categories: Category[] = []
  const catLinks = sd(catLinksRes)
  if (catLinks.length) {
    const catIds = catLinks.map(l => Number(l.category_id)).filter(Boolean)
    if (catIds.length) {
      const { data: cats } = await supabase
        .from('categories')
        .select('id, name, slug, image')
        .in('id', catIds)
      categories = (cats ?? []).map(c => xCategory(c as Row))
    }
  }

  return { social, prices, categories }
}

// ─── Row → typed transformers ─────────────────────────────────────────────────

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

function xTalent(
  row: Row,
  lang = 'en',
  userMap?: Record<number, Row>,
  extra?: { social?: TalentSocial[]; prices?: TalentPrice[]; categories?: Category[] },
): Talent {
  const userId = Number(row.user_id)
  const user: Row = userMap?.[userId] ?? ((row.users as Row) ?? {})

  return {
    id:             Number(row.id),
    slug:           j(row.slug, lang) || j(row.slug, 'en') || '',
    name:           j(user.name, lang) || j(user.name, 'en') || '',
    name_ar:        j(user.name, 'ar') || undefined,
    description:    j(row.description, lang) || undefined,
    description_ar: j(row.description, 'ar') || undefined,
    image:          (row.image as string) || undefined,
    cover_image:    (row.cover_image as string) || undefined,
    // is_available / is_verified stored as smallint 1/0 OR boolean true/false
    is_available:   row.is_available === 1 || row.is_available === true,
    is_verified:    row.is_verified  === 1 || row.is_verified  === true,
    categories:     extra?.categories?.length ? extra.categories : undefined,
    social:         extra?.social?.length     ? extra.social     : undefined,
    prices:         extra?.prices?.length     ? extra.prices     : undefined,
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
    // talent is optional; embedded FK join removed (no FK constraints exist)
  }
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export async function getHomeData(): Promise<HomeData> {
  const [talentsRes, catsRes, articlesRes, pageRes] = await Promise.allSettled([
    supabase
      .from('talents')
      .select(TALENT_SELECT)
      .eq('is_published', 1)   // smallint, not boolean
      .eq('is_active', 1)
      .order('id', { ascending: false })
      .limit(12),

    supabase
      .from('categories')
      .select('id, name, slug, image')
      .is('parent_id', null)
      .order('id'),

    supabase
      .from('articles')
      .select('id, title, slug, content, image, created_at')
      .eq('is_published', 1)
      .order('created_at', { ascending: false })
      .limit(6),

    supabase
      .from('pages')
      .select('id, slug, title, content')
      .eq('slug', 'home')
      .maybeSingle(),
  ])

  const talentRows = sd(talentsRes)
  const userMap = await userMapFromTalents(talentRows)
  const talents: Talent[] = talentRows.map(r => xTalent(r, 'en', userMap))

  const categories: Category[] = sd(catsRes).map(r => xCategory(r))

  const articles: TalentArticle[] = sd(articlesRes).map(r => xArticle(r))

  let page: Page | undefined
  const p = sdOne(pageRes)
  if (p) {
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

// ─── Talents ──────────────────────────────────────────────────────────────────

export async function getTalentIndex(page = 1) {
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from('talents')
    .select(TALENT_SELECT, { count: 'exact' })
    .eq('is_published', 1)
    .eq('is_active', 1)
    .order('id', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  const rows = (data ?? []) as Row[]
  const userMap = await userMapFromTalents(rows)

  return {
    data: rows.map(r => xTalent(r, 'en', userMap)),
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

  // slug is varchar containing JSON string e.g. {"en":"ayman-bitar","ar":"..."}
  // Use ilike to match the "en":"slug" substring
  const { data, error } = await supabase
    .from('talents')
    .select(TALENT_SELECT)
    .ilike('slug', `%"${langKey}":"${slug}"%`)
    .eq('is_published', 1)
    .maybeSingle()

  if (!data || error) {
    // Fallback: try English slug when language-specific lookup misses
    if (langKey !== 'en') {
      const { data: fb } = await supabase
        .from('talents')
        .select(TALENT_SELECT)
        .ilike('slug', `%"en":"${slug}"%`)
        .eq('is_published', 1)
        .maybeSingle()
      if (fb) {
        const t = fb as Row
        const [userMap, junctions] = await Promise.all([
          fetchUserMap([Number(t.user_id)]),
          fetchTalentJunctions(Number(t.id)),
        ])
        return { talent: xTalent(t, lang, userMap, junctions) }
      }
    }
    return { talent: null }
  }

  const t = data as Row
  const [userMap, junctions] = await Promise.all([
    fetchUserMap([Number(t.user_id)]),
    fetchTalentJunctions(Number(t.id)),
  ])

  return { talent: xTalent(t, lang, userMap, junctions) }
}

export async function getTalentBookData(lang: string, slug: string) {
  const langKey = lang === 'ar' ? 'ar' : 'en'

  const { data: talentRow } = await supabase
    .from('talents')
    .select(TALENT_SELECT)
    .ilike('slug', `%"${langKey}":"${slug}"%`)
    .eq('is_published', 1)
    .maybeSingle()

  if (!talentRow) return { talent: null, occasions: [], addons: [] }

  const t = talentRow as Row
  const talentId = Number(t.id)

  const [userMap, pricesRes, addonLinksRes, occasionsRes] = await Promise.all([
    fetchUserMap([Number(t.user_id)]),

    supabase
      .from('talents_prices')
      .select('id, talent_price_type_id, order_type, price, delivery_days')
      .eq('talent_id', talentId),

    // talent_addons = 1-to-many from talents; addon_id may vary — using * for safety
    supabase
      .from('talent_addons')
      .select('*')
      .eq('talent_id', talentId),

    supabase
      .from('occasions')
      .select('id, name')
      .order('id'),
  ])

  const prices: TalentPrice[] = (pricesRes.data ?? []).map(p => ({
    id:            Number((p as Row).id),
    type:          Number((p as Row).talent_price_type_id),
    price:         Number((p as Row).price),
    currency:      'USD',
    delivery_days: (p as Row).delivery_days != null ? Number((p as Row).delivery_days) : undefined,
  }))

  // Filter active addon links (is_active may be smallint 1 or boolean true)
  const activeAddonLinks = (addonLinksRes.data ?? []).filter(ta => {
    const ia = (ta as Row).is_active
    return ia === 1 || ia === true
  }) as unknown as Row[]

  // Fetch addon details if we have links
  let addons: unknown[] = []
  if (activeAddonLinks.length) {
    // Try common column names for the addon FK: addon_id or addons_id
    const addonIds = activeAddonLinks
      .map(ta => Number(ta.addon_id ?? ta.addons_id))
      .filter(Boolean)

    const addonDetailMap: Record<number, Row> = {}
    if (addonIds.length) {
      const { data: addonDetails } = await supabase
        .from('addons')
        .select('id, name, description, order_type')
        .in('id', addonIds)
      for (const a of addonDetails ?? []) {
        addonDetailMap[Number((a as Row).id)] = a as Row
      }
    }

    addons = activeAddonLinks.map(ta => {
      const addonDetail = addonDetailMap[Number(ta.addon_id ?? ta.addons_id)] ?? {}
      return {
        id:          Number(ta.id),
        price:       Number(ta.price),
        name:        j(addonDetail.name, langKey),
        name_ar:     j(addonDetail.name, 'ar') || undefined,
        description: j(addonDetail.description, langKey) || undefined,
        order_type:  String(addonDetail.order_type ?? ''),
      }
    })
  }

  const occasions: Occasion[] = (occasionsRes.data ?? []).map((o: Row) => ({
    id:      Number(o.id),
    name:    j(o.name, langKey),
    name_ar: j(o.name, 'ar') || undefined,
  }))

  return {
    talent: xTalent(t, lang, userMap, { prices }),
    occasions,
    addons,
  }
}

export async function getTalentArticle(lang: string, slug: string, title: string) {
  const langKey = lang === 'ar' ? 'ar' : 'en'

  const { data: talentRow } = await supabase
    .from('talents')
    .select('id')
    .ilike('slug', `%"${langKey}":"${slug}"%`)
    .maybeSingle()

  if (!talentRow) return { article: null }

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, image, created_at')
    .eq('talent_id', (talentRow as Row).id)
    .eq('slug', title)
    .eq('is_published', 1)
    .maybeSingle()

  if (error || !data) return { article: null }

  return { article: xArticle(data as Row, lang) }
}

export async function getTalentFilmography(slug: string) {
  try {
    const { data: talentRow } = await supabase
      .from('talents')
      .select('id')
      .ilike('slug', `%"en":"${slug}"%`)
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
      .ilike('slug', `%"${langKey}":"${slug}"%`)
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
      .ilike('slug', `%"${langKey}":"${slug}"%`)
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
    .select('id, title, slug, content, image, created_at')
    .eq('is_published', 1)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return []
  return (data ?? []).map(r => xArticle(r as Row))
}

// ─── Categories ───────────────────────────────────────────────────────────────

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

  // Fetch talent IDs in this category via the junction table
  // NOTE: If talents_category uses a different column name than talent_id,
  //       run: SELECT column_name FROM information_schema.columns WHERE table_name='talents_category'
  //       and update the .select() and .eq() below accordingly.
  const { data: links } = await supabase
    .from('talents_category')
    .select('talent_id')
    .eq('category_id', category.id)

  const ids = (links ?? [])
    .map(r => (r as Row).talent_id as number)
    .filter(Boolean)
  if (!ids.length) return { category, talents: [] }

  const { data: talentRows } = await supabase
    .from('talents')
    .select(TALENT_SELECT)
    .in('id', ids)
    .eq('is_published', 1)
    .eq('is_active', 1)
    .order('id', { ascending: false })

  const rows = (talentRows ?? []) as Row[]
  const userMap = await userMapFromTalents(rows)
  const talents = rows.map(r => xTalent(r, 'en', userMap))

  return { category: { ...category, talents_count: talents.length }, talents }
}

// ─── Pages ────────────────────────────────────────────────────────────────────

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

// ─── Video ────────────────────────────────────────────────────────────────────

export async function getVideoPreview(code: string) {
  const { data, error } = await supabase
    .from('videos')
    .select('id, code, url, thumbnail, is_active, created_at, talent_id')
    .eq('code', code)
    .eq('is_active', 1)
    .maybeSingle()

  if (error || !data) return { video: null }

  const v = data as Row

  // Fetch associated talent separately (no FK join available)
  let talent: Talent | undefined
  if (v.talent_id) {
    const { data: tRow } = await supabase
      .from('talents')
      .select(TALENT_SELECT)
      .eq('id', Number(v.talent_id))
      .maybeSingle()
    if (tRow) {
      const userMap = await fetchUserMap([Number((tRow as Row).user_id)])
      talent = xTalent(tRow as Row, 'en', userMap)
    }
  }

  return {
    video: {
      id:         Number(v.id),
      code:       String(v.code),
      url:        (v.url as string) ?? '',
      thumbnail:  (v.thumbnail as string) ?? '',
      is_public:  true,
      created_at: String(v.created_at ?? ''),
    },
    talent: talent ?? null,
  }
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function getOnboardingData() {
  const [catRes, occRes] = await Promise.allSettled([
    supabase.from('categories').select('id, name, slug, image').is('parent_id', null).order('id'),
    supabase.from('occasions').select('id, name').order('id'),
  ])

  const categories: Category[] = sd(catRes).map(r => xCategory(r))

  const occasions: Occasion[] = sd(occRes).map(o => ({
    id:      Number(o.id),
    name:    j(o.name, 'en'),
    name_ar: j(o.name, 'ar') || undefined,
  }))

  return { categories, occasions }
}
