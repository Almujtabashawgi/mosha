import { useMemo, useState, type FormEvent } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { Product } from '../../types';
import { supabase } from '../../lib/supabase';
import { getSector, SECTORS } from '../../config/site';
import { productImages, youtubeId } from '../../lib/media';
import { useLang } from '../../hooks/useLang';
import { useTable } from '../../hooks/useTable';
import { SafeImg, Spinner } from '../../components/ui';
import { errorText, Field, FieldGroup, ImageUploader, Modal, useToast } from './shared';

type Form = {
  name: string;
  namear: string;
  description: string;
  descriptionar: string;
  specifications: string;
  specificationsar: string;
  category: string;
  price: string;
  origin: string;
  image: string;
  images: string[];
  video: string;
};

const EMPTY: Form = {
  name: '',
  namear: '',
  description: '',
  descriptionar: '',
  specifications: '',
  specificationsar: '',
  category: SECTORS[0].id,
  price: '',
  origin: '',
  image: '',
  images: [],
  video: '',
};

const toForm = (p: Product): Form => {
  const all = productImages(p);
  return {
    name: p.name ?? '',
    namear: p.namear ?? '',
    description: p.description ?? '',
    descriptionar: p.descriptionar ?? '',
    specifications: p.specifications ?? '',
    specificationsar: p.specificationsar ?? '',
    category: p.category || SECTORS[0].id,
    price: p.price ?? '',
    origin: p.origin ?? '',
    image: p.image ?? all[0] ?? '',
    images: all.filter((u) => u !== (p.image ?? all[0])),
    video: p.video ?? '',
  };
};

