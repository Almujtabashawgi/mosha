import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Offer } from '../../types';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../hooks/useLang';
import { useTable } from '../../hooks/useTable';
import OfferCard from '../../components/OfferCard';
import { SafeImg, Spinner } from '../../components/ui';
import { errorText, Field, FieldGroup, ImageUploader, Modal, useToast } from './shared';

type Form = Omit<Offer, 'id' | 'created_at' | 'starts_at' | 'ends_at'> & { starts_at: string; ends_at: string };

const EMPTY: Form = {
  title: '',
  title_ar: '',
  description: '',
  description_ar: '',
  image: '',
  badge: '',
  badge_ar: '',
  price_old: '',
  price_new: '',
  starts_at: '',
  ends_at: '',
  is_active: true,
  sort_order: 0,
};

// <input type="datetime-local"> works in local time without timezone
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null);

export function offerStatus(o: Pick<Offer, 'is_active' | 'starts_at' | 'ends_at'>) {
  const now = Date.now();
  if (!o.is_active) return 'hidden' as const;
  if (o.ends_at && new Date(o.ends_at).getTime() <= now) return 'expired' as const;
  if (o.starts_at && new Date(o.starts_at).getTime() > now) return 'scheduled' as const;
  return 'live' as const;
}

const STATUS_STYLE = {
  live: 'bg-emerald-50 text-emerald-700',
  scheduled: 'bg-sky-50 text-sky-700',
  expired: 'bg-slate-100 text-slate-500',
  hidden: 'bg-amber-50 text-amber-700',
};

