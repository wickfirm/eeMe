// ─── Talent ──────────────────────────────────────────────────────────────────

export interface Talent {
  id: number
  slug: string
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  image?: string
  cover_image?: string
  is_available: boolean
  is_verified: boolean
  categories?: Category[]
  prices?: TalentPrice[]
  platforms?: TalentPlatform[]
  social?: TalentSocial[]
}

export interface TalentPrice {
  id: number
  type: number
  price: number
  currency: string
  delivery_days?: number
}

export interface TalentPlatform {
  id: number
  platform_id: number
  url: string
  embed_id?: string
  platform?: SocialMedia
}

export interface TalentSocial {
  id: number
  social_media_id: number
  followers?: number
  following?: number
  posts?: number
  engagement_rate?: number
  social_media?: SocialMedia
}

export interface TalentFilmography {
  id: number
  title: string
  title_ar?: string
  year?: number
  type?: string
  role?: string
  image?: string
  cast?: FilmographyCast[]
}

export interface FilmographyCast {
  id: number
  name: string
  role?: string
  image?: string
}

export interface TalentArticle {
  id: number
  title: string
  title_ar?: string
  slug: string
  body?: string
  image?: string
  created_at: string
  talent?: Talent
}

export interface TalentVideo {
  id: number
  code: string
  url?: string
  thumbnail?: string
  is_public: boolean
  created_at: string
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: number
  name: string
  name_ar?: string
  slug: string
  image?: string
  talents_count?: number
}

// ─── Social Media ────────────────────────────────────────────────────────────

export interface SocialMedia {
  id: number
  name: string
  icon?: string
  color?: string
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrderRequest {
  id: number
  code: string
  sender: string
  recipient: string
  occasion_id?: number
  price: number
  currency: string
  status: number
  payment_method: number
  message?: string
  created_at: string
  talent?: Talent
  video?: TalentVideo
}

export interface Occasion {
  id: number
  name: string
  name_ar?: string
}

export interface PromoCode {
  id: number
  code: string
  discount: number
  discount_type: string
}

// ─── Agency ──────────────────────────────────────────────────────────────────

export interface Agency {
  id: number
  name: string
  logo?: string
  primary_color?: string
}

// ─── Page ────────────────────────────────────────────────────────────────────

export interface Page {
  id: number
  title: string
  title_ar?: string
  body?: string
  body_ar?: string
  slug?: string
}

// ─── Charity ─────────────────────────────────────────────────────────────────

export interface Charity {
  id: number
  name: string
  name_ar?: string
  logo?: string
  url?: string
}

// ─── Home Data ───────────────────────────────────────────────────────────────

export interface HomeData {
  talents?: Talent[]
  categories?: Category[]
  articles?: TalentArticle[]
  page?: Page
  agency?: Agency | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://storage.googleapis.com/omneeyat_gcs'

export const ORDER_TYPES = {
  VIDEO: 1,
  BUSINESS: 2,
  CAMPAIGN: 3,
} as const

export const SOCIAL_IDS = {
  INSTAGRAM: 3,
  YOUTUBE: 6,
  TIKTOK: 5,
  YOUTUBE_PLATFORM_EMBED: 2,
  YOUTUBE_PLATFORM: 5,
} as const

export const ORDER_STATUS = {
  PENDING: 1,
  SUCCESS: 3,
  CANCELLED: -2,
} as const

export const PAYMENT_METHODS: Record<number, string> = {
  0: 'Western Union',
  1: 'Credit Card',
  2: 'PayPal',
  3: 'Free',
  4: 'Via WhatsApp',
}
