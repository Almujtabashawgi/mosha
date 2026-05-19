export interface Product {
  id: number | string;

  name: string;
  nameAr: string;

  description: string;
  descriptionAr: string;

  // وصف طويل يظهر في الـ popup
  details?: string;
  detailsAr?: string;

  category: string;
  price?: string;

  // صورة الكرت الأساسية
  image: string;

  // 🔥 صور متعددة للـ modal
  images?: string[];

  // 🔥 فيديو يوتيوب اختياري
  video?: string;

  specifications?: string;
  specificationsAr?: string;
  origin?: string;
}