export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'heavy-machinery' | 'medical-supplies' | 'general-goods';
  price?: string;
  image: string;
  specifications?: string;
  specificationsAr?: string;
  origin?: string;
  createdAt: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type Category = 'heavy-machinery' | 'medical-supplies' | 'general-goods';

export const CATEGORIES: { value: Category; label: string; labelAr: string }[] = [
  { value: 'heavy-machinery', label: 'Heavy Machinery & Equipment', labelAr: 'الآلات الثقيلة والمعدات' },
  { value: 'medical-supplies', label: 'Medical Supplies & Equipment', labelAr: 'المستلزمات والمعدات الطبية' },
  { value: 'general-goods', label: 'General Goods & Commodities', labelAr: 'السلع والمنتجات العامة' },
];