export default function OffersManager() {
  const { t, offer: tr } = useLang();
  const toast = useToast();
  const { rows, loading, error, refresh } = useTable<Offer>('offers', { orderBy: 'sort_order', ascending: true });
  const [editing, setEditing] = useState<Offer | 'new' | null>(null);

  const remove = async (o: Offer) => {
    if (!window.confirm(t('admin.confirmDelete', { name: tr(o).title }))) return;
    const { error } = await supabase.from('offers').delete().eq('id', o.id);
    if (error) toast('error', errorText(t, error.message));
    else {
      toast('ok', t('admin.deleted'));
      refresh();
    }
  };

  const toggleActive = async (o: Offer) => {
    const { error } = await supabase.from('offers').update({ is_active: !o.is_active }).eq('id', o.id);
    if (error) toast('error', errorText(t, error.message));
    else refresh();
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button type="button" onClick={() => setEditing('new')} className="btn-primary">
          <Plus className="h-5 w-5" />
          {t('admin.addOffer')}
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-brand-600">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <p className="card p-6 text-red-600">{errorText(t, error)}</p>
      ) : rows.length === 0 ? (
        <p className="card p-10 text-center text-slate-500">{t('admin.empty')}</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((o) => {
            const st = offerStatus(o);
            return (
              <li key={o.id} className="card overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <SafeImg src={o.image} alt="" className="h-full w-full object-cover" />
                  <span className={`chip absolute start-3 top-3 ${STATUS_STYLE[st]}`}>{t(`admin.status.${st}`)}</span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-ink">{tr(o).title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {[o.price_old && <s key="o">{o.price_old}</s>, o.price_new && <b key="n" className="text-brand-700"> {o.price_new}</b>]}
                  </p>
                  <div className="mt-3 flex gap-1">
                    <button type="button" onClick={() => setEditing(o)} className="btn-outline flex-1 !min-h-[40px] !py-1.5 text-sm">
                      <Pencil className="h-4 w-4" />
                      {t('admin.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(o)}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                      title={o.is_active ? t('admin.status.hidden') : t('admin.status.live')}
                      aria-label={o.is_active ? t('admin.status.hidden') : t('admin.status.live')}
                    >
                      {o.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => remove(o)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-red-600 hover:bg-red-50" aria-label={t('admin.delete')} title={t('admin.delete')}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <OfferForm
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

function OfferForm({ initial, onClose, onSaved }: { initial: Offer | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useLang();
  const toast = useToast();
  const [f, setF] = useState<Form>(() =>
    initial ? { ...initial, starts_at: toLocalInput(initial.starts_at), ends_at: toLocalInput(initial.ends_at) } : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.image) return toast('error', t('admin.imageRequired'));
    setSaving(true);
    const payload = {
      title: f.title.trim(),
      title_ar: f.title_ar.trim(),
      description: f.description.trim(),
      description_ar: f.description_ar.trim(),
      image: f.image,
      badge: f.badge.trim(),
      badge_ar: f.badge_ar.trim(),
      price_old: f.price_old.trim(),
      price_new: f.price_new.trim(),
      starts_at: fromLocalInput(f.starts_at),
      ends_at: fromLocalInput(f.ends_at),
      is_active: f.is_active,
      sort_order: Number(f.sort_order) || 0,
    };
    const { error } = initial ? await supabase.from('offers').update(payload).eq('id', initial.id) : await supabase.from('offers').insert([payload]);
    setSaving(false);
    if (error) return toast('error', errorText(t, error.message));
    toast('ok', t('admin.saved'));
    onSaved();
  };

  // Live preview of the card as visitors will see it
  const preview: Offer = {
    ...f,
    id: 0,
    created_at: '',
    starts_at: fromLocalInput(f.starts_at),
    ends_at: fromLocalInput(f.ends_at),
    title: f.title || f.title_ar || '—',
    title_ar: f.title_ar || f.title || '—',
  };

  return (
    <Modal
      title={initial ? t('admin.editOffer') : t('admin.addOffer')}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-outline">
            {t('admin.cancel')}
          </button>
          <button type="submit" form="offer-form" disabled={saving} className="btn-primary min-w-[140px]">
            {saving && <Spinner />}
            {saving ? t('admin.saving') : t('admin.save')}
          </button>
        </>
      }
    >
      <form id="offer-form" onSubmit={submit} className="space-y-5">
        <FieldGroup title={t('admin.mainImage')}>
          <div className="sm:col-span-2">
            <ImageUploader folder="offers" value={f.image ? [f.image] : []} onChange={(u) => setF((x) => ({ ...x, image: u[0] ?? '' }))} />
          </div>
        </FieldGroup>

        <FieldGroup title={t('admin.offerTitle')}>
          <Field label={t('admin.arabic')}>
            <input className="input" dir="rtl" value={f.title_ar} onChange={set('title_ar')} required maxLength={160} />
          </Field>
          <Field label={t('admin.english')}>
            <input className="input" dir="ltr" value={f.title} onChange={set('title')} required maxLength={160} />
          </Field>
        </FieldGroup>

        <FieldGroup title={t('admin.description')}>
          <Field label={t('admin.arabic')}>
            <textarea className="input" dir="rtl" rows={3} value={f.description_ar} onChange={set('description_ar')} maxLength={2000} />
          </Field>
          <Field label={t('admin.english')}>
            <textarea className="input" dir="ltr" rows={3} value={f.description} onChange={set('description')} maxLength={2000} />
          </Field>
        </FieldGroup>

        <FieldGroup title={t('admin.badge')}>
          <Field label={t('admin.arabic')}>
            <input className="input" dir="rtl" value={f.badge_ar} onChange={set('badge_ar')} maxLength={40} placeholder="خصم 20%" />
          </Field>
          <Field label={t('admin.english')}>
            <input className="input" dir="ltr" value={f.badge} onChange={set('badge')} maxLength={40} placeholder="-20%" />
          </Field>
        </FieldGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('admin.priceOld')}>
            <input className="input" value={f.price_old} onChange={set('price_old')} maxLength={60} />
          </Field>
          <Field label={t('admin.priceNew')}>
            <input className="input" value={f.price_new} onChange={set('price_new')} maxLength={60} />
          </Field>
          <Field label={t('admin.startsAt')}>
            <input className="input" type="datetime-local" value={f.starts_at} onChange={set('starts_at')} />
          </Field>
          <Field label={t('admin.endsAt')}>
            <input className="input" type="datetime-local" value={f.ends_at} onChange={set('ends_at')} min={f.starts_at || undefined} />
          </Field>
          <Field label={t('admin.sortOrder')}>
            <input className="input" type="number" value={f.sort_order} onChange={(e) => setF((x) => ({ ...x, sort_order: Number(e.target.value) }))} />
          </Field>
          <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 px-4 py-3">
            <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={f.is_active} onChange={(e) => setF((x) => ({ ...x, is_active: e.target.checked }))} />
            <span className="text-sm font-semibold text-ink">{t('admin.active')}</span>
          </label>
        </div>

        {f.image && (
          <div className="mx-auto max-w-sm pt-2">
            <OfferCard offer={preview} />
          </div>
        )}
      </form>
    </Modal>
  );
}
