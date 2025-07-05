export const PRODUCTS_DAL = {
  addProduct: "products/addProduct",
  getProductById: "products/getProductById",
  getProductsByUserId: "products/getProductsByUserId",
  getProductsListing: "products/getProductsListing",
  getAllProducts: "products/getAllProducts",
  updateProduct: "products/updateProduct",
  deleteProduct: "products/deleteProduct",
} as const;
export type ProductsDAL = typeof PRODUCTS_DAL;

export const PRODUCTS_ERRORS = {
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_NOT_CREATED: "Product not created",
  PRODUCT_NOT_UPDATED: "Product not updated",
  PRODUCT_NOT_DELETED: "Product not deleted",
  PRODUCT_CATEGORY_NOT_FOUND: "Product category not found",
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export const PRODUCT_UPDATE_FIELDS = [
  "title",
  "description",
  "price",
  "categoryId",
  "subcategoryId",
  "stock",
  "actif",
] as const;

export const PRODUCTS_SEARCH_FIELDS = [
  "actif",
  "categoryId",
  "subcategoryId",
  "minPrice",
  "maxPrice",
  "search",
  "notSellerId",
] as const;

export type ProductsErrors = typeof PRODUCTS_ERRORS;
