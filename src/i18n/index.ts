import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Header
      home: 'Home',
      about: 'About Us',
      products: 'Products & Sectors',
      contact: 'Contact Us',
      admin: 'Admin',
      login: 'Login',
      logout: 'Logout',
      
      // Hero Section
      heroTitle: 'Mosha for Trading & Investment',
      heroSubtitle: 'Your Trusted Partner in Global Trade',
      heroDescription: 'Excellence in Import & Export of Heavy Machinery, Medical Supplies, and General Goods',
      exploreBtn: 'Explore Our Services',
      contactBtn: 'Get In Touch',
      
      // About Section
      aboutTitle: 'About Mosha',
      aboutSubtitle: 'Excellence in Global Trade',
      aboutDescription: 'Mosha for Trading & Investment Co. Ltd. is a leading import-export company specializing in heavy machinery, medical supplies, and general goods. With years of experience and a commitment to quality, we connect global markets to deliver excellence.',
      aboutLearnMore: 'Learn More About Us',
      
      // Services/Sectors
      sectorsTitle: 'Our Business Sectors',
      sectorsSubtitle: 'Comprehensive Trading Solutions',
      heavyMachinery: 'Heavy Machinery & Equipment',
      heavyMachineryDesc: 'Import and export of industrial machinery, construction equipment, agricultural machinery, and spare parts from leading manufacturers worldwide.',
      medicalSupplies: 'Medical Supplies & Equipment',
      medicalSuppliesDesc: 'Supply of high-quality medical equipment, hospital supplies, pharmaceutical products, and healthcare solutions to medical institutions.',
      generalGoods: 'General Goods & Commodities',
      generalGoodsDesc: 'Trading of various consumer goods, food products, textiles, and daily commodities serving markets across the Middle East and Africa.',
      viewProducts: 'View Products',
      
      // Latest Products
      latestProductsTitle: 'Latest Products',
      latestProductsSubtitle: 'Recently Added to Our Catalog',
      viewAllProducts: 'View All Products',
      
      // About Page
      visionTitle: 'Our Vision',
      visionText: 'To become the most trusted and reliable trading partner in the region, connecting global manufacturers with markets that need quality products.',
      missionTitle: 'Our Mission',
      missionText: 'To provide premium import-export services with integrity, efficiency, and commitment to customer satisfaction while building lasting business relationships.',
      valuesTitle: 'Our Values',
      values: {
        integrity: 'Integrity',
        integrityDesc: 'We conduct business with honesty and transparency.',
        quality: 'Quality',
        qualityDesc: 'We ensure the highest standards in all our transactions.',
        reliability: 'Reliability',
        reliabilityDesc: 'We deliver on our promises, every time.',
        customerFocus: 'Customer Focus',
        customerFocusDesc: 'Our customers are at the heart of everything we do.',
      },
      strengthTitle: 'Our Operational Strength',
      strengths: {
        global: 'Global Network',
        globalDesc: 'Established relationships with manufacturers and suppliers across 30+ countries.',
        logistics: 'Efficient Logistics',
        logisticsDesc: 'Streamlined shipping and customs clearance processes.',
        expertise: 'Industry Expertise',
        expertiseDesc: 'Deep knowledge of market regulations and requirements.',
        support: '24/7 Support',
        supportDesc: 'Dedicated team available around the clock.',
      },
      
      // Products Page
      productsTitle: 'Our Products',
      productsSubtitle: 'Quality Products Across All Sectors',
      categories: 'Categories',
      allProducts: 'All Products',
      specifications: 'Specifications',
      origin: 'Origin',
      addToInquiry: 'Add to Inquiry',
      
      // Contact Page
      contactTitle: 'Contact Us',
      contactSubtitle: 'Get In Touch With Our Team',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      sendMessage: 'Send Message',
      sending: 'Sending...',
      companyInfo: 'Company Information',
      address: 'Address',
      workingHours: 'Working Hours',
      workingHoursText: 'Sunday - Thursday: 8:00 AM - 6:00 PM',
      phoneNumber: 'Phone',
      faxNumber: 'Fax',
      successMessage: 'Thank you! Your message has been sent successfully.',
      
      // Admin
      adminDashboard: 'Admin Dashboard',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete',
      productName: 'Product Name',
      category: 'Category',
      description: 'Description',
      price: 'Price',
      image: 'Image URL',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this product?',
      noProducts: 'No products found. Add your first product!',
      adminLogin: 'Admin Login',
      username: 'Username',
      password: 'Password',
      loginButton: 'Login',
      invalidCredentials: 'Invalid username or password',
      
      // Footer
      footerDescription: 'Your trusted partner in global trade, specializing in heavy machinery, medical supplies, and general goods.',
      quickLinks: 'Quick Links',
      services: 'Services',
      sectors: 'Business Sectors',
      followUs: 'Follow Us',
      allRights: 'All Rights Reserved.',
      
      // Common
      readMore: 'Read More',
      learnMore: 'Learn More',
      viewAll: 'View All',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
    }
  },
  ar: {
    translation: {
      // Header
      home: 'الرئيسية',
      about: 'عن الشركة',
      products: 'المنتجات والقطاعات',
      contact: 'اتصل بنا',
      admin: 'الإدارة',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      
      // Hero Section
      heroTitle: 'موشا للتجارة والاستثمار',
      heroSubtitle: 'شريكك الموثوق في التجارة العالمية',
      heroDescription: 'التميز في الاستيراد والتصدير الآلات الثقيلة والمستلزمات الطبية والسلع العامة',
      exploreBtn: 'استكشف خدماتنا',
      contactBtn: 'تواصل معنا',
      
      // About Section
      aboutTitle: 'عن موشا',
      aboutSubtitle: 'التميز في التجارة العالمية',
      aboutDescription: 'شركة موشا للتجارة والاستثمار المحدودة هي شركة رائدة في الاستيراد والتصدير متخصصة في الآلات الثقيلة والمستلزمات الطبية والسلع العامة. مع سنوات من الالتزام بالجودة، نربط الأسواق العالمية لتقديم التميز.',
      aboutLearnMore: 'اعرف المزيد عنا',
      
      // Services/Sectors
      sectorsTitle: 'قطاعاتنا التجارية',
      sectorsSubtitle: 'حلول تجارية شاملة',
      heavyMachinery: 'الآلات الثقيلة والمعدات',
      heavyMachineryDesc: 'استيراد وتصدير الآلات الصناعية ومعدات البناء والآلات الزراعية وقطع الغيار من أفضل الشركات المصنعة عالمياً.',
      medicalSupplies: 'المستلزمات والمعدات الطبية',
      medicalSuppliesDesc: 'توريد المعدات والمستلزمات الطبية عالية الجودة والمنتجات الصيدلانية والحلول الصحية للمؤسسات الطبية.',
      generalGoods: 'السلع والمنتجات العامة',
      generalGoodsDesc: 'تجارة السلع الاستهلاكية المختلفة والمنتجات الغذائية والمنسوجات والسلع اليومية لأسواق الشرق الأوسط وأفريقيا.',
      viewProducts: 'عرض المنتجات',
      
      // Latest Products
      latestProductsTitle: 'أحدث المنتجات',
      latestProductsSubtitle: 'أضيفت مؤخراً إلى كتالوجنا',
      viewAllProducts: 'عرض جميع المنتجات',
      
      // About Page
      visionTitle: 'رؤيتنا',
      visionText: 'أن نصبح الشريك التجاري الأكثر موثوقية في المنطقة، ربط الشركات المصنعة العالمية بالأسواق التي تحتاج لمنتجات عالية الجودة.',
      missionTitle: 'رسالتنا',
      missionText: 'تقديم خدمات استيراد وتصدير متميزة بالنزاهة والكفاءة والالتزام برضا العملاء مع بناء علاقات تجارية دائمة.',
      valuesTitle: 'قيمنا',
      values: {
        integrity: 'النزاهة',
        integrityDesc: 'نمارس الأعمال بصدق وشفافية.',
        quality: 'الجودة',
        qualityDesc: 'نضمن أعلى المعايير في جميع معاملاتنا.',
        reliability: 'الموثوقية',
        reliabilityDesc: 'نفي بوعودنا في كل مرة.',
        customerFocus: 'تركيز على العميل',
        customerFocusDesc: 'عملاؤنا في صميم كل ما نقوم به.',
      },
      strengthTitle: 'قوتنا التشغيلية',
      strengths: {
        global: 'شبكة عالمية',
        globalDesc: 'علاقات راسخة مع الشركات المصنعة والموردين في أكثر من 30 دولة.',
        logistics: 'لوجستيات فعالة',
        logisticsDesc: 'عمليات شحن وتخليص جمركي مبسطة.',
        expertise: 'خبرة في الصناعة',
        expertiseDesc: 'معرفة عميقة بلوائح ومتطلبات السوق.',
        support: 'دعم على مدار الساعة',
        supportDesc: 'فريق مخصص متاح دائماً.',
      },
      
      // Products Page
      productsTitle: 'منتجاتنا',
      productsSubtitle: 'منتجات عالية الجودة في جميع القطاعات',
      categories: 'الفئات',
      allProducts: 'جميع المنتجات',
      specifications: 'المواصفات',
      origin: 'المصدر',
      addToInquiry: 'إضافة للاستفسار',
      
      // Contact Page
      contactTitle: 'اتصل بنا',
      contactSubtitle: 'تواصل مع فريقنا',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      subject: 'الموضوع',
      message: 'الرسالة',
      sendMessage: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      companyInfo: 'معلومات الشركة',
      address: 'العنوان',
      workingHours: 'ساعات العمل',
      workingHoursText: 'الأحد - الخميس: 8:00 صباحاً - 6:00 مساءً',
      phoneNumber: 'الهاتف',
      faxNumber: 'الفاكس',
      successMessage: 'شكراً لك! تم إرسال رسالتك بنجاح.',
      
      // Admin
      adminDashboard: 'لوحة الإدارة',
      addProduct: 'إضافة منتج',
      editProduct: 'تعديل المنتج',
      deleteProduct: 'حذف',
      productName: 'اسم المنتج',
      category: 'الفئة',
      description: 'الوصف',
      price: 'السعر',
      image: 'رابط الصورة',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirmDelete: 'هل أنت متأكد من حذف هذا المنتج؟',
      noProducts: 'لا توجد منتجات. أضف منتجك الأول!',
      adminLogin: 'تسجيل دخول الإدارة',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      loginButton: 'تسجيل الدخول',
      invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
      
      // Footer
      footerDescription: 'شريكك الموثوق في التجارة العالمية، متخصص في الآلات الثقيلة والمستلزمات الطبية والسلع العامة.',
      quickLinks: 'روابط سريعة',
      services: 'الخدمات',
      sectors: 'القطاعات التجارية',
      followUs: 'تابعنا',
      allRights: 'جميع الحقوق محفوظة.',
      
      // Common
      readMore: 'اقرأ المزيد',
      learnMore: 'اعرف المزيد',
      viewAll: 'عرض الكل',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
