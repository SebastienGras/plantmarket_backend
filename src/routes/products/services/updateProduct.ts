import type { PRODUCT_CAMEL_DTO, PRODUCT_DTO } from "@models/products";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQueryOne } from "@services/query";
import { partialUpdateForQuery } from "@utils/query";

import {
  PRODUCT_UPDATE_FIELDS,
  PRODUCTS_DAL,
  PRODUCTS_ERRORS,
} from "../products.constant";

export const updateProductService = async (
  userId: string,
  productId: string,
  updateData: Partial<PRODUCT_CAMEL_DTO>
): Promise<PRODUCT_CAMEL_DTO> => {
  logger.info("🔄 updateProductService called with :", {
    userId,
    productId,
    updateData,
  });

  const product = await safeQueryOne<PRODUCT_DTO>(
    dal[PRODUCTS_DAL.getProductById],
    [productId]
  );

  if (!product) {
    logger.error("❌ Product not found:", {
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
  }

  if (userId !== product.sellerId) {
    logger.error("❌ Unauthorized update attempt:", {
      userId,
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.UNAUTHORIZED);
  }

  const valuesToUpdate = partialUpdateForQuery(
    [...PRODUCT_UPDATE_FIELDS],
    updateData
  );

  const updatedProduct = await safeQueryOne<PRODUCT_DTO>(
    dal[PRODUCTS_DAL.updateProduct],
    [productId, ...valuesToUpdate]
  );

  if (!updatedProduct) {
    logger.error("❌ Product not updated:", {
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_UPDATED);
  }

  logger.info("✅ Product updated successfully:", {
    updatedProduct: updatedProduct,
  });

  return updatedProduct;
};
