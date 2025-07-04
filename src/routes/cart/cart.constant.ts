export const CART_ERRORS = {
  ITEM_NOT_FOUND: "Cart item not found",
  PRODUCT_NOT_FOUND: "Product not found",
  UNAUTHORIZED: "Unauthorized action",
  UNKNOWN: "Unknown cart error",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

export const CART_DAL = {
  addItem: "cart/addItem",
  updateItem: "cart/updateItem",
  deleteItem: "cart/deleteItem",
  getItemsByUserId: "cart/getItemsByUserId",
  getSummaryByUserId: "cart/getSummaryByUserId",
  getItemById: "cart/getItemCartById",
};
