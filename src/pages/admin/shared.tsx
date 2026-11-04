import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CircleCheck, ImagePlus, Star, TriangleAlert, X } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '../../lib/supabase';
import { optimizeImage, storagePath } from '../../lib/media';
import { useLang } from '../../hooks/useLang';
import { SafeImg, Spinner } from '../../components/ui';

/* ------------------------------- Toasts ------------------------------- */
type Toast = { id: number; kind: 'ok' | 'error'; text: string };
const ToastCtx = createContext<(kind: Toast['kind'], text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-md animate-fade-up items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lift ${
              t.kind === 'ok' ? 'bg-ink text-white' : 'bg-red-600 text-white'
            }`}
          >
            {t.kind === 'ok' ? <CircleCheck className="h-5 w-5 shrink-0" /> : <TriangleAlert className="h-5 w-5 shrink-0" />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------- Modal ------------------------------- */
export function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  const { t } = useLang();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[94dvh] w-full max-w-3xl animate-fade-up flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100" aria-label={t('common.close')}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">{footer}</div>
      </div>
    </div>
  );
}

/* ------------------------------- Form fields ------------------------------- */
export function Field({ label, hint, children, className = '' }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 p-4 sm:p-5">
      <legend className="px-2 text-sm font-bold text-brand-700">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/* ------------------------------- Image upload ------------------------------- */
async function uploadOne(file: File, folder: string) {
  const blob = await optimizeImage(file);
  const path = storagePath(folder, blob);
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: blob.type || file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder,
  onMakeMain,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  folder: string;
  onMakeMain?: (url: string) => void;
}) {
  const { t } = useLang();
  const toast = useToast();
  const [busy, setBusy] = useState(0);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const current = useRef(value);
  current.current = value;

  const handle = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, multiple ? 12 : 1);
    setBusy(list.length);
    const urls: string[] = [];
    for (const f of list) {
      try {
        urls.push(await uploadOne(f, folder));
      } catch (e) {
        toast('error', t('admin.uploadFailed', { msg: (e as Error).message }));
      }
      setBusy((b) => b - 1);
    }
    if (urls.length) onChange(multiple ? [...current.current, ...urls] : urls.slice(0, 1));
    if (input.current) input.current.value = '';
  };

  return (
    <div>
      {value.length > 0 && (
        <div className={`mb-3 grid gap-3 ${multiple ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-1'}`}>
          {value.map((url) => (
            <div key={url} className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${multiple ? 'aspect-square' : 'aspect-[16/10]'}`}>
              <SafeImg src={url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-1 top-1 flex justify-between gap-1">
                {onMakeMain ? (
                  <button
                    type="button"
                    onClick={() => onMakeMain(url)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-amber-500 shadow"
                    title={t('admin.makeMain')}
                    aria-label={t('admin.makeMain')}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((v) => v !== url))}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-600 shadow"
                  title={t('admin.remove')}
                  aria-label={t('admin.remove')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(multiple || value.length === 0) && (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handle(e.dataTransfer.files);
          }}
          disabled={busy > 0}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
            drag ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
          }`}
        >
          {busy > 0 ? <Spinner className="h-6 w-6 text-brand-600" /> : <ImagePlus className="h-7 w-7 text-brand-600" />}
          <span className="text-sm font-semibold text-ink">{busy > 0 ? t('admin.uploading') : multiple ? t('admin.uploadMany') : t('admin.upload')}</span>
          <span className="text-xs text-slate-500">{t('admin.dropHint')}</span>
        </button>
      )}
      {!multiple && value.length > 0 && (
        <button type="button" onClick={() => input.current?.click()} className="text-sm font-semibold text-brand-700 hover:underline" disabled={busy > 0}>
          {busy > 0 ? t('admin.uploading') : t('admin.upload')}
        </button>
      )}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple={multiple} hidden onChange={(e) => handle(e.target.files)} />
    </div>
  );
}

/** Friendly message for Supabase errors (missing tables, RLS). */
export function errorText(t: (k: string, o?: Record<string, unknown>) => string, msg: string) {
  if (/relation .* does not exist|Could not find the table|schema cache/i.test(msg)) return t('admin.setupNeeded');
  return t('admin.failed', { msg });
}
