import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { SECTORS, SITE, whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { LogoMark, WhatsAppIcon } from './ui';

export default function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  const socials = [
    { href: SITE.social.facebook, icon: Facebook, label: 'Facebook' },
    { href: SITE.social.instagram, icon: Instagram, label: 'Instagram' },
    { href: SITE.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: SITE.social.x, icon: Twitter, label: 'X' },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-slate-300">
      <div className="container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white">
              <LogoMark className="h-11 w-11" />
            </span>
            <span className="text-lg font-extrabold text-white">{SITE.name[lang]}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{t('footer.text')}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={whatsappLink(t('common.whatsappGeneral'))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <WhatsAppIcon />
              {t('common.chatWhatsapp')}
            </a>
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-brand-600 hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="lg:col-span-2">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">{t('footer.links')}</h3>
          <ul className="space-y-3 text-sm">
            {(['home', 'products', 'offers', 'about', 'contact'] as const).map((k) => (
              <li key={k}>
                <Link to={k === 'home' ? '/' : `/${k}`} className="text-slate-400 transition hover:text-white">
                  {t(`nav.${k}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sectors */}
        <div className="lg:col-span-3">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">{t('footer.sectors')}</h3>
          <ul className="space-y-3 text-sm">
            {SECTORS.map((s) => (
              <li key={s.id}>
                <Link to={`/sector/${s.id}`} className="text-slate-400 transition hover:text-white">
                  {t(`sectors.${s.id}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">{t('footer.contact')}</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden />
              <span className="text-slate-400">{SITE.contact.address[lang]}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden />
              <a href={`tel:${SITE.contact.phoneHref}`} className="text-slate-400 hover:text-white" dir="ltr">
                {SITE.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden />
              <a href={`mailto:${SITE.contact.email}`} className="break-all text-slate-400 hover:text-white">
                {SITE.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-500 sm:flex-row">
          <p>
            © {year} {SITE.name[lang]}. {t('footer.rights')}
          </p>
          <Link to="/privacy" className="hover:text-white">
            {t('footer.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
