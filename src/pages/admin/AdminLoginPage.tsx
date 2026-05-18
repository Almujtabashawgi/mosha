import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { adminConfig } from '../../data/content';
import { Lock, User, Eye, EyeOff, LogIn, ArrowLeft, ArrowRight } from 'lucide-react';

const AdminLoginPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password);
    
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError(t('invalidCredentials'));
    }
    
    setIsLoading(false);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 antialiased font-sans">
      {/* خلفية جمالية متحركة خفيفة */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative w-full max-w-md transform transition-all duration-300">
        
        {/* الشعار والهيدر */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-900 text-white font-black text-4xl rounded-2xl shadow-xl shadow-blue-950/50 mb-4 border border-white/10 backdrop-blur-md">
            <span>{isRTL ? 'م' : 'M'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('adminLogin')}</h1>
          <p className="text-blue-300/80 mt-2 text-sm font-medium">
            {isRTL ? 'شركة موشا للتجارة والاستثمار المحدودة' : 'Mosha for Trading & Investment Co. Ltd.'}
          </p>
        </div>

        {/* كرت تسجيل الدخول المصمم بشكل عصري */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl shadow-slate-950/50 p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
                {error}
              </div>
            )}

            {/* حقل اسم المستخدم */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('username')}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`}>
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-800 font-medium ${
                    isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'
                  }`}
                  placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter username'}
                  required
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('password')}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-800 font-medium ${
                    isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12 text-left'
                  }`}
                  placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 flex items-center px-4 text-slate-400 hover:text-slate-600 transition-colors ${isRTL ? 'left-0' : 'right-0'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:from-blue-800 hover:to-indigo-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{isRTL ? 'جاري التحقق...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <span>{t('loginButton')}</span>
                  <LogIn className={`w-5 h-5 ${isRTL ? 'transform rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {/* بوكس بيانات التجربة المطور هندسياً وبصرياً */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-100 shadow-inner">
            <p className={`text-xs font-bold text-slate-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'بيانات الوصول التجريبية' : 'Demo Authorization Credentials'}
            </p>
            <div className={`mt-2 flex flex-col gap-1 text-sm text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                <span className="font-medium text-slate-400">{isRTL ? 'اسم المستخدم: ' : 'Username: '}</span>
                <code className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs font-bold text-blue-600 select-all">{adminConfig.username}</code>
              </div>
              <div>
                <span className="font-medium text-slate-400">{isRTL ? 'كلمة المرور: ' : 'Password: '}</span>
                <code className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs font-bold text-blue-600 select-all">{adminConfig.password}</code>
              </div>
            </div>
          </div>
        </div>

        {/* رجوع للرئيسية بتأثير مريح للعين */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-300/80 hover:text-white transition-colors text-sm font-medium group"
          >
            {isRTL ? (
              <>
                <span>العودة إلى الصفحة الرئيسية</span>
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;