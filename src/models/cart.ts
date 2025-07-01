import type { CamelCasedProperties } from "@services/query";

export type CART_DTO = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
};

export type CART_CAMEL_DTO = CamelCasedProperties<CART_DTO>;

export type CART_SUMMARY_DTO = {
  user_id: string;
  cart_id: string;
  item_count: number;
  total_price: number;
};

export type CART_SUMMARY_CAMEL_DTO = CamelCasedProperties<CART_SUMMARY_DTO>;
