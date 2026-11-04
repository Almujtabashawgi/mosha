import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import type { Offer } from '../types';
import { whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { SafeImg, WhatsAppIcon } from './ui';

function useCountdown(endsAt: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  if (!endsAt) return null;
  const diff = Math.max(0, new Date(endsAt).getTime() - now);
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function OfferCard({ offer, size = 'md' }: { offer: Offer; size?: 'md' | 'lg' }) {
  const { t, offer: tr } = useLang();
  const { title, description, badge } = tr(offer);
  const left = useCountdown(offer.ends_at);
  const fmt = (n: number) => String(n).padStart(2, '0');

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-ink text-white shadow-lift">
      <div className={`relative overflow-hidden ${size === 'lg' ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <SafeImg src={offer.image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        {badge && (
          <span className="absolute start-4 top-4 rounded-xl bg-amber-400 px-3 py-1.5 text-sm font-extrabold text-ink shadow-lg">
            {badge}
          </span>
        )}
        {left && (
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 text-xs font-semibold text-white/90">
            <Clock className="h-4 w-4 text-amber-300" aria-hidden />
            <span>{t('offers.endsIn')}</span>
            <span className="flex gap-1" dir="ltr">
              {(['d', 'h', 'm', 's'] as const).map((u) => (
                <span key={u} className="rounded-md bg-white/15 px-1.5 py-0.5 tabular-nums backdrop-blur">
                  {fmt(left[u])}
                  <span className="ms-0.5 text-white/70">{t(`offers.${u}`)}</span>
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-extrabold text-white sm:text-2xl">{title}</h3>
        {description && <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-300">{description}</p>}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
          <div>
            {offer.price_old && <p className="text-sm text-slate-400 line-through decoration-red-400/80">{offer.price_old}</p>}
            {offer.price_new && <p className="text-2xl font-extrabold text-amber-300">{offer.price_new}</p>}
          </div>
          <a
            href={whatsappLink(t('common.whatsappOffer', { name: title }))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon />
            {t('offers.order')}
          </a>
        </div>
      </div>
    </article>
  );
}
