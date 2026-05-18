import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Stethoscope, Package, Globe, Clock, Award, Users } from 'lucide-react';
import { siteConfig } from '../data/content';
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [products, setProducts] = useState<any[]>([]);
  const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  if (!error) {
    setProducts(data || []);
  }
};
useEffect(() => {
  fetchProducts();

  const channel = supabase
    .channel('products-live')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products',
      },
      () => {
        fetchProducts();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const latestProducts = products.slice(0, 3);
  const company = siteConfig.company;

  // إعداد القطاعات يدوياً لتتوافق مع محتوى المترجم والبيانات المتاحة
  const sectors = [
    {
      icon: Factory,
      title: isRTL ? 'الآلات الثقيلة والمعدات' : 'Heavy Machinery & Equipment',
      description: isRTL ? 'استيراد وتصدير أحدث الآلات والمعدات الإنشائية والصناعية من كبرى الشركات العالمية.' : 'Import and export of state-of-the-art construction and industrial machinery from leading global brands.',
      category: 'heavy-machinery',
      color: 'from-blue-600 to-blue-800'
    },
    {
      icon: Stethoscope,
      title: isRTL ? 'المستلزمات والمعدات الطبية' : 'Medical Supplies & Equipment',
      description: isRTL ? 'توفير وتوريد أجهزة الرعاية الصحية والمستلزمات الطبية المعتمدة للمستشفيات والمراكز الطبية.' : 'Providing and supplying certified healthcare equipment and medical supplies for hospitals and medical centers.',
      category: 'medical-supplies',
      color: 'from-indigo-600 to-indigo-800'
    },
    {
      icon: Package,
      title: isRTL ? 'السلع والمنتجات العامة' : 'General Goods & Commodities',
      description: isRTL ? 'تجارة وتوريد السلع الاستهلاكية والمواد الغذائية والمنتجات العامة بجودة وكفاءة عالية.' : 'Trading and supply of consumer goods, foodstuffs, and general commodities with high quality and efficiency.',
      category: 'general-goods',
      color: 'from-slate-700 to-slate-900'
    }
  ];

  const stats = [
    { icon: Globe, value: '15+', label: isRTL ? 'دول الشركاء' : 'Partner Countries' },
    { icon: Users, value: '500+', label: isRTL ? 'عميل موثوق' : 'Trusted Clients' },
    { icon: Award, value: '16+', label: isRTL ? 'عام من التميز' : 'Years of Excellence', sub: company.established },
    { icon: Clock, value: '24/7', label: isRTL ? 'دعم متواصل' : 'Continuous Support' }
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-slate-50 antialiased font-sans overflow-hidden">
      
      {/* 1. Hero Section المطور بتصميم فخم جداً */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900 text-white pt-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6">
              ✨ {isRTL ? 'الريادة والتميز في الاستثمار' : 'Leadership & Excellence in Investment'}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              {isRTL ? company.nameAr : company.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-200/90 font-medium mb-4">
              {isRTL ? company.taglineAr : company.tagline}
            </p>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10">
              {isRTL ? company.descriptionAr : company.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] inline-flex items-center gap-2"
              >
                <span>{t('exploreBtn')}</span>
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'transform rotate-180' : ''}`} />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border border-white/20 backdrop-blur-sm transition-all inline-flex items-center justify-center"
              >
                {t('contactBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section الإحصائيات الجذابة */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 p-8 md:p-10 border border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100/50">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-slate-900">{stat.value}</span>
                <span className="text-sm font-semibold text-slate-500 mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sectors Section عرض القطاعات بصورة ممتازة */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              {t('sectorsTitle')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 font-medium">
              {t('sectorsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md shadow-slate-900/[0.02] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${sector.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/10 mb-6 group-hover:scale-110 transition-transform`}>
                    <sector.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{sector.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{sector.description}</p>
                </div>
                <Link
                  to={`/products?category=${sector.category}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group/link"
                >
                  <span>{isRTL ? 'تصفح المنتجات' : 'Browse Products'}</span>
                  <ArrowRight className={`w-4 h-4 transform group-hover/link:translate-x-1 ${isRTL ? 'rotate-180 group-hover/link:-translate-x-1' : ''} transition-transform`} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Latest Products آخر المنتجات المضافة */}
      <section className="py-24 bg-slate-100/60 border-t border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isRTL ? 'أحدث المنتجات' : 'Latest Products'}</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">{isRTL ? 'اكتشف الإضافات الأخيرة إلى محفظتنا التجارية' : 'Discover the recent additions to our trading portfolio'}</p>
            </div>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-white text-slate-800 hover:bg-blue-900 hover:text-white rounded-xl text-sm font-bold shadow-sm border border-slate-200 transition-all inline-flex items-center gap-2"
            >
              <span>{t('viewAll')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 px-3 py-1 bg-blue-900/90 text-white backdrop-blur-sm rounded-lg text-xs font-bold">
                    {product.category === 'heavy-machinery' ? (isRTL ? 'آلات ثقيلة' : 'Machinery') : 
                     product.category === 'medical-supplies' ? (isRTL ? 'مستلزمات طبية' : 'Medical') : (isRTL ? 'سلع عامة' : 'General')}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {isRTL ? product.nameAr : product.name}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
                      {isRTL ? product.descriptionAr : product.description}
                    </p>
                  </div>
                  {product.price && (
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isRTL ? 'السعر التقديري' : 'Est. Price'}</span>
                      <p className="text-blue-900 font-extrabold text-base">{product.price}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section دعوة للتواصل */}
      <section className="py-24 bg-gradient-to-br from-blue-950 to-indigo-950 text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {isRTL ? 'جاهز لبدء شراكة تجارية متينة؟' : 'Ready to Start a Strong Trade Partnership?'}
          </h2>
          <p className="text-lg text-blue-200/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {isRTL ? 'تواصل معنا اليوم لمناقشة متطلباتك الاستيرادية والتصديرية والحصول على حلول مخصصة لأعمالك.' : 'Get in touch with us today to discuss your import/export requirements and receive tailored solutions for your business.'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-950 hover:bg-blue-50 rounded-xl font-extrabold shadow-xl shadow-slate-950/20 active:scale-[0.98] transition-all text-base"
          >
            <span>{t('contactBtn')}</span>
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'transform rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;