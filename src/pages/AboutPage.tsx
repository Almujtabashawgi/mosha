import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, Eye, Globe, Handshake, Headset, Heart, ShieldCheck, Target, Truck, Users } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { useSeo } from '../hooks/useSeo';
import { whatsappLink } from '../config/site';
import { LogoMark, PageHero, Reveal, SectionHeading, WhatsAppIcon } from '../components/ui';

export default function AboutPage() {
  const { t, isAr } = useLang();
  useSeo(t('about.title'), t('about.text'));
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const values = [
    { icon: ShieldCheck, title: t('about.values.integrity'), text: t('about.values.integrityText') },
    { icon: Award, title: t('about.values.quality'), text: t('about.values.qualityText') },
    { icon: Handshake, title: t('about.values.reliability'), text: t('about.values.reliabilityText') },
    { icon: Heart, title: t('about.values.customer'), text: t('about.values.customerText') },
  ];
  const strengths = [
    { icon: Globe, title: t('about.strengths.global'), text: t('about.strengths.globalText') },
    { icon: Truck, title: t('about.strengths.logistics'), text: t('about.strengths.logisticsText') },
    { icon: Users, title: t('about.strengths.expertise'), text: t('about.strengths.expertiseText') },
    { icon: Headset, title: t('about.strengths.support'), text: t('about.strengths.supportText') },
  ];

  return (
    <>
      <PageHero title={t('about.title')} text={t('about.text')} />

      {/* Story */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">{t('about.storyEyebrow')}</p>
            <h2 className="heading">{t('about.storyTitle')}</h2>
            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">{t('about.story1')}</p>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{t('about.story2')}</p>
            <Link to="/contact" className="btn-primary btn-lg mt-8">
              {t('common.contactUs')}
              <Arrow className="h-5 w-5" aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-100 via-white to-cyan-50" />
              <div className="absolute inset-[14%] grid place-items-center rounded-full bg-white shadow-lift">
                <LogoMark className="h-[80%] w-[80%]" />
              </div>
              <div className="card absolute -bottom-4 start-0 flex items-center gap-3 px-5 py-4 sm:start-[-1rem]">
                <Globe className="h-8 w-8 text-brand-600" aria-hidden />
                <div>
                  <p className="text-2xl font-extrabold text-ink" dir="ltr">10+</p>
                  <p className="text-xs text-slate-500">{t('stats.partners')}</p>
                </div>
              </div>
              <div className="card absolute -top-4 end-0 flex items-center gap-3 px-5 py-4 sm:end-[-1rem]">
                <Users className="h-8 w-8 text-brand-600" aria-hidden />
                <div>
                  <p className="text-2xl font-extrabold text-ink" dir="ltr">500+</p>
                  <p className="text-xs text-slate-500">{t('stats.clients')}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="section bg-slate-50">
        <div className="container grid gap-6 md:grid-cols-2">
          {[
            { icon: Eye, title: t('about.visionTitle'), text: t('about.visionText') },
            { icon: Target, title: t('about.missionTitle'), text: t('about.missionText') },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 100} className="h-full">
              <div className="card h-full p-8 sm:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
                  <b.icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-6 text-2xl font-extrabold">{b.title}</h3>
                <p className="mt-3 text-base leading-8 text-slate-600">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading title={t('about.valuesTitle')} text={t('about.valuesText')} />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-slate-200 p-6 text-center transition hover:border-brand-300 hover:bg-brand-50/40">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <v.icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-24">
        <div className="bg-grid absolute inset-0 -z-10 opacity-70" />
        <div className="container">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('home.whyTitle')}</h2>
              <p className="mt-4 text-slate-300">{t('home.whyText')}</p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <s.icon className="h-9 w-9 text-brand-300" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink(t('common.whatsappGeneral'))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
              <WhatsAppIcon />
              {t('common.chatWhatsapp')}
            </a>
            <Link to="/products" className="btn-ghost-light btn-lg">
              {t('common.exploreProducts')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
