import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Languages, Menu, X } from 'lucide-react';
import { SITE, whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { LogoMark, WhatsAppIcon } from './ui';

const NAV = [
  { to: '/', key: 'home' },
  { to: '/products', key: 'products' },
  { to: '/offers', key: 'offers' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
] as const;

export default function Header() {
  const { t, lang, toggle } = useLang();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation / Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
        {lang === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
      </a>
      <div className="container flex h-[72px] items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={SITE.name[lang]}>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${solid ? 'bg-brand-50' : 'bg-white'} transition`}>
            <LogoMark className="h-10 w-10" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className={`block truncate text-base font-extrabold sm:text-lg ${solid ? 'text-ink' : 'text-white'}`}>
              {lang === 'ar' ? 'موشا للتجارة والاستثمار' : 'Mosha Trading & Investment'}
            </span>
            <span className={`hidden truncate text-xs sm:block ${solid ? 'text-slate-500' : 'text-slate-300'}`}>
              {lang === 'ar' ? 'شريكك الموثوق في التجارة العالمية' : 'Your trusted partner in global trade'}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative rounded-lg px-3.5 py-2 text-[15px] font-semibold transition ${
                  isActive
                    ? solid
                      ? 'text-brand-700'
                      : 'text-white'
                    : solid
                      ? 'text-slate-600 hover:text-ink'
                      : 'text-slate-300 hover:text-white'
                } ${isActive ? 'after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-500' : ''}`
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className={`inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-bold transition ${
              solid ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label={t('common.language')}
            title={t('common.language')}
          >
            <Languages className="h-5 w-5" aria-hidden />
            <span>{t('common.languageShort')}</span>
          </button>

          <a
            href={whatsappLink(t('common.whatsappGeneral'))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp hidden md:inline-flex"
          >
            <WhatsAppIcon />
            <span>{t('common.whatsapp')}</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`grid h-11 w-11 place-items-center rounded-xl lg:hidden ${
              solid ? 'text-ink hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('common.menu')}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <nav className="container flex flex-col gap-1 py-6" aria-label="Mobile">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3.5 text-lg font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'}`
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
            <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6">
              <a href={whatsappLink(t('common.whatsappGeneral'))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
                <WhatsAppIcon />
                {t('common.chatWhatsapp')}
              </a>
              <a href={`tel:${SITE.contact.phoneHref}`} className="btn-outline btn-lg" dir="ltr">
                {SITE.contact.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
