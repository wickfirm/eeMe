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

// ─── JSON / JSONB field extractor ─────────────────────────────────────────────
// Handles true JSONB and varchar columns containing {"en":"…","ar":"…"}
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

// ─── Row type & universal cast helpers ────────────────────────────────────────
// Supabase unions data with GenericStringError in its TS types, so every cast
// must go through `unknown` first — TypeScript requires this for non-overlapping
// types. toRow / toRows are the single source of truth for that pattern.
type Row = Record<string, unknown>
const toRow  = (x: unknown): Row   => x as unknown as Row
const toRows = (x: unknown): Row[] => ((x as unknown as Row[]) ?? [])

// ─── Helpers for Promise.allSettled Supabase results ─────────────────────────
type SBResult = PromiseSettledResult<{ data: unknown; error: unknown }>
const sd    = (r: SBResult): Row[]    => r.status === 'fulfilled' && !r.value.error ? toRows(r.value.data) : []
const sdOne = (r: SBResult): Row|null => r.status === 'fulfilled' && !r.value.error ? toRow(r.value.data) : null

// ─── Flat SELECT — no FK joins (FK constraints absent in this schema) ─────────
// is_published / is_active are smallint (1/0), NOT boolean
// cover_image omitted — column was not present in DB schema diagnostic
const TALENT_SELECT =
  'id, user_id, slug, image, description, ' +
  'is_available, is_verified, is_active, is_published'

// ─── Batch-fetch users by IDs → { [userId]: Row } ────────────────────────────
async function fetchUserMap(ids: number[]): Promise<Record<number, Row>> {
  const uniq = Array.from(new Set(ids.filter(Boolean)))
  if (!uniq.length) return {}
  const { data } = await supabase.from('users').select('id, name').in('id', uniq)
  const map: Record<number, Row> = {}
  for (const u of toRows(data)) map[Number(u.id)] = u
  return map
}

async function userMapFromTalents(rows: Row[]): Promise<Record<number, Row>> {
  return fetchUserMap(rows.map(r => Number(r.user_id)).filter(Boolean))
}

// ─── Fetch junction data for a single talent (no FK joins available) ─────────
async function fetchTalentJunctions(talentId: number) {
  const [socialRes, pricesRes, catLinksRes] = await Promise.allSettled([
    supabase.from('talents_social').select('id, social_media_id, followers, url').eq('talent_id', talentId),
    supabase.from('talents_prices').select('id, talent_price_type_id, order_type, price, delivery_days').eq('talent_id', talentId),
    supabase.from('talents_category').select('category_id').eq('talent_id', talentId),
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
      const { data: cats } = await supabase.from('categories').select('id, name, slug').in('id', catIds)
      categories = toRows(cats).map(xCategory)
    }
  }

  return { social, prices, categories }
}

// ─── Row transformers ─────────────────────────────────────────────────────────

function xCategory(row: Row): Category {
  return {
    id:            Number(row.id),
    name:          j(row.name, 'en'),
    name_ar:       j(row.name, 'ar') || undefined,
    slug:          String(row.slug ?? ''),
    talents_count: (row.talents_count as number) || undefined,
  }
}

