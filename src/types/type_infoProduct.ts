
export const PRODUCT_CATEGORIES = [
  "หนังสือ/วิชา",
  "ของใช้ในหอ",
  "อิเล็กทรอนิกส์",
  "เสื้อผ้า",
  "กีฬา",
] as const;

export type ProductCategory =
  (typeof PRODUCT_CATEGORIES)[number];

export type CategoryFilterValue =
  | ProductCategory
  | "";

export type CategoryFilterProps = {
  value: CategoryFilterValue;
  onChange: (
    value: CategoryFilterValue,
  ) => void;
};

export type ProductStatus =
  | "Selling"
  | "Reserved"
  | "Sold";

export type InfoProduct = {
  id: string;
  image?: string;

  Price: number;
  Name: string;
  Description: string;
  Category: ProductCategory;
  status: ProductStatus;

  sellerName?: string;
  sellerEmail?: string;
  sellerImage?: string;
};
