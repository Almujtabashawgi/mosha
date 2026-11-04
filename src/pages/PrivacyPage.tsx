import { SITE } from '../config/site';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/ui';

export default function PrivacyPage() {
  const { t } = useLang();
  useSeo(t('privacy.title'));

  return (
    <>
      <PageHero title={t('privacy.title')} text={t('privacy.updated')} />
      <section className="section">
        <article className="container max-w-3xl space-y-6 text-base leading-8 text-slate-700">
          <p>{t('privacy.p1')}</p>
          <h2 className="pt-4 text-2xl font-bold">{t('privacy.h2')}</h2>
          <p>{t('privacy.p2')}</p>
          <h2 className="pt-4 text-2xl font-bold">{t('privacy.h3')}</h2>
          <p>{t('privacy.p3')}</p>
          <h2 className="pt-4 text-2xl font-bold">{t('privacy.h4')}</h2>
          <p>{t('privacy.p4')}</p>
          <h2 className="pt-4 text-2xl font-bold">{t('privacy.h5')}</h2>
          <p>{t('privacy.p5', { email: SITE.contact.email })}</p>
        </article>
      </section>
    </>
  );
}
