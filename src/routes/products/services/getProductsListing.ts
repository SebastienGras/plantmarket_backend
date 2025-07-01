import type { PRODUCTS_CAMEL_WITH_CATEGORY_DTO } from "@models/products";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQuery } from "@services/query";
import { partialUpdateForQuery } from "@utils/query";

import { PRODUCTS_DAL, PRODUCTS_SEARCH_FIELDS } from "../products.constant";

export const getProductsListingService = async (
  query: Record<string, string | boolean | number>
): Promise<PRODUCTS_CAMEL_WITH_CATEGORY_DTO[]> => {
  logger.info("🔍 getProductsListingService called with query:", {
    query,
  });

  const valuesToSearch = partialUpdateForQuery(
    [...PRODUCTS_SEARCH_FIELDS],
    query
  );

  const products = await safeQuery<PRODUCTS_CAMEL_WITH_CATEGORY_DTO>(
    dal[PRODUCTS_DAL.getProductsListing],
    valuesToSearch
  );

  if (!products?.rowCount || products.rowCount === 0) {
    logger.warn("No products found for the listing query:", { query });
    return [];
  }

  logger.info("✅ Products listing retrieved successfully:", {
    products: products.rows,
  });

  return products.rows;
};
