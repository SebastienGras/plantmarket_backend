import type { PRODUCT_CAMEL_DTO, PRODUCT_DTO } from "@models/products";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQueryOne } from "@services/query";

import { PRODUCTS_DAL, PRODUCTS_ERRORS } from "../products.constant";

export const addProductService = async (
  userId: string,
  productData: Partial<PRODUCT_CAMEL_DTO>
): Promise<PRODUCT_CAMEL_DTO> => {
  logger.info("🔍 addProductService called with :", {
    userId,
    productData,
  });

  const newProduct = await safeQueryOne<PRODUCT_DTO>(
    dal[PRODUCTS_DAL.addProduct],
    [
      productData.title,
      productData.description,
      productData.price,
      productData.categoryId,
      productData.subcategoryId,
      productData.stock,
      userId,
      productData.actif,
    ]
  );

  if (!newProduct) {
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_CREATED);
  }

  logger.info("✅ Product added successfully:", {
    newProduct: newProduct,
  });

  return newProduct;
};
