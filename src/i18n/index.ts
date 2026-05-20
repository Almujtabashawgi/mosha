import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      home: 'Home',
      about: 'About Us',
      products: 'Products & Sectors',
      contact: 'Contact Us',

      aboutTitle: "About Us",
      aboutSubtitle: "Learn more about our company and services.",
      aboutDescription: "We provide high-quality services and solutions across multiple sectors.",

      contactBtn: "Contact Us",

      visionTitle: "Our Vision",
      visionText: "To become a leading company in engineering, medical, agriculture, mining, and energy sectors.",

      missionTitle: "Our Mission",
      missionText: "Deliver reliable services and products with the highest quality standards.",

      valuesTitle: "Our Values",

      strengthTitle: "Our Strengths",

      values: {
        integrity: "Integrity",
        integrityDesc: "We work with transparency and professionalism.",

        quality: "Quality",
        qualityDesc: "We deliver top-quality services and products.",

        reliability: "Reliability",
        reliabilityDesc: "Clients trust us for dependable solutions.",

        customerFocus: "Customer Focus",
        customerFocusDesc: "Customer satisfaction is our priority."
      },

      strengths: {
        global: "Global Reach",
        globalDesc: "Strong international partnerships.",

        logistics: "Logistics",
        logisticsDesc: "Efficient supply chain and shipping.",

        expertise: "Expertise",
        expertiseDesc: "Professional and experienced team.",

        support: "24/7 Support",
        supportDesc: "Continuous customer support."
      },

      /* ====== SECTORS PAGES ====== */
      sectorsPages: {
        servicesTitle: "Our Services",

        engineering: {
          title: "Mosha Engineering",
          desc: "Integrated solutions in contracting, infrastructure and engineering projects.",
          services: [
            "Engineering project execution",
            "General contracting",
            "Project management",
            "Engineering consultancy",
            "Surveying works"
          ]
        },

        medical: {
          title: "Mosha Medical",
          desc: "Supply of medical equipment and healthcare products.",
          services: [
            "Modern medical devices",
            "Medical consumables",
            "Maintenance services"
          ]
        },

        agriculture: {
          title: "Mosha Agriculture",
          desc: "Modern agricultural solutions.",
          services: [
            "Agricultural equipment",
            "Fertilizers and pesticides",
            "Irrigation systems",
            "Agricultural consulting"
          ]
        },

        mining: {
          title: "Mosha Mining Equipment",
          desc: "Mining equipment and industrial solutions.",
          services: [
            "Mining equipment",
            "Spare parts",
            "Technical support",
            "Logistics services"
          ]
        },

        energy: {
          title: "Mosha Energy",
          desc: "Power and generator solutions.",
          services: [
            "Generators",
            "Solar systems",
            "Industrial energy solutions",
            "Installation & maintenance"
          ]
        },

        importExport: {
          title: "Mosha Import & Export",
          desc: "International trade and shipping services.",
          services: [
            "International shipping",
            "Custom clearance",
            "Supply chain",
            "Global trade"
          ]
        },

        heavyMachinery: {
          title: "Mosha Heavy Machinery",
          desc: "Heavy equipment and construction machinery supply.",
          services: [
            "Excavators",
            "Loaders",
            "Road equipment",
            "Spare parts"
          ]
        }
      },

      contactNow: "Contact Us Now"
    }
  },

  ar: {
    translation: {
      home: 'الرئيسية',
      about: 'عن الشركة',
      products: 'المنتجات والقطاعات',
      contact: 'اتصل بنا',

      aboutTitle: "من نحن",
      aboutSubtitle: "تعرف أكثر على شركتنا وخدماتنا.",
      aboutDescription: "نقدم خدمات وحلول عالية الجودة في عدة قطاعات مختلفة.",

      contactBtn: "تواصل معنا",

      visionTitle: "رؤيتنا",
      visionText: "أن نصبح شركة رائدة في مجالات الهندسة والطب والزراعة والطاقة والتعدين.",

      missionTitle: "رسالتنا",
      missionText: "تقديم خدمات ومنتجات موثوقة بأعلى معايير الجودة.",

      valuesTitle: "قيمنا",

      strengthTitle: "نقاط قوتنا",

      values: {
        integrity: "النزاهة",
        integrityDesc: "نعمل بشفافية واحترافية.",

        quality: "الجودة",
        qualityDesc: "نقدم أفضل الخدمات والمنتجات.",

        reliability: "الموثوقية",
        reliabilityDesc: "عملاؤنا يثقون في حلولنا.",

        customerFocus: "التركيز على العميل",
        customerFocusDesc: "رضا العميل أولويتنا."
      },

      strengths: {
        global: "الانتشار العالمي",
        globalDesc: "شراكات دولية قوية.",

        logistics: "الخدمات اللوجستية",
        logisticsDesc: "إدارة فعالة للشحن وسلاسل الإمداد.",

        expertise: "الخبرة",
        expertiseDesc: "فريق محترف وذو خبرة.",

        support: "دعم 24/7",
        supportDesc: "دعم متواصل للعملاء."
      },

      /* ====== SECTORS PAGES ====== */
      sectorsPages: {
        servicesTitle: "خدماتنا",

        engineering: {
          title: "موشا الهندسية",
          desc: "نقدم حلول متكاملة في المقاولات والبنية التحتية والمشاريع الهندسية.",
          services: [
            "تنفيذ المشاريع الهندسية",
            "المقاولات العامة",
            "إدارة المشاريع",
            "الاستشارات الهندسية",
            "الأعمال المساحية"
          ]
        },

        medical: {
          title: "موشا الطبية",
          desc: "توريد الأجهزة الطبية والمستلزمات الصحية.",
          services: [
            "أجهزة طبية حديثة",
            "المستهلكات الطبية",
            "خدمات الصيانة"
          ]
        },

        agriculture: {
          title: "موشا الزراعية",
          desc: "حلول متكاملة للقطاع الزراعي الحديث.",
          services: [
            "معدات زراعية",
            "أسمدة ومبيدات",
            "أنظمة الري",
            "استشارات زراعية"
          ]
        },

        mining: {
          title: "موشا لمعدات التعدين",
          desc: "توفير معدات التعدين والحلول الصناعية.",
          services: [
            "معدات التعدين",
            "قطع الغيار",
            "الدعم الفني",
            "الخدمات اللوجستية"
          ]
        },

        energy: {
          title: "موشا للطاقة",
          desc: "حلول الطاقة والمولدات وأنظمة الكهرباء.",
          services: [
            "المولدات الكهربائية",
            "أنظمة الطاقة الشمسية",
            "حلول الطاقة الصناعية",
            "التركيب والصيانة"
          ]
        },

        importExport: {
          title: "موشا للاستيراد والتصدير",
          desc: "خدمات التجارة الدولية والشحن.",
          services: [
            "الشحن الدولي",
            "التخليص الجمركي",
            "سلاسل الإمداد",
            "التجارة العالمية"
          ]
        },

        heavyMachinery: {
          title: "موشا للآليات الثقيلة",
          desc: "توريد الآليات الثقيلة ومعدات البناء.",
          services: [
            "حفارات",
            "شيولات",
            "معدات الطرق",
            "قطع الغيار"
          ]
        }
      },

      contactNow: "تواصل معنا الآن"
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