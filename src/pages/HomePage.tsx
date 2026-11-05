import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, Globe, Headset, ShieldCheck, Truck, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide, Offer, Product } from '../types';
import { SECTORS, whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';
import { useTable } from '../hooks/useTable';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import OfferCard from '../components/OfferCard';
import HeroSlider, { HeroSliderSkeleton, type SlideView } from '../components/HeroSlider';
import { LogoMark, Reveal, SectionHeading, Skeleton, WhatsAppIcon } from '../components/ui';

export default function HomePage() {
  const { t, isAr, pick, product: tr } = useLang();
  useSeo(undefined, t('hero.text'));

  const products = useTable<Product>('products');
  const offers = useTable<Offer>('offers', { orderBy: 'sort_order', ascending: true });
  const [selected, setSelected] = useState<Product | null>(null);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // Homepage slideshow: slides managed in the dashboard, otherwise the latest products
  const hero = useTable<HeroSlide>('hero_slides', { orderBy: 'sort_order', ascending: true });
  const heroLoading = hero.loading || (products.loading && hero.rows.length === 0);
  const slides = useMemo<SlideView[]>(() => {
    const byId = new Map(products.rows.map((p) => [String(p.id), p]));
    const custom = hero.rows
      .map((s): SlideView | null => {
        const product = s.product_id != null ? byId.get(String(s.product_id)) : undefined;
        const image = s.image || product?.image || '';
        const title = pick(s.title, s.title_ar) || (product ? tr(product).name : '');
        if (!image || !title) return null;
        return {
          key: `s${s.id}`,
          image,
          title,
          subtitle: pick(s.subtitle, s.subtitle_ar) || (product ? tr(product).description : ''),
          product,
          link: s.link || undefined,
        };
      })
      .filter((x): x is SlideView => x !== null);
    if (custom.length) return custom;
    return products.rows
      .filter((p) => p.image)
      .slice(0, 6)
      .map((p) => ({ key: `p${p.id}`, image: p.image!, title: tr(p).name, subtitle: tr(p).description, product: p }));
  }, [hero.rows, products.rows, isAr]);

  const stats = [
    { icon: Globe, value: '10+', label: t('stats.partners') },
    { icon: Users, value: '500+', label: t('stats.clients') },
    { icon: Award, value: '5+', label: t('stats.years') },
    { icon: Headset, value: '24/7', label: t('stats.support') },
  ];

  const why = [
    { icon: Globe, title: t('about.strengths.global'), text: t('about.strengths.globalText') },
    { icon: Truck, title: t('about.strengths.logistics'), text: t('about.strengths.logisticsText') },
    { icon: ShieldCheck, title: t('about.values.quality'), text: t('about.values.qualityText') },
    { icon: Headset, title: t('about.strengths.support'), text: t('about.strengths.supportText') },
  ];

  return (
    <>
      {/* ============================== HERO ============================== */}
      {heroLoading ? <HeroSliderSkeleton /> : slides.length > 0 ? <HeroSlider slides={slides} onOpenProduct={setSelected} /> : <BrandHero />}

      {/* ============================== STATS ============================== */}
      <section className="container relative z-10 -mt-16 sm:-mt-20">
        <div className="card grid grid-cols-2 divide-slate-100 p-2 sm:p-4 lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="flex flex-col items-center gap-2 px-3 py-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <s.icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-3xl font-extrabold text-ink sm:text-4xl" dir="ltr">
                {s.value}
              </span>
              <span className="text-sm font-medium text-slate-500">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== OFFERS ============================== */}
      {offers.rows.length > 0 && <OffersStrip offers={offers.rows} />}

      {/* ============================== SECTORS ============================== */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow={t('home.sectorsEyebrow')} title={t('home.sectorsTitle')} text={t('home.sectorsText')} />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SECTORS.map((s, i) => (
              <Reveal key={s.id} delay={(i % 4) * 70} className="h-full">
                <Link to={`/sector/${s.id}`} className="card card-hover group flex h-full flex-col p-6">
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg`}>
                    <s.icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{t(`sectors.${s.id}.title`)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{t(`sectors.${s.id}.short`)}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    {t('common.learnMore')}
                    <Arrow className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={210} className="h-full sm:col-span-2 lg:col-span-1">
              <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 p-6 text-white shadow-card">
                <div>
                  <h3 className="text-lg font-bold text-white">{t('home.ctaTitle')}</h3>
                  <p className="mt-2 text-sm leading-7 text-brand-100">{t('home.ctaText')}</p>
                </div>
                <Link to="/contact" className="btn-light mt-6 w-fit">
                  {t('common.contactUs')}
                  <Arrow className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================== LATEST PRODUCTS ============================== */}
      <section className="section bg-slate-50">
        <div className="container">
          <Reveal>
            <SectionHeading
              align="start"
              eyebrow={t('home.latestEyebrow')}
              title={t('home.latestTitle')}
              text={t('home.latestText')}
              action={
                <Link to="/products" className="btn-outline shrink-0">
                  {t('common.viewAll')}
                  <Arrow className="h-4 w-4" aria-hidden />
                </Link>
              }
            />
          </Reveal>

          {products.loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[360px]" />
              ))}
            </div>
          ) : products.rows.length === 0 ? (
            <p className="py-10 text-center text-slate-500">{products.error ? t('common.loadError') : t('products.empty')}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.rows.slice(0, 8).map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 70} className="h-full">
                  <ProductCard product={p} onOpen={setSelected} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================== WHY US ============================== */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow={t('home.whyEyebrow')} title={t('home.whyTitle')} text={t('home.whyText')} />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-slate-200 p-6 transition hover:border-brand-300 hover:bg-brand-50/40">
                  <w.icon className="h-9 w-9 text-brand-600" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="container pb-20">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="bg-grid absolute inset-0 -z-10 opacity-60" />
            <div className="absolute -bottom-24 start-1/2 -z-10 h-64 w-[600px] -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl rtl:translate-x-1/2" />
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">{t('home.ctaTitle')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">{t('home.ctaText')}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={whatsappLink(t('common.whatsappGeneral'))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
                <WhatsAppIcon />
                {t('common.chatWhatsapp')}
              </a>
              <Link to="/contact" className="btn-ghost-light btn-lg">
                {t('common.contactUs')}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* Horizontal, swipeable offers carousel */
function OffersStrip({ offers }: { offers: Offer[] }) {
  const { t, isAr } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: dir * step * (isAr ? -1 : 1), behavior: 'smooth' });
  };

  return (
    <section className="section pb-0">
      <div className="container">
        <Reveal>
          <SectionHeading
            align="start"
            eyebrow={t('home.offersEyebrow')}
            title={t('home.offersTitle')}
            text={t('home.offersText')}
            action={
              <div className="flex shrink-0 items-center gap-2">
                {offers.length > 1 && (
                  <>
                    <button type="button" onClick={() => scroll(-1)} className="btn-outline h-11 w-11 !px-0" aria-label={t('common.previous')}>
                      <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
                    </button>
                    <button type="button" onClick={() => scroll(1)} className="btn-outline h-11 w-11 !px-0" aria-label={t('common.next')}>
                      <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                    </button>
                  </>
                )}
                <Link to="/offers" className="btn-dark">
                  {t('common.viewAll')}
                  <Arrow className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            }
          />
        </Reveal>
        {offers.length === 1 ? (
          <OfferCard offer={offers[0]} layout="wide" />
        ) : (
        <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {offers.map((o) => (
            <div key={o.id} data-card className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-48px)/3)]">
              <OfferCard offer={o} />
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

/* Shown only when there are no slides and no products with images */
function BrandHero() {
  const { t, isAr } = useLang();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  return (
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="absolute -top-32 end-[-10%] -z-10 h-[520px] w-[520px] rounded-full bg-brand-500/30 blur-[120px]" />
        <div className="absolute bottom-[-20%] start-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="container grid min-h-[100svh] items-center gap-12 pb-28 pt-32 lg:grid-cols-12 lg:pb-36 lg:pt-28">
          <div className="lg:col-span-7">
            <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-brand-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgb(52_211_153/0.2)]" />
              {t('hero.badge')}
            </p>
            <h1 className="mt-6 animate-fade-up text-4xl font-extrabold leading-[1.15] text-white [animation-delay:80ms] sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 max-w-2xl animate-fade-up text-base leading-8 text-slate-300 [animation-delay:160ms] sm:text-lg">
              {t('hero.text')}
            </p>
            <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
              <Link to="/products" className="btn-primary btn-lg">
                {t('common.exploreProducts')}
                <Arrow className="h-5 w-5" aria-hidden />
              </Link>
              <a href={whatsappLink(t('common.whatsappGeneral'))} target="_blank" rel="noopener noreferrer" className="btn-ghost-light btn-lg">
                <WhatsAppIcon />
                {t('common.chatWhatsapp')}
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto hidden w-full max-w-md lg:col-span-5 lg:block">
            <div className="relative aspect-square">
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/15" />
              <div className="absolute inset-[12%] rounded-full border border-white/10" />
              <div className="absolute inset-[22%] grid place-items-center rounded-full bg-white shadow-[0_0_120px_20px_rgb(31_163_178/0.35)]">
                <LogoMark className="h-[78%] w-[78%] animate-float" />
              </div>
              {SECTORS.slice(0, 5).map((s, i) => {
                const pos = ['top-[4%] start-[18%]', 'top-[22%] end-[-4%]', 'bottom-[18%] end-[-2%]', 'bottom-[2%] start-[24%]', 'top-[46%] start-[-8%]'][i];
                return (
                  <div
                    key={s.id}
                    className={`absolute ${pos} flex animate-float items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md`}
                    style={{ animationDelay: `${i * 0.7}s` }}
                  >
                    <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${s.gradient}`}>
                      <s.icon className="h-4 w-4" aria-hidden />
                    </span>
                    {t(`sectors.${s.id}.name`)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
  );
}
