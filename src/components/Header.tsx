import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { useAuthStore } from '../store';
import logo from '../assets/logo.png';
import { siteConfig } from '../data/content';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const isRTL = i18n.language === 'ar';
  const config = isRTL ? siteConfig.nav : siteConfig.nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: isRTL ? config.homeAr : config.home },
    { path: '/about', label: isRTL ? config.aboutAr : config.about },
    { path: '/products', label: isRTL ? config.productsAr : config.products },
    { path: '/contact', label: isRTL ? config.contactAr : config.contact },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
  src={logo}
  alt="Logo"
  className="w-12 h-12 object-contain"
/>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? siteConfig.company.nameAr : siteConfig.company.name}
              </h1>
              <p className="text-xs text-gray-500">{isRTL ? siteConfig.company.taglineAr : siteConfig.company.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-blue-900 ${
                  location.pathname === link.path
                    ? 'text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-900" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{i18n.language.toUpperCase()}</span>
            </button>

            {/* Admin Link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  {isRTL ? config.adminAr : config.admin}
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-gray-700 hover:text-red-600 transition-colors text-sm"
                >
                  {isRTL ? config.logoutAr : config.logout}
                </button>
              </div>
            ) : (
              <Link
                to="/admin"
                className="hidden sm:block px-4 py-2 border-2 border-blue-900 text-blue-900 rounded-lg text-sm font-medium hover:bg-blue-900 hover:text-white transition-colors"
              >
                {isRTL ? config.loginAr : config.login}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium text-center"
                >
                  {isRTL ? config.loginAr : config.login}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
