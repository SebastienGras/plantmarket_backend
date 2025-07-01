import type { PRODUCTS_CAMEL_WITH_CATEGORY_DTO } from "@models/products";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQuery } from "@services/query";

import { PRODUCTS_DAL } from "../products.constant";

export const getProductsByUserIdService = async (
  userId: string
): Promise<PRODUCTS_CAMEL_WITH_CATEGORY_DTO[]> => {
  logger.info("🔍 getProductsByUserIdService called with userId:", {
    userId,
  });

  const products = await safeQuery<PRODUCTS_CAMEL_WITH_CATEGORY_DTO>(
    dal[PRODUCTS_DAL.getProductsByUserId],
    [userId]
  );

  if (!products?.rowCount || products.rowCount === 0) {
    logger.warn("No products found for user:", { userId });
    return [];
  }

  logger.info("✅ Products retrieved successfully:", {
    products: products.rows,
  });

  return products.rows;
};
