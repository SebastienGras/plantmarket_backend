import type {
  PRODUCT_CAMEL_DTO,
  PRODUCT_DTO,
  PRODUCTS_CAMEL_WITH_CATEGORY_DTO,
} from "@models/products";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQuery } from "@services/query";
import { partialUpdateForQuery } from "@utils/query";

import {
  PRODUCT_UPDATE_FIELDS,
  PRODUCTS_DAL,
  PRODUCTS_ERRORS,
  PRODUCTS_SEARCH_FIELDS,
} from "./products.constant";

export const addProductService = async (
  userId: string,
  productData: Partial<PRODUCT_CAMEL_DTO>
): Promise<PRODUCT_CAMEL_DTO> => {
  logger.info("🔍 addProductService called with :", {
    userId,
    productData,
  });

  const newProduct = await safeQuery<PRODUCT_DTO>(
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

  if (!newProduct?.rowCount || newProduct.rowCount === 0) {
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_CREATED);
  }

  logger.info("✅ Product added successfully:", {
    newProduct: newProduct.rows[0],
  });

  return newProduct.rows[0];
};

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

  const product = await safeQuery<PRODUCT_CAMEL_DTO>(
    dal[PRODUCTS_DAL.getProductById],
    [productId]
  );

  if (!product || !product.rows || product.rows.length === 0) {
    logger.error("❌ Product not found:", {
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
  }

  if (userId !== product.rows[0].sellerId) {
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

  const updatedProduct = await safeQuery<PRODUCT_CAMEL_DTO>(
    dal[PRODUCTS_DAL.updateProduct],
    [productId, ...valuesToUpdate]
  );

  if (!updatedProduct?.rowCount || updatedProduct.rowCount === 0) {
    logger.error("❌ Product not updated:", {
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_UPDATED);
  }

  logger.info("✅ Product updated successfully:", {
    updatedProduct: updatedProduct.rows[0],
  });

  return updatedProduct.rows[0];
};

export const getProductByIdService = async (
  productId: string
): Promise<PRODUCTS_CAMEL_WITH_CATEGORY_DTO> => {
  logger.info("🔍 getProductByIdService called with productId:", {
    productId,
  });

  const product = await safeQuery<PRODUCTS_CAMEL_WITH_CATEGORY_DTO>(
    dal[PRODUCTS_DAL.getProductById],
    [productId]
  );
  if (!product || !product.rows || product.rows.length === 0) {
    logger.error("❌ Product not found:", {
      productId,
    });
    throw new Error(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
  }
  logger.info("✅ Product retrieved successfully:", {
    product: product.rows[0],
  });
  return product.rows[0];
};

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
