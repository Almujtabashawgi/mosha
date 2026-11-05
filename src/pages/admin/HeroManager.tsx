import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Info, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import type { HeroSlide, Product } from '../../types';
import { supabase } from '../../lib/supabase';
import { SECTORS } from '../../config/site';
import { useLang } from '../../hooks/useLang';
import { useTable } from '../../hooks/useTable';
import { SafeImg, Spinner } from '../../components/ui';
import { errorText, Field, FieldGroup, ImageUploader, Modal, useToast } from './shared';

type Form = {
  image: string;
  title: string;
  title_ar: string;
  subtitle: string;
  subtitle_ar: string;
  product_id: string; // '' = none (select value)
  link: string;
  is_active: boolean;
};

const EMPTY: Form = { image: '', title: '', title_ar: '', subtitle: '', subtitle_ar: '', product_id: '', link: '', is_active: true };

const isMissingTable = (msg: string) => /relation .* does not exist|Could not find the table|schema cache/i.test(msg);

export default function HeroManager() {
  const { t, pick, product: tr } = useLang();
  const toast = useToast();
  const { rows, loading, error, refresh } = useTable<HeroSlide>('hero_slides', { orderBy: 'sort_order', ascending: true });
  const products = useTable<Product>('products');
  const byId = useMemo(() => new Map(products.rows.map((p) => [String(p.id), p])), [products.rows]);
  const [editing, setEditing] = useState<HeroSlide | 'new' | null>(null);
  const [busy, setBusy] = useState(false);

  const titleOf = (s: HeroSlide) => {
    const p = s.product_id != null ? byId.get(String(s.product_id)) : undefined;
    return pick(s.title, s.title_ar) || (p ? tr(p).name : '—');
  };

  const remove = async (s: HeroSlide) => {
    if (!window.confirm(t('admin.confirmDelete', { name: titleOf(s) }))) return;
    const { error } = await supabase.from('hero_slides').delete().eq('id', s.id);
    if (error) toast('error', errorText(t, error.message));
    else {
      toast('ok', t('admin.deleted'));
      refresh();
    }
  };

  const toggle = async (s: HeroSlide) => {
    const { error } = await supabase.from('hero_slides').update({ is_active: !s.is_active }).eq('id', s.id);
    if (error) toast('error', errorText(t, error.message));
    else refresh();
  };

  // Swap positions with the neighbour above/below
  const move = async (i: number, dir: -1 | 1) => {
    const a = rows[i];
    const b = rows[i + dir];
    if (!a || !b || busy) return;
    setBusy(true);
    // Make sure orders are distinct even if two slides share the same number
    const aOrder = b.sort_order === a.sort_order ? a.sort_order + dir : b.sort_order;
    const bOrder = a.sort_order;
    const r1 = await supabase.from('hero_slides').update({ sort_order: aOrder }).eq('id', a.id);
    const r2 = await supabase.from('hero_slides').update({ sort_order: bOrder }).eq('id', b.id);
    setBusy(false);
    const err = r1.error || r2.error;
    if (err) toast('error', errorText(t, err.message));
    refresh();
  };

  if (error && isMissingTable(error)) {
    return (
      <div className="card flex items-start gap-3 border-amber-200 bg-amber-50 p-6 text-amber-900">
        <Info className="mt-0.5 h-5 w-5 shrink-0" />
        <p>{t('admin.heroSetupNeeded')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-xl font-extrabold">{t('admin.heroTitle')}</h2>
          <p className="mt-1 text-sm leading-7 text-slate-600">{t('admin.heroHint')}</p>
        </div>
        <button type="button" onClick={() => setEditing('new')} className="btn-primary shrink-0">
          <Plus className="h-5 w-5" />
          {t('admin.addSlide')}
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-brand-600">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <p className="card p-6 text-red-600">{errorText(t, error)}</p>
      ) : rows.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-semibold text-ink">{t('admin.autoMode')}</p>
          <button type="button" onClick={() => setEditing('new')} className="btn-outline mt-5">
            <Plus className="h-5 w-5" />
            {t('admin.addSlide')}
          </button>
        </div>
      ) : (
        <ol className="grid gap-3">
          {rows.map((s, i) => {
            const p = s.product_id != null ? byId.get(String(s.product_id)) : undefined;
            return (
              <li key={s.id} className={`card flex items-center gap-3 p-3 sm:gap-4 ${s.is_active ? '' : 'opacity-60'}`}>
                <span className="w-6 shrink-0 text-center text-sm font-bold text-slate-400" dir="ltr">
                  {i + 1}
                </span>
                <SafeImg src={s.image || p?.image || undefined} alt="" className="aspect-[4/3] w-24 shrink-0 rounded-xl bg-slate-100 object-contain sm:w-32" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{titleOf(s)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`chip ${s.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {s.is_active ? t('admin.status.live') : t('admin.status.hidden')}
                    </span>
                    {p && (
                      <span className="chip bg-brand-50 text-brand-700">
                        <Package className="h-3 w-3" />
                        {tr(p).name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  <IconBtn label={t('admin.moveUp')} onClick={() => move(i, -1)} disabled={i === 0 || busy}>
                    <ArrowUp className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label={t('admin.moveDown')} onClick={() => move(i, 1)} disabled={i === rows.length - 1 || busy}>
                    <ArrowDown className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label={s.is_active ? t('admin.status.hidden') : t('admin.status.live')} onClick={() => toggle(s)}>
                    {s.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </IconBtn>
                  <IconBtn label={t('admin.edit')} onClick={() => setEditing(s)} className="text-brand-700 hover:bg-brand-50">
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label={t('admin.delete')} onClick={() => remove(s)} className="text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {editing && (
        <SlideForm
          initial={editing === 'new' ? null : editing}
          products={products.rows}
          nextOrder={(rows.length ? rows[rows.length - 1].sort_order : 0) + 1}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  className = 'text-slate-600 hover:bg-slate-100',
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 place-items-center rounded-lg transition disabled:opacity-30 ${className}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function SlideForm({
  initial,
  products,
  nextOrder,
  onClose,
  onSaved,
}: {
  initial: HeroSlide | null;
  products: Product[];
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, product: tr } = useLang();
  const toast = useToast();
  const [f, setF] = useState<Form>(() =>
    initial
      ? {
          image: initial.image,
          title: initial.title,
          title_ar: initial.title_ar,
          subtitle: initial.subtitle,
          subtitle_ar: initial.subtitle_ar,
          product_id: initial.product_id != null ? String(initial.product_id) : '',
          link: initial.link,
          is_active: initial.is_active,
        }
      : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));

  const linkOptions = [
    { value: '', label: t('admin.linkNone') },
    { value: '/offers', label: t('nav.offers') },
    { value: '/contact', label: t('nav.contact') },
    { value: '/about', label: t('nav.about') },
    ...SECTORS.map((s) => ({ value: `/sector/${s.id}`, label: t(`sectors.${s.id}.title`) })),
  ];

  // Picking a product fills empty fields from it
  const chooseProduct = (id: string) => {
    const p = products.find((x) => String(x.id) === id);
    setF((x) => ({
      ...x,
      product_id: id,
      image: x.image || p?.image || '',
      title: x.title || p?.name || '',
      title_ar: x.title_ar || p?.namear || '',
      subtitle: x.subtitle || (p?.description ?? '').slice(0, 400),
      subtitle_ar: x.subtitle_ar || (p?.descriptionar ?? '').slice(0, 400),
    }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.image) return toast('error', t('admin.imageRequired'));
    if (!f.product_id && !f.title.trim() && !f.title_ar.trim()) return toast('error', t('admin.slideTitleRequired'));
    setSaving(true);
    const payload = {
      image: f.image,
      title: f.title.trim(),
      title_ar: f.title_ar.trim(),
      subtitle: f.subtitle.trim().slice(0, 400),
      subtitle_ar: f.subtitle_ar.trim().slice(0, 400),
      product_id: f.product_id ? Number(f.product_id) : null,
      link: f.product_id ? '' : f.link,
      is_active: f.is_active,
      ...(initial ? {} : { sort_order: nextOrder }),
    };
    const { error } = initial
      ? await supabase.from('hero_slides').update(payload).eq('id', initial.id)
      : await supabase.from('hero_slides').insert([payload]);
    setSaving(false);
    if (error) return toast('error', isMissingTable(error.message) ? t('admin.heroSetupNeeded') : errorText(t, error.message));
    toast('ok', t('admin.saved'));
    onSaved();
  };

  return (
    <Modal
      title={initial ? t('admin.editSlide') : t('admin.addSlide')}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-outline">
            {t('admin.cancel')}
          </button>
          <button type="submit" form="slide-form" disabled={saving} className="btn-primary min-w-[140px]">
            {saving && <Spinner />}
            {saving ? t('admin.saving') : t('admin.save')}
          </button>
        </>
      }
    >
      <form id="slide-form" onSubmit={submit} className="space-y-5">
        <Field label={t('admin.linkProduct')} hint={t('admin.linkProductHint')}>
          <select className="input" value={f.product_id} onChange={(e) => chooseProduct(e.target.value)}>
            <option value="">{t('admin.noProduct')}</option>
            {products.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {tr(p).name}
              </option>
            ))}
          </select>
        </Field>

        <FieldGroup title={t('admin.mainImage')}>
          <div className="sm:col-span-2">
            <ImageUploader folder="hero" value={f.image ? [f.image] : []} onChange={(u) => setF((x) => ({ ...x, image: u[0] ?? '' }))} />
          </div>
        </FieldGroup>

        <FieldGroup title={t('admin.slideTitle')}>
          <Field label={t('admin.arabic')}>
            <input className="input" dir="rtl" value={f.title_ar} onChange={set('title_ar')} maxLength={160} />
          </Field>
          <Field label={t('admin.english')}>
            <input className="input" dir="ltr" value={f.title} onChange={set('title')} maxLength={160} />
          </Field>
        </FieldGroup>

        <FieldGroup title={t('admin.subtitle')}>
          <Field label={t('admin.arabic')}>
            <textarea className="input" dir="rtl" rows={3} value={f.subtitle_ar} onChange={set('subtitle_ar')} maxLength={400} />
          </Field>
          <Field label={t('admin.english')}>
            <textarea className="input" dir="ltr" rows={3} value={f.subtitle} onChange={set('subtitle')} maxLength={400} />
          </Field>
        </FieldGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          {!f.product_id && (
            <Field label={t('admin.linkTo')}>
              <select className="input" value={f.link} onChange={set('link')}>
                {linkOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 px-4 py-3">
            <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={f.is_active} onChange={(e) => setF((x) => ({ ...x, is_active: e.target.checked }))} />
            <span className="text-sm font-semibold text-ink">{t('admin.active')}</span>
          </label>
        </div>
      </form>
    </Modal>
  );
}
