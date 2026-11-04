import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../config/site';
import { useLang } from './useLang';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/** Per-page <title>, description, canonical and social tags. */
export function useSeo(title?: string, description?: string, opts: { noindex?: boolean } = {}) {
  const { pathname } = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    const brand = SITE.name[lang];
    const fullTitle = title ? `${title} | ${SITE.shortName[lang]}` : brand;
    document.title = fullTitle;
    const url = SITE.url + (pathname === '/' ? '/' : pathname);

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:locale', lang === 'ar' ? 'ar_SD' : 'en_US');
    setMeta('name', 'robots', opts.noindex ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, pathname, lang, opts.noindex]);
}
