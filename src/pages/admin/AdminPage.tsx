import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgePercent, ExternalLink, Images, Inbox, Languages, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { useLang } from '../../hooks/useLang';
import { useSeo } from '../../hooks/useSeo';
import { LogoMark, Spinner } from '../../components/ui';
import { ToastProvider } from './shared';
import ProductsManager from './ProductsManager';
import OffersManager from './OffersManager';
import MessagesInbox from './MessagesInbox';
import HeroManager from './HeroManager';

type Tab = 'products' | 'offers' | 'hero' | 'messages';

export default function AdminPage() {
  const { t, toggle } = useLang();
  useSeo(t('admin.title'), undefined, { noindex: true });
  const { status, user, signInWithGoogle, signOut } = useAdmin();
  const [tab, setTab] = useState<Tab>('products');
  const [signingIn, setSigningIn] = useState(false);

  if (status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-brand-600">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (status !== 'admin') {
    return (
      <AuthShell onToggleLang={toggle} langLabel={t('common.languageShort')}>
        {status === 'signed-out' ? (
          <>
            <h1 className="text-2xl font-extrabold">{t('admin.signInTitle')}</h1>
            <p className="mt-3 text-slate-600">{t('admin.signInText')}</p>
            <button
              type="button"
              disabled={signingIn}
              onClick={async () => {
                setSigningIn(true);
                const { error } = await signInWithGoogle();
                if (error) setSigningIn(false);
              }}
              className="btn-outline btn-lg mt-8 w-full gap-3 border-slate-300 text-ink"
            >
              {signingIn ? <Spinner /> : <GoogleIcon />}
              {t('admin.google')}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-red-600">{t('admin.notAllowedTitle')}</h1>
            <p className="mt-3 text-slate-600">{t('admin.notAllowedText', { email: user?.email ?? '' })}</p>
            <button type="button" onClick={() => signOut()} className="btn-primary btn-lg mt-8 w-full">
              {t('admin.switchAccount')}
            </button>
          </>
        )}
      </AuthShell>
    );
  }

  const tabs: { id: Tab; icon: typeof Package; label: string }[] = [
    { id: 'products', icon: Package, label: t('admin.tabs.products') },
    { id: 'offers', icon: BadgePercent, label: t('admin.tabs.offers') },
    { id: 'hero', icon: Images, label: t('admin.heroTab') },
    { id: 'messages', icon: Inbox, label: t('admin.tabs.messages') },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50">
                <LogoMark className="h-9 w-9" />
              </span>
              <span className="truncate font-extrabold text-ink">{t('admin.title')}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button type="button" onClick={toggle} className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-bold text-slate-700 hover:bg-slate-100">
                <Languages className="h-5 w-5" />
                {t('common.languageShort')}
              </button>
              <Link to="/" className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline-flex">
                <ExternalLink className="h-4 w-4" />
                {t('admin.viewSite')}
              </Link>
              {user?.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" className="hidden h-9 w-9 rounded-full sm:block" referrerPolicy="no-referrer" />
              )}
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                title={user?.email ?? ''}
              >
                <LogOut className="h-4 w-4 rtl:-scale-x-100" />
                <span className="hidden sm:inline">{t('admin.signOut')}</span>
              </button>
            </div>
          </div>
          <nav className="container no-scrollbar flex gap-1 overflow-x-auto" aria-label="Admin sections">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  tab === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-ink'
                }`}
                aria-current={tab === id ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="container py-8">
          {tab === 'products' && <ProductsManager />}
          {tab === 'offers' && <OffersManager />}
          {tab === 'hero' && <HeroManager />}
          {tab === 'messages' && <MessagesInbox />}
        </main>
      </div>
    </ToastProvider>
  );
}

function AuthShell({ children, onToggleLang, langLabel }: { children: React.ReactNode; onToggleLang: () => void; langLabel: string }) {
  const { t } = useLang();
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-ink p-4">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute -top-40 start-1/2 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl rtl:translate-x-1/2" />
      <button type="button" onClick={onToggleLang} className="absolute end-4 top-4 inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-bold text-white hover:bg-white/10">
        <Languages className="h-5 w-5" />
        {langLabel}
      </button>
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-6 flex justify-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-xl">
            <LogoMark className="h-16 w-16" />
          </span>
        </div>
        <div className="rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-10">{children}</div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4" />
          {t('admin.secureNote')}
        </p>
        <p className="mt-3 text-center">
          <Link to="/" className="text-sm font-medium text-brand-300 hover:text-white">
            {t('common.backHome')}
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
