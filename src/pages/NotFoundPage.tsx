import { Link } from 'react-router-dom';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';

export default function NotFoundPage() {
  const { t } = useLang();
  useSeo(t('notFound.title'), undefined, { noindex: true });

  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-ink pt-24 text-white">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container text-center">
        <p className="text-8xl font-extrabold text-brand-400 sm:text-9xl" dir="ltr">
          404
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-white">{t('notFound.title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-300">{t('notFound.text')}</p>
        <Link to="/" className="btn-primary btn-lg mt-8">
          {t('common.backHome')}
        </Link>
      </div>
    </section>
  );
}
