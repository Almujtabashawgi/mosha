export interface Product {
  id: number | string;

  name: string;
  nameAr: string;

  description: string;
  descriptionAr: string;

  details?: string;
  detailsAr?: string;

  category: string;
  price?: string;

  image: string;
  images?: string[];
  video?: string;

  specifications?: string;
  specificationsAr?: string;
  origin?: string;
}

// ⭐️ هذا هو الجزء الناقص اللي سبب المشكلة
export interface Category {
  value: string;
  label: string;
  labelAr: string;
}

export const CATEGORIES: Category[] = [
  {
    value: "heavy-machinery",
    label: "Heavy Machinery",
    labelAr: "المعدات الثقيلة"
  },
  {
    value: "medical-supplies",
    label: "Medical Supplies",
    labelAr: "المستلزمات الطبية"
  },
  {
    value: "generators",
    label: "Generators",
    labelAr: "المولدات"
  },
  {
    value: "spare-parts",
    label: "Spare Parts",
    labelAr: "قطع الغيار"
  },
  {
    value: "general-goods",
    label: "General Goods",
    labelAr: "بضائع عامة"
  }
];