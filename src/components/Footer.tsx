import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { siteConfig } from '../data/content';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const config = siteConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <span className="text-white font-black text-xl">{isRTL ? 'م' : 'M'}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{isRTL ? config.company.nameAr : config.company.name}</h3>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t('footerDescription')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-blue-400 hover:text-white rounded-xl transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-blue-700 hover:text-white rounded-xl transition-all"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-pink-600 hover:text-white rounded-xl transition-all"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">{t('home')}</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">{t('about')}</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-white text-sm transition-colors">{t('products')}</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Business Sectors */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{t('sectors')}</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=heavy-machinery" className="text-slate-400 hover:text-white text-sm transition-colors">{isRTL ? 'الآلات الثقيلة' : 'Heavy Machinery'}</Link></li>
              <li><Link to="/products?category=medical-supplies" className="text-slate-400 hover:text-white text-sm transition-colors">{isRTL ? 'المستلزمات الطبية' : 'Medical Supplies'}</Link></li>
              <li><Link to="/products?category=general-goods" className="text-slate-400 hover:text-white text-sm transition-colors">{isRTL ? 'السلع العامة' : 'General Goods'}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{t('contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">{isRTL ? config.contact.addressAr : config.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm" dir="ltr">{config.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm">{config.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-start">
              © {currentYear} {isRTL ? config.company.nameAr : config.company.name}. {t('allRights')}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;