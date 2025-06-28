export type CART_DTO = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
};

export type CART_CAMEL_DTO = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CART_WITH_CART_DTO = CART_CAMEL_DTO & {
  cart: CART_CAMEL_DTO;
};
