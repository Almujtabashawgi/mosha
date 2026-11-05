import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Product } from '../types';
import { getSector, whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { WhatsAppIcon } from './ui';

export interface SlideView {
  key: string;
  image: string;
  title: string;
  subtitle?: string;
  /** Clicking the main button opens this product's details */
  product?: Product;
  /** …or navigates to this internal page */
  link?: string;
}

// Time per slide = duration of the `progress` animation in tailwind.config.js (6.5s).
// The progress bar's animationend event advances the slide, so pausing the bar pauses the slideshow.

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');
  useEffect(() => {
    const on = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return visible;
}

/**
 * Full-width homepage slideshow. Images are shown whole (never cropped — many
 * product images are posters with text) inside a large frame, over a blurred
 * copy that tints the whole hero with the picture's colours.
 */
export default function HeroSlider({ slides, onOpenProduct }: { slides: SlideView[]; onOpenProduct: (p: Product) => void }) {
  const { t, isAr } = useLang();
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Only mount images that were shown or are about to be shown (keeps phones fast)
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0, 1]));
  const reduced = usePrefersReducedMotion();
  const pageVisible = usePageVisible();
  const swipeStart = useRef<number | null>(null);
  // The outgoing slide keeps its zoom while it fades out (no visual jump)
  const [prev, setPrev] = useState<number | null>(null);
  const lastIndex = useRef(index);
  useEffect(() => {
    if (lastIndex.current !== index) {
      setPrev(lastIndex.current);
      lastIndex.current = index;
    }
  }, [index]);

  const running = count > 1 && !reduced && !userPaused && !hovered && !focused && pageVisible;

  // Keep the index valid when slides change live from the dashboard
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    setMounted((prev) => {
      const next = new Set(prev);
      next.add(index);
      next.add((index + 1) % Math.max(count, 1));
      return next.size === prev.size ? prev : next;
    });
  }, [index, count]);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count]);

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) < 50) return;
    // In RTL the "next" slide is to the left, so swiping right moves forward
    go((dx < 0) !== isAr ? 1 : -1);
  };

  if (count === 0) return null;
  const slide = slides[Math.min(index, count - 1)];
  const sector = slide.product ? getSector(slide.product.category) : undefined;
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      className="relative isolate overflow-hidden bg-ink text-white"
      aria-roledescription="carousel"
      aria-label={t('hero.carousel')}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Ambient background: a blurred copy of the current picture */}
      {slides.map((s, i) =>
        mounted.has(i) ? (
          <img
            key={`bg-${s.key}`}
            src={s.image}
            alt=""
            aria-hidden
            decoding="async"
            className={`absolute inset-0 -z-20 h-full w-full scale-125 object-cover blur-3xl transition-opacity duration-1000 ${
              i === index ? 'opacity-40' : 'opacity-0'
            }`}
          />
        ) : null,
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/75 to-ink" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />

      <h1 className="sr-only">
        {t('hero.badge')} — {t('hero.title')}
      </h1>

      <div className="container grid items-center gap-8 pb-28 pt-24 sm:pt-28 lg:min-h-[min(100svh,980px)] lg:grid-cols-12 lg:gap-14 lg:pb-36 lg:pt-28">
        {/* ---------- Picture ---------- */}
        <div className="lg:order-2 lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.75)]">
            {slides.map((s, i) =>
              mounted.has(i) ? (
                <div
                  key={s.key}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t('hero.slideOf', { n: i + 1, total: count })}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={s.image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />
                  <img
                    src={s.image}
                    alt={s.title}
                    decoding="async"
                    className={`relative h-full w-full object-contain ${(i === index || i === prev) && !reduced ? 'animate-kenburns' : ''}`}
                  />
                </div>
              ) : null,
            )}
          </div>
        </div>

        {/* ---------- Text ---------- */}
        <div className="lg:order-1 lg:col-span-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-brand-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgb(52_211_153/0.2)]" />
            {t('hero.badge')}
          </p>

          <div key={slide.key} className="mt-6 animate-fade-up lg:min-h-[250px]" aria-live={running ? 'off' : 'polite'}>
            {sector && (
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-200">
                <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${sector.gradient}`}>
                  <sector.icon className="h-4 w-4 text-white" aria-hidden />
                </span>
                {t(`sectors.${sector.id}.name`)}
              </span>
            )}
            <h2 className="line-clamp-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{slide.title}</h2>
            {slide.subtitle && <p className="mt-4 line-clamp-2 max-w-xl text-base leading-8 text-slate-300 sm:line-clamp-3 sm:text-lg">{slide.subtitle}</p>}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {slide.product ? (
              <button type="button" onClick={() => onOpenProduct(slide.product!)} className="btn-primary btn-lg">
                {t('hero.details')}
                <Arrow className="h-5 w-5" aria-hidden />
              </button>
            ) : (
              <Link to={slide.link && slide.link.startsWith('/') ? slide.link : '/products'} className="btn-primary btn-lg">
                {slide.link && slide.link !== '/products' ? t('hero.learnMore') : t('common.exploreProducts')}
                <Arrow className="h-5 w-5" aria-hidden />
              </Link>
            )}
            <a
              href={whatsappLink(slide.product ? t('common.whatsappProduct', { name: slide.title }) : t('common.whatsappGeneral'))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-light btn-lg"
            >
              <WhatsAppIcon />
              {slide.product ? t('common.inquireWhatsapp') : t('common.chatWhatsapp')}
            </a>
          </div>

          {/* ---------- Controls ---------- */}
          {count > 1 && (
            <div className="mt-8 flex items-center gap-2 sm:mt-10 sm:gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
                aria-label={t('common.previous')}
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>

              <span className="shrink-0 text-sm font-bold tabular-nums text-white/80" dir="ltr">
                {pad(index + 1)}
                <span className="text-white/40"> / {pad(count)}</span>
              </span>

              <div className="flex flex-1 gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => goTo(i)}
                    className="flex h-8 flex-1 items-center"
                    aria-label={t('hero.slideOf', { n: i + 1, total: count })}
                    aria-current={i === index ? 'true' : undefined}
                  >
                    <span className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
                      <span
                        className={`absolute inset-0 origin-left rounded-full bg-white rtl:origin-right ${
                          i < index || (i === index && reduced) ? '' : i === index ? 'animate-progress' : 'scale-x-0'
                        }`}
                        style={i === index && !reduced ? { animationPlayState: running ? 'running' : 'paused' } : undefined}
                        onAnimationEnd={i === index ? () => go(1) : undefined}
                      />
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
                aria-label={t('common.next')}
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>

              {!reduced && (
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label={userPaused ? t('hero.play') : t('hero.pause')}
                  title={userPaused ? t('hero.play') : t('hero.pause')}
                >
                  {userPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Placeholder with the same size while data loads, so the page doesn't jump. */
export function HeroSliderSkeleton() {
  return (
    <section className="relative isolate overflow-hidden bg-ink" aria-hidden>
      <div className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
      <div className="container grid items-center gap-8 pb-28 pt-24 sm:pt-28 lg:min-h-[min(100svh,980px)] lg:grid-cols-12 lg:gap-14 lg:pb-36 lg:pt-28">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-white/5 lg:order-2 lg:col-span-7" />
        <div className="space-y-5 lg:order-1 lg:col-span-5">
          <div className="h-8 w-64 animate-pulse rounded-full bg-white/10" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
          <div className="h-12 w-3/4 animate-pulse rounded-xl bg-white/10" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-white/5" />
        </div>
      </div>
    </section>
  );
}
