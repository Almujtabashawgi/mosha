import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircleCheck, Clock, Mail, MapPin, Phone, Send, TriangleAlert } from 'lucide-react';
import { SITE, whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';
import { PageHero, Reveal, Spinner, WhatsAppIcon } from '../components/ui';

const SUBJECTS = ['general', 'products', 'offers', 'partnership', 'other'] as const;
type Fields = { name: string; email: string; phone: string; subject: string; message: string };
const EMPTY: Fields = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const { t, lang } = useLang();
  useSeo(t('contact.title'), t('contact.text'));
  const [params] = useSearchParams();

  const [form, setForm] = useState<Fields>(() => {
    const subject = params.get('subject') ?? '';
    const about = params.get('about') ?? '';
    return {
      ...EMPTY,
      subject: (SUBJECTS as readonly string[]).includes(subject) ? subject : '',
      message: about ? `${lang === 'ar' ? 'أرغب في الاستفسار عن' : 'I would like to inquire about'}: ${about.slice(0, 150)}\n\n` : '',
    };
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'rate'>('idle');
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef(Date.now());
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'sent' || status === 'error' || status === 'rate') statusRef.current?.focus();
  }, [status]);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: false }));
  };

  const validate = () => {
    const e: Partial<Record<keyof Fields, boolean>> = {
      name: form.name.trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()),
      phone: !!form.phone.trim() && !/^[+\d\s()-]{6,40}$/.test(form.phone.trim()),
      subject: !form.subject,
      message: form.message.trim().length < 5,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!validate()) {
      setStatus('idle');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: honeypot, startedAt: startedAt.current }),
      });
      if (res.status === 429) return setStatus('rate');
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setForm(EMPTY);
      startedAt.current = Date.now();
    } catch {
      setStatus('error');
    }
  };

  const info = [
    { icon: Phone, label: t('contact.phone'), value: SITE.contact.phone, href: `tel:${SITE.contact.phoneHref}`, ltr: true },
    { icon: Mail, label: t('contact.email'), value: SITE.contact.email, href: `mailto:${SITE.contact.email}`, ltr: true },
    { icon: MapPin, label: t('contact.address'), value: SITE.contact.address[lang] },
    { icon: Clock, label: t('contact.hours'), value: SITE.contact.hours[lang] },
  ];

  const field = (k: keyof Fields) => ({
    id: `f-${k}`,
    value: form[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? true : undefined,
    className: 'input',
  });

  return (
    <>
      <PageHero title={t('contact.title')} text={t('contact.text')} />

      <section className="section bg-slate-50">
        <div className="container grid gap-8 lg:grid-cols-5">
          {/* Info */}
          <Reveal className="space-y-4 lg:col-span-2">
            <h2 className="text-2xl font-extrabold">{t('contact.infoTitle')}</h2>
            <a
              href={whatsappLink(t('common.whatsappGeneral'))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl bg-[#25D366] p-5 text-white shadow-card transition hover:bg-[#1ebe5b]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-lg font-bold">{t('common.chatWhatsapp')}</span>
                <span className="block text-sm text-white/85" dir="ltr">
                  {SITE.contact.phone}
                </span>
              </span>
            </a>
            {info.map(({ icon: Icon, label, value, href, ltr }) => {
              const content = (
                <>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-slate-500">{label}</span>
                    <span className="block break-words font-semibold text-ink" dir={ltr ? 'ltr' : undefined}>
                      {value}
                    </span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} className="card card-hover flex items-center gap-4 p-5">
                  {content}
                </a>
              ) : (
                <div key={label} className="card flex items-center gap-4 p-5">
                  {content}
                </div>
              );
            })}
            <div className="card overflow-hidden">
              <iframe
                title={t('contact.mapTitle')}
                src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.contact.mapQuery)}&output=embed`}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={100} className="lg:col-span-3">
            <form onSubmit={submit} noValidate className="card p-6 sm:p-10">
              <h2 className="text-2xl font-extrabold">{t('contact.formTitle')}</h2>
              <p className="mt-2 text-sm text-slate-500">{t('contact.privacyNote')}</p>

              <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
                {status === 'sent' && (
                  <p className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                    {t('contact.success')}
                  </p>
                )}
                {(status === 'error' || status === 'rate') && (
                  <p className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                    {status === 'rate' ? t('contact.errorRate') : t('contact.errorGeneric')}
                  </p>
                )}
                {Object.values(errors).some(Boolean) && (
                  <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{t('contact.errorInvalid')}</p>
                )}
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="f-name" className="label">
                    {t('contact.name')} <span className="text-red-500">*</span>
                  </label>
                  <input {...field('name')} autoComplete="name" maxLength={100} required />
                </div>
                <div>
                  <label htmlFor="f-email" className="label">
                    {t('contact.emailField')} <span className="text-red-500">*</span>
                  </label>
                  <input {...field('email')} type="email" inputMode="email" autoComplete="email" maxLength={200} dir="ltr" required />
                </div>
                <div>
                  <label htmlFor="f-phone" className="label">
                    {t('contact.phoneField')}
                  </label>
                  <input {...field('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={40} dir="ltr" />
                </div>
                <div>
                  <label htmlFor="f-subject" className="label">
                    {t('contact.subject')} <span className="text-red-500">*</span>
                  </label>
                  <select {...field('subject')} required>
                    <option value="">{t('contact.chooseSubject')}</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {t(`contact.subjects.${s}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="f-message" className="label">
                    {t('contact.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea {...field('message')} rows={6} maxLength={5000} required />
                </div>

                {/* Spam trap — hidden from people, bots fill it */}
                <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden>
                  <label htmlFor="f-website">Website</label>
                  <input id="f-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-primary btn-lg mt-8 w-full sm:w-auto">
                {status === 'sending' ? <Spinner /> : <Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden />}
                {status === 'sending' ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
