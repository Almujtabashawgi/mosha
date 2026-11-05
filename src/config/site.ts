import {
  HardHat,
  Stethoscope,
  Sprout,
  Pickaxe,
  Zap,
  Ship,
  Truck,
  type LucideIcon,
} from 'lucide-react';

/**
 * ✏️  Company details — edit here and the whole site updates.
 */
export const SITE = {
  url: 'https://www.moshaltd.com',
  name: {
    en: 'Mosha for Trading & Investment Co. Ltd.',
    ar: 'شركة موشا للتجارة والاستثمار المحدودة',
  },
  shortName: { en: 'Mosha', ar: 'موشا' },
  contact: {
    email: 'info@moshaltd.com',
    phone: '+249 901 388 888',
    phoneHref: '+249901388888',
    /** International format without + or spaces, used for wa.me links */
    whatsapp: '249901343333',
    whatsappDisplay: '+249 901 343 333',
    address: { en: 'Alengaz Street, Bahri, Khartoum, Sudan', ar: 'شارع الإنقاذ، بحري، الخرطوم، السودان' },
    hours: { en: 'Sunday – Thursday: 8:00 AM – 6:00 PM', ar: 'الأحد – الخميس: 8:00 صباحاً – 6:00 مساءً' },
    mapQuery: 'Bahri, Khartoum North, Sudan',
  },
  /** Leave a link empty ('') to hide its icon */
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
  },
} as const;

export type SectorId =
  | 'engineering'
  | 'medical-supplies'
  | 'agriculture'
  | 'mining'
  | 'energy'
  | 'import-export'
  | 'heavy-machinery';

export interface Sector {
  id: SectorId;
  icon: LucideIcon;
  /** Tailwind gradient classes for the icon tile */
  gradient: string;
}

/** Sectors double as product categories. Texts live in src/i18n (sectors.<id>.*) */
export const SECTORS: Sector[] = [
  { id: 'heavy-machinery', icon: Truck, gradient: 'from-amber-500 to-orange-600' },
  { id: 'engineering', icon: HardHat, gradient: 'from-brand-500 to-brand-700' },
  { id: 'medical-supplies', icon: Stethoscope, gradient: 'from-sky-500 to-blue-700' },
  { id: 'energy', icon: Zap, gradient: 'from-yellow-400 to-amber-600' },
  { id: 'agriculture', icon: Sprout, gradient: 'from-emerald-500 to-green-700' },
  { id: 'mining', icon: Pickaxe, gradient: 'from-slate-500 to-slate-800' },
  { id: 'import-export', icon: Ship, gradient: 'from-cyan-500 to-teal-700' },
];

export const getSector = (id?: string | null) => SECTORS.find((s) => s.id === id);

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SITE.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
