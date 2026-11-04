import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Send, X } from 'lucide-react';
import type { Product } from '../types';
import { getSector, whatsappLink } from '../config/site';
import { productImages, youtubeEmbed, youtubeId } from '../lib/media';
import { useLang } from '../hooks/useLang';
import { SafeImg, WhatsAppIcon } from './ui';

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { t, product: tr } = useLang();
  const { name, description, specifications } = tr(product);
  const images = useMemo(() => productImages(product), [product]);
  const [index, setIndex] = useState(0);
  const videoId = youtubeId(product.video);
  const sector = getSector(product.category);
  const dialogRef = useRef<HTMLDivElement>(null);

  const specs = specifications
    .split(/\||\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Keyboard: Esc closes, arrows switch images. Lock page scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (images.length > 1 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const rtl = document.documentElement.dir === 'rtl';
        const forward = (e.key === 'ArrowRight') !== rtl;
        setIndex((i) => (i + (forward ? 1 : -1) + images.length) % images.length);
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [images.length, onClose]);

  const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full max-w-5xl animate-fade-up overflow-y-auto rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl focus-visible:ring-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute end-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur hover:bg-white"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-2">
          {/* Gallery */}
          <div className="bg-slate-50 p-3 sm:p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              <SafeImg key={images[index]} src={images[index]} alt={name} className="h-full w-full object-contain" />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute start-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
                    aria-label={t('common.previous')}
                  >
                    <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute end-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
                    aria-label={t('common.next')}
                  >
                    <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                  </button>
                  <span className="chip absolute bottom-3 start-3 bg-ink/70 text-white" dir="ltr">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-24 ${
                      i === index ? 'border-brand-500' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`${i + 1}`}
                  >
                    <SafeImg src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col p-6 sm:p-8">
            {sector && (
              <span className={`chip mb-4 w-fit bg-gradient-to-r ${sector.gradient} text-white`}>
                <sector.icon className="h-3.5 w-3.5" aria-hidden />
                {t(`sectors.${sector.id}.title`)}
              </span>
            )}
            <h2 id="product-title" className="pe-10 text-2xl font-extrabold sm:text-3xl">
              {name}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              {product.price && <p className="text-2xl font-extrabold text-brand-700">{product.price}</p>}
              {product.origin && (
                <p className="flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-brand-600" aria-hidden />
                  {t('common.origin')}: <strong className="font-semibold text-ink">{product.origin}</strong>
                </p>
              )}
            </div>

            {description && <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-700">{description}</p>}

            {specs.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('common.specifications')}</h3>
                <dl className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 text-sm">
                  {specs.map((line, i) => {
                    const [k, ...v] = line.split(/[:：]/);
                    return v.length ? (
                      <div key={i} className="grid grid-cols-5 gap-3 px-4 py-2.5 odd:bg-slate-50/70">
                        <dt className="col-span-2 font-semibold text-slate-600">{k.trim()}</dt>
                        <dd className="col-span-3 text-ink">{v.join(':').trim()}</dd>
                      </div>
                    ) : (
                      <div key={i} className="px-4 py-2.5 text-ink odd:bg-slate-50/70">
                        {line}
                      </div>
                    );
                  })}
                </dl>
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href={whatsappLink(t('common.whatsappProduct', { name }))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp btn-lg"
              >
                <WhatsAppIcon />
                {t('common.inquireWhatsapp')}
              </a>
              <Link
                to={`/contact?subject=products&about=${encodeURIComponent(name)}`}
                onClick={onClose}
                className="btn-outline btn-lg"
              >
                <Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden />
                {t('common.sendInquiry')}
              </Link>
            </div>
          </div>
        </div>

        {videoId && (
          <div className="border-t border-slate-100 p-3 sm:p-5">
            <h3 className="mb-3 px-1 text-sm font-bold uppercase tracking-wide text-slate-500">{t('common.video')}</h3>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black">
              <iframe
                src={youtubeEmbed(videoId)}
                title={name}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
