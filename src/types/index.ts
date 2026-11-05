/** Row in the `products` table (column names match the database exactly). */
export interface Product {
  id: number | string;
  name: string;
  namear?: string | null;
  description?: string | null;
  descriptionar?: string | null;
  category: string;
  price?: string | null;
  image?: string | null;
  images?: string[] | string | null;
  video?: string | null;
  specifications?: string | null;
  specificationsar?: string | null;
  origin?: string | null;
  created_at?: string;
}

/** Row in the `offers` table. */
export interface Offer {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  image: string;
  badge: string;
  badge_ar: string;
  price_old: string;
  price_new: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

/** Row in the `messages` table. */
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/** Row in the `hero_slides` table (homepage slider). */
export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  title_ar: string;
  subtitle: string;
  subtitle_ar: string;
  product_id: number | null;
  link: string;
  /** Part of the picture kept visible when cropped (column added by 003_hero_focus.sql) */
  focus?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
