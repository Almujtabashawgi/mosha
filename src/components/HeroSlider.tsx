import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Product } from '../types';
import { getSector, whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { WhatsAppIcon } from './ui';

export type Focus = 'center' | 'top' | 'bottom' | 'left' | 'right';

/** Which part of the picture stays visible when it is cropped to fill the screen. */
export const FOCUS_CLASS: Record<Focus, string> = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
};

export interface SlideView {
  key: string;
  image: string;
  title: string;
  subtitle?: string;
  focus?: Focus;
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

/** True once the rest of the page has slid over the cover. */
function useCovered() {
  const [covered, setCovered] = useState(false);
  useEffect(() => {
    const on = () => setCovered(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return covered;
}

/** Scroll so the content below the cover sits right under the fixed header. */
export const scrollPastHero = () => window.scrollTo({ top: window.innerHeight - 72, behavior: 'smooth' });

/**
 * Full-screen cover slideshow: each picture fills the screen, the text sits on top
 * of it, and the rest of the page slides up over it when scrolling.
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
  const covered = useCovered();
  const swipeStart = useRef<number | null>(null);
  // The outgoing slide keeps its zoom while it fades out (no visual jump)
  const [prev, setPrev] = useState<number | null>(null);
  const lastIndex = useRef(index);

  const running = count > 1 && !reduced && !userPaused && !hovered && !focused && pageVisible && !covered;

  useEffect(() => {
    if (lastIndex.current !== index) {
      setPrev(lastIndex.current);
      lastIndex.current = index;
    }
  }, [index]);

  // Keep the index valid when slides change live from the dashboard
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    setMounted((old) => {
      const next = new Set(old);
      next.add(index);
      next.add((index + 1) % Math.max(count, 1));
      return next.size === old.size ? old : next;
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
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink text-white"
      aria-roledescription="carousel"
      aria-label={t('hero.carousel')}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* ---------- Pictures (full screen) ---------- */}
      {slides.map((s, i) =>
        mounted.has(i) ? (
          <div
            key={s.key}
            role="group"
            aria-roledescription="slide"
            aria-label={t('hero.slideOf', { n: i + 1, total: count })}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={s.image}
              alt={s.title}
              decoding="async"
              className={`h-full w-full object-cover ${FOCUS_CLASS[s.focus ?? 'center']} ${
                (i === index || i === prev) && !reduced ? 'animate-kenburns' : ''
              }`}
            />
          </div>
        ) : null,
      )}

      {/* ---------- Shading so the text is always readable ---------- */}
      {/* Shading only where the text is: the rest of the picture keeps its real colours */}
      {/* phones: text sits at the bottom over a dark fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-ink via-ink/75 to-transparent sm:hidden" />
      {/* tablets & computers: text on the side over a side fade */}
      <div className="pointer-events-none absolute inset-y-0 start-0 hidden w-full from-ink/85 via-ink/35 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l sm:block lg:w-3/4" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-ink/60 to-transparent sm:block" />
      {/* under the transparent menu bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/60 to-transparent" />

      <h1 className="sr-only">
        {t('hero.badge')} — {t('hero.title')}
      </h1>

      {/* ---------- Text on top of the picture ---------- */}
      <div className="container relative z-10 flex h-full flex-col justify-end pb-24 pt-24 sm:justify-center sm:pb-28">
        <div className="max-w-2xl [text-shadow:0_2px_24px_rgb(6_18_27/0.55)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-ink/30 px-4 py-1.5 text-sm font-medium text-brand-100 backdrop-blur-md [text-shadow:none]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgb(52_211_153/0.25)]" />
            {t('hero.badge')}
          </p>

          <div key={slide.key} className="mt-6 animate-fade-up" aria-live={running ? 'off' : 'polite'}>
            {sector && (
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-100">
                <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${sector.gradient}`}>
                  <sector.icon className="h-4 w-4 text-white" aria-hidden />
                </span>
                {t(`sectors.${sector.id}.name`)}
              </span>
            )}
            <h2 className="line-clamp-3 text-4xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-7xl">{slide.title}</h2>
            {slide.subtitle && (
              <p className="mt-5 line-clamp-2 max-w-xl text-base leading-8 text-slate-100/90 sm:line-clamp-3 sm:text-xl sm:leading-9">{slide.subtitle}</p>
            )}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {slide.product ? (
              <button type="button" onClick={() => onOpenProduct(slide.product!)} className="btn-primary btn-lg [text-shadow:none]">
                {t('hero.details')}
                <Arrow className="h-5 w-5" aria-hidden />
              </button>
            ) : (
              <Link to={slide.link && slide.link.startsWith('/') ? slide.link : '/products'} className="btn-primary btn-lg [text-shadow:none]">
                {slide.link && slide.link !== '/products' ? t('hero.learnMore') : t('common.exploreProducts')}
                <Arrow className="h-5 w-5" aria-hidden />
              </Link>
            )}
            <a
              href={whatsappLink(slide.product ? t('common.whatsappProduct', { name: slide.title }) : t('common.whatsappGeneral'))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-light btn-lg [text-shadow:none]"
            >
              <WhatsAppIcon />
              {slide.product ? t('common.inquireWhatsapp') : t('common.chatWhatsapp')}
            </a>
          </div>

          {/* ---------- Slide controls ---------- */}
          {count > 1 && (
            <div className="mt-10 flex max-w-md items-center gap-2 sm:gap-3 [text-shadow:none]">
              <span className="shrink-0 text-sm font-bold tabular-nums text-white/90" dir="ltr">
                {pad(index + 1)}
                <span className="text-white/50"> / {pad(count)}</span>
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
                    <span className="relative h-1 w-full overflow-hidden rounded-full bg-white/30">
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
                onClick={() => go(-1)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-ink/20 text-white backdrop-blur transition hover:bg-white/15"
                aria-label={t('common.previous')}
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-ink/20 text-white backdrop-blur transition hover:bg-white/15"
                aria-label={t('common.next')}
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/15 hover:text-white"
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

      <ScrollCue />
    </section>
  );
}

/** "Discover more" arrow at the bottom of the cover. */
export function ScrollCue() {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={scrollPastHero}
      className="group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold text-white/80 transition hover:text-white"
    >
      <span className="hidden sm:block">{t('hero.scroll')}</span>
      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-ink/20 backdrop-blur">
        <ChevronDown className="h-5 w-5 animate-bounce [animation-duration:2s]" aria-hidden />
      </span>
    </button>
  );
}

/** Full-screen placeholder while data loads, so the page doesn't jump. */
export function HeroSliderSkeleton() {
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink" aria-hidden>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-brand-950/60 via-ink to-ink" />
      <div className="container relative flex h-full flex-col justify-center gap-5 pb-28 pt-24">
        <div className="h-8 w-64 rounded-full bg-white/10" />
        <div className="h-14 w-full max-w-xl rounded-xl bg-white/10" />
        <div className="h-14 w-3/4 max-w-lg rounded-xl bg-white/10" />
        <div className="h-16 w-full max-w-md rounded-xl bg-white/5" />
      </div>
    </section>
  );
}
