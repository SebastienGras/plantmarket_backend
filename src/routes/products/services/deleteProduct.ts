import type { PRODUCT_CAMEL_DTO } from "@models/products";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQuery } from "@services/query";

import { PRODUCTS_DAL, PRODUCTS_ERRORS } from "../products.constant";

export const deleteProductService = async (
  userId: string,
  productId: string
): Promise<PRODUCT_CAMEL_DTO> => {
  logger.info("🗑 deleteProductService called with:", {
    userId,
    productId,
  });

  const product = await safeQuery<PRODUCT_CAMEL_DTO>(
    dal[PRODUCTS_DAL.getProductById],
    [productId]
  );

  if (!product || !product.rows || product.rows.length === 0) {
    logger.error("❌ Product not found:", { productId });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
  }

  const foundProduct = product.rows[0];

  if (userId !== foundProduct.sellerId) {
    logger.error("❌ Unauthorized delete attempt:", {
      userId,
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.UNAUTHORIZED);
  }

  const deletedProduct = await safeQuery<PRODUCT_CAMEL_DTO>(
    dal[PRODUCTS_DAL.deleteProduct],
    [productId]
  );

  if (!deletedProduct?.rowCount || deletedProduct.rowCount === 0) {
    logger.error("❌ Product not deleted:", { productId });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_DELETED);
  }

  logger.info("✅ Product deleted successfully:", {
    deletedProduct: foundProduct,
  });

  return foundProduct;
};
