import { useState } from 'react';
import { Mail, MailOpen, Phone, Trash2 } from 'lucide-react';
import type { ContactMessage } from '../../types';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../hooks/useLang';
import { useTable } from '../../hooks/useTable';
import { Spinner, WhatsAppIcon } from '../../components/ui';
import { errorText, useToast } from './shared';

export default function MessagesInbox() {
  const { t, lang } = useLang();
  const toast = useToast();
  const { rows, loading, error, refresh } = useTable<ContactMessage>('messages');
  const [open, setOpen] = useState<number | null>(null);

  const setRead = async (m: ContactMessage, is_read: boolean) => {
    const { error } = await supabase.from('messages').update({ is_read }).eq('id', m.id);
    if (error) toast('error', errorText(t, error.message));
    else refresh();
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm(t('admin.confirmDelete', { name: m.name }))) return;
    const { error } = await supabase.from('messages').delete().eq('id', m.id);
    if (error) toast('error', errorText(t, error.message));
    else {
      toast('ok', t('admin.deleted'));
      refresh();
    }
  };

  const expand = (m: ContactMessage) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.is_read) setRead(m, true);
  };

  const fmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', { dateStyle: 'medium', timeStyle: 'short' });
  const unread = rows.filter((m) => !m.is_read).length;

  if (loading)
    return (
      <div className="grid place-items-center py-20 text-brand-600">
        <Spinner className="h-8 w-8" />
      </div>
    );
  if (error) return <p className="card p-6 text-red-600">{errorText(t, error)}</p>;
  if (rows.length === 0)
    return (
      <div className="card p-10 text-center text-slate-500">
        <Mail className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-4">{t('admin.messagesEmpty')}</p>
        <p className="mt-2 text-xs">{t('admin.messagesSetup')}</p>
      </div>
    );

  return (
    <div>
      {unread > 0 && (
        <p className="mb-4 text-sm font-semibold text-brand-700">
          {unread} {t('admin.unread')}
        </p>
      )}
      <ul className="grid gap-3">
        {rows.map((m) => (
          <li key={m.id} className={`card overflow-hidden ${m.is_read ? '' : 'border-brand-300 ring-1 ring-brand-200'}`}>
            <button type="button" onClick={() => expand(m)} className="flex w-full items-start gap-4 p-4 text-start" aria-expanded={open === m.id}>
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${m.is_read ? 'bg-transparent' : 'bg-brand-500'}`} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className={`truncate ${m.is_read ? 'font-semibold' : 'font-extrabold'} text-ink`}>{m.name}</span>
                  <span className="text-xs text-slate-500">{fmt.format(new Date(m.created_at))}</span>
                </span>
                <span className="mt-0.5 block text-sm text-brand-700">{t(`contact.subjects.${m.subject}`, { defaultValue: m.subject })}</span>
                {open !== m.id && <span className="mt-1 line-clamp-1 block text-sm text-slate-500">{m.message}</span>}
              </span>
            </button>
            {open === m.id && (
              <div className="border-t border-slate-100 px-4 pb-4 ps-[2.6rem]">
                <p className="whitespace-pre-wrap py-4 leading-8 text-ink" dir="auto">
                  {m.message}
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: Mosha')}`} className="btn-primary !min-h-[40px] text-sm">
                    <Mail className="h-4 w-4" />
                    {t('admin.reply')}
                  </a>
                  {m.phone && (
                    <>
                      <a href={`https://wa.me/${m.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !min-h-[40px] text-sm">
                        <WhatsAppIcon className="h-4 w-4" />
                        {t('common.whatsapp')}
                      </a>
                      <a href={`tel:${m.phone}`} className="btn-outline !min-h-[40px] text-sm" dir="ltr">
                        <Phone className="h-4 w-4" />
                        {m.phone}
                      </a>
                    </>
                  )}
                  <span className="flex-1" />
                  <button type="button" onClick={() => setRead(m, !m.is_read)} className="btn-outline !min-h-[40px] text-sm">
                    <MailOpen className="h-4 w-4" />
                    {m.is_read ? t('admin.markUnread') : t('admin.markRead')}
                  </button>
                  <button type="button" onClick={() => remove(m)} className="btn-outline !min-h-[40px] text-sm text-red-600 hover:!border-red-300 hover:!text-red-700">
                    <Trash2 className="h-4 w-4" />
                    {t('admin.delete')}
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-500" dir="ltr">
                  {m.email}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
