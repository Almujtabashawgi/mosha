import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CircleCheck } from 'lucide-react';
import type { Product } from '../types';
import { getSector, SECTORS, whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';
import { useTable } from '../hooks/useTable';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Reveal, WhatsAppIcon } from '../components/ui';
import NotFoundPage from './NotFoundPage';

export default function SectorDetails() {
  const { id } = useParams();
  const sector = getSector(id);
  const { t, i18n, isAr } = useLang();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const title = sector ? t(`sectors.${sector.id}.title`) : '';
  const desc = sector ? t(`sectors.${sector.id}.desc`) : '';
  useSeo(title || undefined, desc || undefined);

  const { rows } = useTable<Product>('products', { enabled: !!sector });
  const related = useMemo(() => rows.filter((p) => p.category === sector?.id), [rows, sector]);
  const [selected, setSelected] = useState<Product | null>(null);

  if (!sector) return <NotFoundPage />;

  const services = i18n.t(`sectors.${sector.id}.services`, { returnObjects: true }) as unknown;
  const list = Array.isArray(services) ? (services as string[]) : [];
  const Icon = sector.icon;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pb-20 pt-32 text-white sm:pt-40">
        <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className={`absolute -top-40 end-0 -z-10 h-[460px] w-[460px] rounded-full bg-gradient-to-br ${sector.gradient} opacity-30 blur-3xl`} />
        <div className="container">
          <nav className="mb-8 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">
              {t('nav.home')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-200">{title}</span>
          </nav>
          <span className={`grid h-16 w-16 animate-fade-up place-items-center rounded-2xl bg-gradient-to-br ${sector.gradient} shadow-xl`}>
            <Icon className="h-8 w-8" aria-hidden />
          </span>
          <h1 className="mt-6 animate-fade-up text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl animate-fade-up text-lg leading-8 text-slate-300">{desc}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(t('common.whatsappProduct', { name: title }))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp btn-lg"
            >
              <WhatsAppIcon />
              {t('common.chatWhatsapp')}
            </a>
            <Link to={`/products?category=${sector.id}`} className="btn-ghost-light btn-lg">
              {t('common.exploreProducts')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <h2 className="heading mb-10">{t('sectorPage.services')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s, i) => (
              <Reveal key={s} delay={i * 60}>
                <div className="card flex items-center gap-4 p-5">
                  <CircleCheck className="h-6 w-6 shrink-0 text-brand-600" aria-hidden />
                  <span className="font-semibold text-ink">{s}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="heading">{t('sectorPage.products')}</h2>
              <Link to={`/products?category=${sector.id}`} className="btn-outline shrink-0">
                {t('common.viewAll')}
                <Arrow className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setSelected} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other sectors */}
      <section className="section">
        <div className="container">
          <h2 className="heading mb-8">{t('sectorPage.otherSectors')}</h2>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {SECTORS.filter((s) => s.id !== sector.id).map((s) => (
              <Link key={s.id} to={`/sector/${s.id}`} className="card card-hover flex shrink-0 items-center gap-3 px-4 py-3">
                <span className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${s.gradient} text-white`}>
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-semibold text-ink">{t(`sectors.${s.id}.title`)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
