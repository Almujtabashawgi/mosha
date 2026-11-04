import { useTranslation } from 'react-i18next';
import type { Offer, Product } from '../types';

/** Current language helpers + bilingual field pickers. */
export function useLang() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'ar').startsWith('ar') ? 'ar' : 'en';
  const isAr = lang === 'ar';

  /** Pick the Arabic or English value, falling back to the other if empty. */
  const pick = (en?: string | null, ar?: string | null) => (isAr ? ar || en : en || ar) || '';

  const product = (p: Product) => ({
    name: pick(p.name, p.namear),
    description: pick(p.description, p.descriptionar),
    specifications: pick(p.specifications, p.specificationsar),
  });

  const offer = (o: Offer) => ({
    title: pick(o.title, o.title_ar),
    description: pick(o.description, o.description_ar),
    badge: pick(o.badge, o.badge_ar),
  });

  const toggle = () => i18n.changeLanguage(isAr ? 'en' : 'ar');

  return { t, i18n, lang, isAr, pick, product, offer, toggle } as const;
}
