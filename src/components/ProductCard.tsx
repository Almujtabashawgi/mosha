import { ArrowUpRight, MapPin } from 'lucide-react';
import type { Product } from '../types';
import { getSector } from '../config/site';
import { useLang } from '../hooks/useLang';
import { SafeImg } from './ui';

export default function ProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const { t, product: tr } = useLang();
  const { name, description } = tr(product);
  const sector = getSector(product.category);

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="flex h-full flex-col text-start focus-visible:ring-inset"
        aria-label={`${t('common.viewDetails')}: ${name}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {/* Blurred copy fills the frame; the real image is shown whole (no cropped text) */}
          {product.image && (
            <img src={product.image} alt="" aria-hidden loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
          )}
          <SafeImg
            src={product.image ?? undefined}
            alt={name}
            className="relative h-full w-full object-contain transition duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          {sector && (
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
              <span className={`grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br ${sector.gradient} text-white`}>
                <sector.icon className="h-3 w-3" aria-hidden />
              </span>
              {t(`sectors.${sector.id}.name`)}
            </span>
          )}
          <h3 className="line-clamp-2 text-lg font-bold text-ink transition group-hover:text-brand-700">{name}</h3>
          {description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{description}</p>}

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div className="min-w-0">
              {product.price ? (
                <p className="truncate text-lg font-extrabold text-brand-700">{product.price}</p>
              ) : (
                <p className="text-sm font-semibold text-slate-500">{t('common.sendInquiry')}</p>
              )}
              {product.origin && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {product.origin}
                </p>
              )}
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
              <ArrowUpRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
