import type { CamelCasedProperties } from "@services/query";

export type PRODUCT_DTO = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  subcategory_id: string;
  seller_id: string;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PRODUCT_CAMEL_DTO = CamelCasedProperties<PRODUCT_DTO>;

export type PRODUCTS_WITH_CATEGORY_DTO = PRODUCT_DTO & {
  category_name: string;
  subcategory_name: string;
};

export type PRODUCTS_CAMEL_WITH_CATEGORY_DTO =
  CamelCasedProperties<PRODUCTS_WITH_CATEGORY_DTO>;
