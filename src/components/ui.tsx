import { useEffect, useRef, useState, type ElementType, type ImgHTMLAttributes, type ReactNode } from 'react';
import { ImageOff, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.png';

/* ---------------------------- Reveal on scroll ---------------------------- */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------- Section heading ---------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'center',
  action,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: 'center' | 'start';
  action?: ReactNode;
}) {
  if (align === 'start') {
    return (
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="heading">{title}</h2>
          {text && <p className="lead mt-3">{text}</p>}
        </div>
        {action}
      </div>
    );
  }
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      {eyebrow && <p className="eyebrow mb-3 justify-center">{eyebrow}</p>}
      <h2 className="heading">{title}</h2>
      {text && <p className="lead mt-4">{text}</p>}
    </div>
  );
}

/* ---------------------------- Page hero (inner pages) ---------------------------- */
export function PageHero({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-16 pt-32 text-white sm:pb-20 sm:pt-36">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute -top-40 start-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl rtl:translate-x-1/2" />
      <div className="container text-center">
        <h1 className="animate-fade-up text-3xl font-extrabold text-white sm:text-5xl">{title}</h1>
        {text && (
          <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-base text-slate-300 [animation-delay:120ms] sm:text-lg">
            {text}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------------------------- Image with graceful fallback ---------------------------- */
export function SafeImg({ src, alt, className = '', ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 ${className}`}>
        <ImageOff className="h-8 w-8" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}

/* ---------------------------- Logo ---------------------------- */
export function LogoMark({ className = 'h-11 w-11' }: { className?: string }) {
  // The source PNG has wide margins; object-cover crops to the globe.
  return <img src={logo} alt="" aria-hidden className={`object-cover ${className}`} width={44} height={44} />;
}

/* ---------------------------- Spinner / page loader ---------------------------- */
export function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

/* ---------------------------- WhatsApp glyph ---------------------------- */
export function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return <MessageCircle className={className} aria-hidden strokeWidth={2.2} />;
}