export default function ProductsManager() {
  const { t, product: tr } = useLang();
  const toast = useToast();
  const { rows, loading, error, refresh } = useTable<Product>('products');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter(
      (p) =>
        (cat === 'all' || p.category === cat) &&
        (!s || [p.name, p.namear, p.origin].filter(Boolean).join(' ').toLowerCase().includes(s)),
    );
  }, [rows, q, cat]);

  const remove = async (p: Product) => {
    if (!window.confirm(t('admin.confirmDelete', { name: tr(p).name }))) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) toast('error', errorText(t, error.message));
    else {
      toast('ok', t('admin.deleted'));
      refresh();
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('admin.searchPlaceholder')} className="input ps-12" type="search" />
        </label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input sm:w-64">
          <option value="all">{t('common.all')}</option>
          {SECTORS.map((s) => (
            <option key={s.id} value={s.id}>
              {t(`sectors.${s.id}.title`)}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setEditing('new')} className="btn-primary">
          <Plus className="h-5 w-5" />
          {t('admin.addProduct')}
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-brand-600">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <p className="card p-6 text-red-600">{errorText(t, error)}</p>
      ) : list.length === 0 ? (
        <p className="card p-10 text-center text-slate-500">{t('admin.empty')}</p>
      ) : (
        <ul className="grid gap-3">
          {list.map((p) => {
            const { name } = tr(p);
            const sector = getSector(p.category);
            return (
              <li key={p.id} className="card flex items-center gap-4 p-3 sm:p-4">
                <SafeImg src={p.image ?? undefined} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                    {sector && <span className="chip bg-brand-50 text-brand-700">{t(`sectors.${sector.id}.title`)}</span>}
                    {p.price && <span className="font-semibold text-ink">{p.price}</span>}
                    {p.origin && <span>{p.origin}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => setEditing(p)} className="grid h-10 w-10 place-items-center rounded-xl text-brand-700 hover:bg-brand-50" aria-label={t('admin.edit')} title={t('admin.edit')}>
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => remove(p)} className="grid h-10 w-10 place-items-center rounded-xl text-red-600 hover:bg-red-50" aria-label={t('admin.delete')} title={t('admin.delete')}>
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <ProductForm
          initial={editing === 'new' ? null : editing}
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

function ProductForm({ initial, onClose, onSaved }: { initial: Product | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useLang();
  const toast = useToast();
  const [f, setF] = useState<Form>(() => (initial ? toForm(initial) : EMPTY));
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const videoBad = !!f.video.trim() && !youtubeId(f.video);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.image) return toast('error', t('admin.imageRequired'));
    if (videoBad) return toast('error', t('admin.videoInvalid'));
    setSaving(true);
    const payload = {
      name: f.name.trim(),
      namear: f.namear.trim(),
      description: f.description.trim(),
      descriptionar: f.descriptionar.trim(),
      specifications: f.specifications.trim(),
      specificationsar: f.specificationsar.trim(),
      category: f.category,
      price: f.price.trim(),
      origin: f.origin.trim(),
      image: f.image,
      images: f.images,
      video: f.video.trim(),
    };
    const { error } = initial
      ? await supabase.from('products').update(payload).eq('id', initial.id)
      : await supabase.from('products').insert([payload]);
    setSaving(false);
    if (error) return toast('error', errorText(t, error.message));
    toast('ok', t('admin.saved'));
    onSaved();
  };

  return (
    <Modal
      title={initial ? t('admin.editProduct') : t('admin.addProduct')}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-outline">
            {t('admin.cancel')}
          </button>
          <button type="submit" form="product-form" disabled={saving} className="btn-primary min-w-[140px]">
            {saving && <Spinner />}
            {saving ? t('admin.saving') : t('admin.save')}
          </button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} className="space-y-5">
        <FieldGroup title={t('admin.name')}>
          <Field label={t('admin.arabic')}>
            <input className="input" dir="rtl" value={f.namear} onChange={set('namear')} required maxLength={160} />
          </Field>
          <Field label={t('admin.english')}>
            <input className="input" dir="ltr" value={f.name} onChange={set('name')} required maxLength={160} />
          </Field>
        </FieldGroup>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t('admin.category')}>
            <select className="input" value={f.category} onChange={set('category')} required>
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(`sectors.${s.id}.title`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('admin.price')}>
            <input className="input" value={f.price} onChange={set('price')} placeholder={t('admin.pricePlaceholder')} maxLength={60} />
          </Field>
          <Field label={t('admin.origin')}>
            <input className="input" value={f.origin} onChange={set('origin')} maxLength={60} />
          </Field>
        </div>

        <FieldGroup title={t('admin.mainImage')}>
          <div className="sm:col-span-2">
            <ImageUploader folder="products" value={f.image ? [f.image] : []} onChange={(u) => setF((x) => ({ ...x, image: u[0] ?? '' }))} />
          </div>
        </FieldGroup>

        <FieldGroup title={t('admin.gallery')}>
          <div className="sm:col-span-2">
            <ImageUploader
              folder="products"
              multiple
              value={f.images}
              onChange={(u) => setF((x) => ({ ...x, images: u }))}
              onMakeMain={(url) =>
                setF((x) => ({ ...x, image: url, images: [...x.images.filter((i) => i !== url), ...(x.image ? [x.image] : [])] }))
              }
            />
          </div>
        </FieldGroup>

        <FieldGroup title={t('admin.description')}>
          <Field label={t('admin.arabic')}>
            <textarea className="input" dir="rtl" rows={4} value={f.descriptionar} onChange={set('descriptionar')} required maxLength={3000} />
          </Field>
          <Field label={t('admin.english')}>
            <textarea className="input" dir="ltr" rows={4} value={f.description} onChange={set('description')} required maxLength={3000} />
          </Field>
        </FieldGroup>

        <FieldGroup title={t('admin.specifications')}>
          <Field label={t('admin.arabic')} hint={t('admin.specsHint')}>
            <textarea className="input" dir="rtl" rows={3} value={f.specificationsar} onChange={set('specificationsar')} maxLength={3000} />
          </Field>
          <Field label={t('admin.english')}>
            <textarea className="input" dir="ltr" rows={3} value={f.specifications} onChange={set('specifications')} maxLength={3000} />
          </Field>
        </FieldGroup>

        <Field label={t('admin.video')} hint={videoBad ? t('admin.videoInvalid') : undefined}>
          <input className="input" dir="ltr" type="url" value={f.video} onChange={set('video')} placeholder="https://youtube.com/watch?v=…" aria-invalid={videoBad || undefined} />
        </Field>
      </form>
    </Modal>
  );
}
