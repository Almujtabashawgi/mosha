export interface Product {
  id: number;
  name: string;
  namear: string;
  description: string;
  descriptionar: string;
  category: string;
  price?: string;
  image: string;
  specifications?: string;
  specificationsar?: string;
  origin?: string;
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