function xTalent(
  row: Row,
  lang = 'en',
  userMap?: Record<number, Row>,
  extra?: { social?: TalentSocial[]; prices?: TalentPrice[]; categories?: Category[] },
): Talent {
  const user: Row = userMap?.[Number(row.user_id)] ?? (row.users as Row) ?? {}
  return {
    id:             Number(row.id),
    slug:           j(row.slug, lang) || j(row.slug, 'en') || '',
    name:           j(user.name, lang) || j(user.name, 'en') || '',
    name_ar:        j(user.name, 'ar') || undefined,
    description:    j(row.description, lang) || undefined,
    description_ar: j(row.description, 'ar') || undefined,
    image:          (row.image as string) || undefined,
    cover_image:    (row.cover_image as string) || undefined,
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
  }
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export async function getHomeData(): Promise<HomeData> {
  const [talentsRes, catsRes, articlesRes, pageRes] = await Promise.allSettled([
    supabase.from('talents').select(TALENT_SELECT).eq('is_published', 1).eq('is_active', 1).order('id', { ascending: false }).limit(12),
    supabase.from('categories').select('id, name, slug').is('parent_id', null).order('id'),
    supabase.from('articles').select('id, title, slug, content, image, created_at').eq('is_published', 1).order('created_at', { ascending: false }).limit(6),
    supabase.from('pages').select('id, slug, title, content').eq('slug', 'home').maybeSingle(),
  ])

  const talentRows = sd(talentsRes)
  const userMap    = await userMapFromTalents(talentRows)

  const p = sdOne(pageRes)
  const page: Page | undefined = p ? {
    id:       Number(p.id),
    slug:     String(p.slug ?? 'home'),
    title:    j(p.title, 'en'),
    title_ar: j(p.title, 'ar') || undefined,
    body:     j(p.content, 'en') || undefined,
    body_ar:  j(p.content, 'ar') || undefined,
  } : undefined

  return {
    talents:    talentRows.map(r => xTalent(r, 'en', userMap)),
    categories: sd(catsRes).map(xCategory),
    articles:   sd(articlesRes).map(r => xArticle(r)),
    page,
  }
}

export async function getHomePage(): Promise<HomeData> { return getHomeData() }

// ─── Talents ──────────────────────────────────────────────────────────────────

export async function getTalentIndex(page = 1) {
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from('talents').select(TALENT_SELECT, { count: 'exact' })
    .eq('is_published', 1).eq('is_active', 1)
    .order('id', { ascending: false }).range(from, to)

  if (error) throw new Error(error.message)

  const rows    = toRows(data)
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

  const { data, error } = await supabase
    .from('talents').select(TALENT_SELECT)
    .ilike('slug', `%"${langKey}":"${slug}"%`)
    .eq('is_published', 1).maybeSingle()

  if (!data || error) {
    if (langKey !== 'en') {
      const { data: fb } = await supabase
        .from('talents').select(TALENT_SELECT)
        .ilike('slug', `%"en":"${slug}"%`)
        .eq('is_published', 1).maybeSingle()
      if (fb) {
        const t = toRow(fb)
        const [userMap, junctions] = await Promise.all([fetchUserMap([Number(t.user_id)]), fetchTalentJunctions(Number(t.id))])
        return { talent: xTalent(t, lang, userMap, junctions) }
      }
    }
    return { talent: null }
  }

  const t = toRow(data)
  const [userMap, junctions] = await Promise.all([fetchUserMap([Number(t.user_id)]), fetchTalentJunctions(Number(t.id))])
  return { talent: xTalent(t, lang, userMap, junctions) }
}

export async function getTalentBookData(lang: string, slug: string) {
  const langKey = lang === 'ar' ? 'ar' : 'en'

  const { data: talentRow } = await supabase
    .from('talents').select(TALENT_SELECT)
    .ilike('slug', `%"${langKey}":"${slug}"%`)
    .eq('is_published', 1).maybeSingle()

  if (!talentRow) return { talent: null, occasions: [] as Occasion[], addons: [] as unknown[] }

  const t        = toRow(talentRow)
  const talentId = Number(t.id)

  const [userMap, pricesRes, addonLinksRes, occasionsRes] = await Promise.all([
    fetchUserMap([Number(t.user_id)]),
    supabase.from('talents_prices').select('id, talent_price_type_id, order_type, price, delivery_days').eq('talent_id', talentId),
    supabase.from('talent_addons').select('*').eq('talent_id', talentId),
    supabase.from('occasions').select('id, name').order('id'),
  ])

  const prices: TalentPrice[] = toRows(pricesRes.data).map(p => ({
    id:            Number(p.id),
    type:          Number(p.talent_price_type_id),
    price:         Number(p.price),
    currency:      'USD',
    delivery_days: p.delivery_days != null ? Number(p.delivery_days) : undefined,
  }))

  const activeAddonLinks = toRows(addonLinksRes.data).filter(ta => ta.is_active === 1 || ta.is_active === true)

  let addons: unknown[] = []
  if (activeAddonLinks.length) {
    const addonIds = activeAddonLinks.map(ta => Number(ta.addon_id ?? ta.addons_id)).filter(Boolean)
    const addonDetailMap: Record<number, Row> = {}
    if (addonIds.length) {
      const { data: addonDetails } = await supabase.from('addons').select('id, name, description, order_type').in('id', addonIds)
      for (const a of toRows(addonDetails)) addonDetailMap[Number(a.id)] = a
    }
    addons = activeAddonLinks.map(ta => {
      const d = addonDetailMap[Number(ta.addon_id ?? ta.addons_id)] ?? {}
      return { id: Number(ta.id), price: Number(ta.price), name: j(d.name, langKey), name_ar: j(d.name, 'ar') || undefined, description: j(d.description, langKey) || undefined, order_type: String(d.order_type ?? '') }
    })
  }

  const occasions: Occasion[] = toRows(occasionsRes.data).map(o => ({
    id:      Number(o.id),
    name:    j(o.name, langKey),
    name_ar: j(o.name, 'ar') || undefined,
  }))

  return { talent: xTalent(t, lang, userMap, { prices }), occasions, addons }
}

export async function getTalentArticle(lang: string, slug: string, title: string) {
  const langKey = lang === 'ar' ? 'ar' : 'en'
  const { data: talentRow } = await supabase.from('talents').select('id').ilike('slug', `%"${langKey}":"${slug}"%`).maybeSingle()
  if (!talentRow) return { article: null }

  const { data, error } = await supabase
    .from('articles').select('id, title, slug, content, image, created_at')
    .eq('talent_id', toRow(talentRow).id).eq('slug', title).eq('is_published', 1).maybeSingle()

  if (error || !data) return { article: null }
  return { article: xArticle(toRow(data), lang) }
}

export async function getTalentFilmography(slug: string) {
  try {
    const { data: talentRow } = await supabase.from('talents').select('id').ilike('slug', `%"en":"${slug}"%`).maybeSingle()
    if (!talentRow) return { filmography: [] }
    const { data, error } = await supabase.from('talent_filmography').select('*').eq('talent_id', toRow(talentRow).id).order('year', { ascending: false })
    if (error) return { filmography: [] }
    return { filmography: toRows(data) }
  } catch { return { filmography: [] } }
}

export async function getTalentSpot(_lang: string, _slug: string, _type: string) {
  // talent_spots table does not exist in this schema
  return { spot: null }
}

export async function getTalentInsight(lang: string, slug: string, type: string) {
  try {
    const langKey = lang === 'ar' ? 'ar' : 'en'
    const { data: talentRow } = await supabase.from('talents').select('id').ilike('slug', `%"${langKey}":"${slug}"%`).maybeSingle()
    if (!talentRow) return { insights: [] }
    const { data } = await supabase.from('insights').select('*').eq('talent_id', toRow(talentRow).id).eq('type', type).order('created_at', { ascending: false })
    return { insights: toRows(data) }
  } catch { return { insights: [] } }
}

export async function getLatestArticles() {
  const { data, error } = await supabase
    .from('articles').select('id, title, slug, content, image, created_at')
    .eq('is_published', 1).order('created_at', { ascending: false }).limit(10)
  if (error) return []
  return toRows(data).map(r => xArticle(r))
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('id, name, slug').is('parent_id', null).order('id')
  if (error) return []
  return toRows(data).map(xCategory)
}

export async function getCategory(slug: string) {
  const { data: catRow, error } = await supabase.from('categories').select('id, name, slug').eq('slug', slug).maybeSingle()
  if (error || !catRow) return { category: null, talents: [] }

  const category = xCategory(toRow(catRow))

  const { data: links } = await supabase.from('talents_category').select('talent_id').eq('category_id', category.id)
  const ids = toRows(links).map(r => Number(r.talent_id)).filter(Boolean)
  if (!ids.length) return { category, talents: [] }

  const { data: talentRows } = await supabase
    .from('talents').select(TALENT_SELECT)
    .in('id', ids).eq('is_published', 1).eq('is_active', 1).order('id', { ascending: false })

  const rows    = toRows(talentRows)
  const userMap = await userMapFromTalents(rows)
  const talents = rows.map(r => xTalent(r, 'en', userMap))
  return { category: { ...category, talents_count: talents.length }, talents }
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<Page | null> {
  const { data, error } = await supabase.from('pages').select('id, slug, title, content').eq('slug', slug).maybeSingle()
  if (error || !data) return null
  const p = toRow(data)
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
    .from('videos').select('id, code, url, thumbnail, is_active, created_at, talent_id')
    .eq('code', code).eq('is_active', 1).maybeSingle()

  if (error || !data) return { video: null, talent: null }

  const v = toRow(data)
  let talent: Talent | null = null

  if (v.talent_id) {
    const { data: tRow } = await supabase.from('talents').select(TALENT_SELECT).eq('id', Number(v.talent_id)).maybeSingle()
    if (tRow) {
      const t      = toRow(tRow)
      const userMap = await fetchUserMap([Number(t.user_id)])
      talent = xTalent(t, 'en', userMap)
    }
  }

  return {
    video: { id: Number(v.id), code: String(v.code), url: (v.url as string) ?? '', thumbnail: (v.thumbnail as string) ?? '', is_public: true, created_at: String(v.created_at ?? '') },
    talent,
  }
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function getOnboardingData() {
  const [catRes, occRes] = await Promise.allSettled([
    supabase.from('categories').select('id, name, slug').is('parent_id', null).order('id'),
    supabase.from('occasions').select('id, name').order('id'),
  ])

  return {
    categories: sd(catRes).map(xCategory),
    occasions:  sd(occRes).map(o => ({ id: Number(o.id), name: j(o.name, 'en'), name_ar: j(o.name, 'ar') || undefined })),
  }
}
