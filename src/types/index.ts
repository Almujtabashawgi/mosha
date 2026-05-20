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
    value: "engineering",
    label: "Engineering",
    labelAr: "الهندسة"
  },
  {
    value: "medical-supplies",
    label: "Medical Supplies",
    labelAr: "المستلزمات الطبية"
  },
  {
    value: "agriculture",
    label: "Agriculture",
    labelAr: "الزراعة"
  },
  {
    value: "mining",
    label: "Mining",
    labelAr: "التعدين"
  },
  {
    value: "energy",
    label: "Energy",
    labelAr: "الطاقة"
  },
  {
    value: "import-export",
    label: "Import & Export",
    labelAr: "الاستيراد والتصدير"
  }
];