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
export const CATEGORIES = [
  "All",
  "Heavy Machinery",
  "Medical Supplies",
  "Generators",
  "Spare Parts",
  "General Goods"
];