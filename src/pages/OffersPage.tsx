import { BadgePercent } from 'lucide-react';
import type { Offer } from '../types';
import { whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';
import { useTable } from '../hooks/useTable';
import OfferCard from '../components/OfferCard';
import { PageHero, Reveal, Skeleton, WhatsAppIcon } from '../components/ui';

export default function OffersPage() {
  const { t } = useLang();
  useSeo(t('offers.title'), t('offers.text'));
  const { rows, loading } = useTable<Offer>('offers', { orderBy: 'sort_order', ascending: true });

  return (
    <>
      <PageHero title={t('offers.title')} text={t('offers.text')} />
      <section className="section bg-slate-50">
        <div className="container">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[440px] rounded-3xl" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="card mx-auto max-w-lg p-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-amber-500">
                <BadgePercent className="h-8 w-8" aria-hidden />
              </span>
              <p className="mt-5 text-lg font-semibold text-ink">{t('offers.empty')}</p>
              <a href={whatsappLink(t('common.whatsappGeneral'))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6">
                <WhatsAppIcon />
                {t('common.chatWhatsapp')}
              </a>
            </div>
          ) : rows.length === 1 ? (
            <Reveal className="mx-auto max-w-5xl">
              <OfferCard offer={rows[0]} layout="wide" />
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((o, i) => (
                <Reveal key={o.id} delay={(i % 3) * 80} className="h-full">
                  <OfferCard offer={o} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
