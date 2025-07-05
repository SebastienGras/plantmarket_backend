import type {
  PRODUCTS_CAMEL_WITH_CATEGORY_DTO,
  PRODUCTS_WITH_CATEGORY_DTO,
} from "@models/products";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQueryOne } from "@services/query";

import { PRODUCTS_DAL, PRODUCTS_ERRORS } from "../products.constant";

export const getProductByIdService = async (
  productId: string
): Promise<PRODUCTS_CAMEL_WITH_CATEGORY_DTO> => {
  logger.info("🔍 getProductByIdService called with productId:", {
    productId,
  });

  const product = await safeQueryOne<PRODUCTS_WITH_CATEGORY_DTO>(
    dal[PRODUCTS_DAL.getProductById],
    [productId]
  );
  if (!product) {
    logger.error("❌ Product not found:", {
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
  }
  logger.info("✅ Product retrieved successfully:", {
    product: product,
  });
  return product;
};
