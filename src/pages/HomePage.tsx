import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Factory,
  Stethoscope,
  Package,
  Globe,
  Clock,
  Award,
  Users
} from 'lucide-react';

import { siteConfig } from '../data/content';
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import ProductModal from "../components/ProductModal";
import { CATEGORIES } from '../types';

const HomePage = () => {

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith('ar');

  const sectorsPages = t("sectorsPages", {
    returnObjects: true
  }) as any;

  const sectors = [
    {
      id: "engineering",
      icon: Factory,
      color: 'from-blue-600 to-blue-800',
      title: sectorsPages.engineering?.title || "Engineering",
      description: sectorsPages.engineering?.description || ""
    },

    {
      id: "medical-supplies",
      icon: Stethoscope,
      color: 'from-indigo-600 to-indigo-800',
      title: sectorsPages.medical?.title || "Medical Supplies",
      description: sectorsPages.medical?.description || ""
    },

    {
      id: "agriculture",
      icon: Package,
      color: 'from-green-600 to-green-800',
      title: sectorsPages.agriculture?.title || "Agriculture",
      description: sectorsPages.agriculture?.description || ""
    },

    {
      id: "mining",
      icon: Factory,
      color: 'from-slate-700 to-slate-900',
      title: sectorsPages.mining?.title || "Mining",
      description: sectorsPages.mining?.description || ""
    },

    {
      id: "energy",
      icon: Globe,
      color: 'from-yellow-500 to-orange-600',
      title: sectorsPages.energy?.title || "Energy",
      description: sectorsPages.energy?.description || ""
    },

    {
      id: "import-export",
      icon: Globe,
      color: 'from-cyan-600 to-blue-700',
      title: sectorsPages.importExport?.title || "Import Export",
      description: sectorsPages.importExport?.description || ""
    },

    {
      id: "heavy-machinery",
      icon: Factory,
      color: 'from-rose-600 to-red-700',
      title: sectorsPages.heavyMachinery?.title || "Heavy Machinery",
      description: sectorsPages.heavyMachinery?.description || ""
    }
  ];

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

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

  const company = siteConfig.company;

  const stats = [

    {
      icon: Globe,
      value: '10+',
      label: isRTL ? 'دول الشركاء' : 'Partner Countries'
    },

    {
      icon: Users,
      value: '500+',
      label: isRTL ? 'عميل موثوق' : 'Trusted Clients'
    },

    {
      icon: Award,
      value: '5+',
      label: isRTL ? 'عام من التميز' : 'Years of Excellence'
    },

    {
      icon: Clock,
      value: '24/7',
      label: isRTL ? 'دعم متواصل' : 'Continuous Support'
    }

  ];

  const getSectorStyle = (category: string) => {

    switch (category) {

      case 'engineering':
        return {
          icon: Factory,
          color: 'from-blue-600 to-blue-800'
        };

      case 'medical-supplies':
        return {
          icon: Stethoscope,
          color: 'from-indigo-600 to-indigo-800'
        };

      case 'agriculture':
        return {
          icon: Package,
          color: 'from-green-600 to-green-800'
        };

      case 'mining':
        return {
          icon: Factory,
          color: 'from-slate-700 to-slate-900'
        };

      case 'energy':
        return {
          icon: Globe,
          color: 'from-yellow-500 to-orange-600'
        };

      case 'import-export':
        return {
          icon: Globe,
          color: 'from-cyan-600 to-blue-700'
        };

      case 'heavy-machinery':
        return {
          icon: Factory,
          color: 'from-rose-600 to-red-700'
        };

      default:
        return {
          icon: Package,
          color: 'from-gray-600 to-gray-800'
        };
    }
  };

  return (

    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-slate-50 antialiased font-sans overflow-hidden"
    >

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900 text-white pt-24">

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6">
              ✨ {isRTL
                ? 'الريادة والتميز في الاستثمار'
                : 'Leadership & Excellence in Investment'}
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
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <span>{t('exploreBtn')}</span>

                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                />
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border border-white/20 backdrop-blur-sm transition-all"
              >
                {t('contactBtn')}
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {stats.map((stat, index) => (

              <div
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition-colors"
              >

                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">

                  <stat.icon className="w-6 h-6" />

                </div>

                <span className="text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </span>

                <span className="text-sm font-semibold text-slate-500 mt-2">
                  {stat.label}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* SECTORS */}
      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              {isRTL ? 'قطاعاتنا' : 'Our Sectors'}
            </h2>

            <p className="mt-4 text-lg text-slate-600 font-medium">
              {isRTL
                ? 'نغطي عدة مجالات تجارية واستثمارية متنوعة'
                : 'We operate across multiple business and investment sectors'}
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {sectors.map((sector, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >

                <div>

                  <div className={`w-14 h-14 bg-gradient-to-br ${sector.color} text-white rounded-2xl flex items-center justify-center mb-6`}>

                    <sector.icon className="w-6 h-6" />

                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {sector.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {sector.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="py-24 bg-slate-100/60 border-t border-b border-slate-200/50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-14">

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isRTL ? 'المنتجات حسب الفئة' : 'Products by Category'}
            </h2>

          </div>

          <div className="space-y-20">

            {CATEGORIES.map((category) => {

              const items = products.filter(
                (product: any) =>
                  product.category === category.value
              );

              if (items.length === 0) return null;

              const sectorStyle = getSectorStyle(category.value);
              const Icon = sectorStyle.icon;

              return (

                <div key={category.value}>

                  {/* Section Title */}
                  <div className="flex items-center gap-4 mb-8">

                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sectorStyle.color} flex items-center justify-center shadow-lg`}
                    >

                      <Icon className="w-6 h-6 text-white" />

                    </div>

                    <div>

                      <h3 className="text-2xl font-black text-slate-900">
                        {isRTL ? category.labelAr : category.label}
                      </h3>

                      <p className="text-sm text-slate-500 font-medium">
                        {items.length} {isRTL ? "منتج متوفر" : "Products Available"}
                      </p>

                    </div>

                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {items.map((product: any) => (

                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                      >

                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />

                          <span
                            className={`absolute top-4 right-4 px-3 py-1 text-white rounded-xl text-xs font-bold bg-gradient-to-r ${sectorStyle.color}`}
                          >
                            {isRTL ? category.labelAr : category.label}
                          </span>

                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col h-full">

                          <div className="flex-1">

                            <h3 className="text-lg font-extrabold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                              {isRTL ? product.namear : product.name}
                            </h3>

                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                              {isRTL
                                ? product.descriptionar
                                : product.description}
                            </p>

                          </div>

                          {product.price && (

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">

                              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                                {isRTL ? "السعر" : "Price"}
                              </span>

                              <span className="text-lg font-black text-blue-900">
                                {product.price}
                              </span>

                            </div>

                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-950 to-indigo-950 text-white">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {isRTL
              ? 'جاهز لبدء شراكة تجارية متينة؟'
              : 'Ready to Start a Strong Trade Partnership?'}
          </h2>

          <p className="text-lg text-blue-200/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {isRTL
              ? 'تواصل معنا اليوم لمناقشة متطلباتك الاستيرادية والتصديرية والحصول على حلول مخصصة لأعمالك.'
              : 'Get in touch with us today to discuss your import/export requirements and receive tailored solutions for your business.'}
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-950 hover:bg-blue-50 rounded-xl font-extrabold shadow-xl transition-all text-base"
          >

            <span>{t('contactBtn')}</span>

            <ArrowRight
              className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
            />

          </Link>

        </div>

      </section>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>

  );
};

export default HomePage;