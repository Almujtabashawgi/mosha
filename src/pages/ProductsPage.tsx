import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import type { Product } from '../types';
import { SECTORS } from '../config/site';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';
import { useTable } from '../hooks/useTable';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { PageHero, Skeleton } from '../components/ui';

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟ]/g, '') // Arabic diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

export default function ProductsPage() {
  const { t } = useLang();
  useSeo(t('products.title'), t('products.text'));

  const { rows, loading, error } = useTable<Product>('products');
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const query = params.get('q') ?? '';
  const [selected, setSelected] = useState<Product | null>(null);

  const update = (key: 'category' | 'q', value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((p) => (map[p.category] = (map[p.category] ?? 0) + 1));
    return map;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return rows.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      const hay = normalize(
        [p.name, p.namear, p.description, p.descriptionar, p.origin, p.specifications, p.specificationsar].filter(Boolean).join(' '),
      );
      return hay.includes(q);
    });
  }, [rows, category, query]);

  const chip = (active: boolean) =>
    `inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
      active ? 'border-brand-600 bg-brand-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700'
    }`;

  return (
    <>
      <PageHero title={t('products.title')} text={t('products.text')} />

      <section className="bg-slate-50 pb-20">
        {/* Filters */}
        <div className="sticky top-[72px] z-30 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-xl">
          <div className="container flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
            <label className="relative block lg:w-80">
              <span className="sr-only">{t('common.search')}</span>
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => update('q', e.target.value)}
                placeholder={t('products.searchPlaceholder')}
                className="input ps-12 pe-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => update('q', '')}
                  className="absolute end-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
                  aria-label={t('common.close')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
              <button type="button" onClick={() => update('category', 'all')} className={chip(category === 'all')}>
                {t('common.all')}
                <span className="opacity-70">{rows.length}</span>
              </button>
              {SECTORS.map((s) => (
                <button key={s.id} type="button" onClick={() => update('category', s.id)} className={chip(category === s.id)}>
                  <s.icon className="h-4 w-4" aria-hidden />
                  {t(`sectors.${s.id}.name`)}
                  {counts[s.id] ? <span className="opacity-70">{counts[s.id]}</span> : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container pt-8">
          {!loading && (
            <p className="mb-5 text-sm font-medium text-slate-500" aria-live="polite">
              {filtered.length} {t('products.countLabel')}
            </p>
          )}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[360px]" />
              ))}
            </div>
          ) : error ? (
            <p className="py-16 text-center text-slate-500">{t('common.loadError')}</p>
          ) : filtered.length === 0 ? (
            <div className="card mx-auto max-w-md p-10 text-center">
              <Search className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
              <p className="mt-4 font-semibold text-ink">{query ? t('common.noResults') : t('products.empty')}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
