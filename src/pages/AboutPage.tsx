import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Target, Heart, Shield, Globe, Truck, Award, Headphones, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const values = [
    {
      icon: Shield,
      title: t('values.integrity'),
      description: t('values.integrityDesc')
    },
    {
      icon: Award,
      title: t('values.quality'),
      description: t('values.qualityDesc')
    },
    {
      icon: Globe,
      title: t('values.reliability'),
      description: t('values.reliabilityDesc')
    },
    {
      icon: Heart,
      title: t('values.customerFocus'),
      description: t('values.customerFocusDesc')
    }
  ];

  const strengths = [
    {
      icon: Globe,
      title: t('strengths.global'),
      description: t('strengths.globalDesc')
    },
    {
      icon: Truck,
      title: t('strengths.logistics'),
      description: t('strengths.logisticsDesc')
    },
    {
      icon: Award,
      title: t('strengths.expertise'),
      description: t('strengths.expertiseDesc')
    },
    {
      icon: Headphones,
      title: t('strengths.support'),
      description: t('strengths.supportDesc')
    }
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('aboutSubtitle')}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('aboutTitle')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {t('aboutDescription')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {isRTL 
                  ? 'نحن نفخر بكوننا شريكًا موثوقًا للشركات والمؤسسات في جميع أنحاء العالم. فريقنا من المحترفين ذوي الخبرة يضمن أعلى مستويات الجودة في جميع معاملاتنا.'
                  : 'We pride ourselves on being a trusted partner for businesses and institutions worldwide. Our team of experienced professionals ensures the highest quality standards in all our transactions.'}
              </p>
              <Link
                to="/contact"
                className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {t('contactBtn')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <Eye className="w-10 h-10 text-blue-900 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">{t('visionTitle')}</h3>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6">
                    <Target className="w-10 h-10 text-emerald-600 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">{t('missionTitle')}</h3>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-amber-50 rounded-2xl p-6">
                    <Heart className="w-10 h-10 text-amber-600 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">{t('valuesTitle')}</h3>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <Shield className="w-10 h-10 text-purple-600 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">{isRTL ? 'التزامنا' : 'Our Commitment'}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('visionTitle')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('visionText')}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('missionTitle')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('missionText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'rtl' : 'ltr'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('valuesTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isRTL ? 'المبادئ التي توجه كل ما نقوم به' : 'The principles that guide everything we do'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <value.icon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Strength */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'rtl' : 'ltr'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('strengthTitle')}
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              {isRTL ? 'ما يجعلنا متميزين في السوق' : 'What makes us stand out in the market'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <strength.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">{strength.title}</h3>
                <p className="text-blue-100 text-sm">{strength.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {isRTL ? 'هل تريد معرفة المزيد عنا؟' : 'Want to Know More About Us?'}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {isRTL ? 'نحن هنا للإجابة على جميع أسئلتك ومساعدتك في احتياجاتك التجارية.' : 'We are here to answer all your questions and help with your business needs.'}
          </p>
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {t('contactBtn')}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
