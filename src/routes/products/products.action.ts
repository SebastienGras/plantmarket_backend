import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithCode, isErrorWithMessage } from "@utils/error";
import type { Request, Response } from "express";

import { PRODUCTS_ERRORS } from "./products.constant";
import {
  addProductService,
  getProductsByUserIdService,
  getProductsListingService,
  updateProductService,
} from "./products.service";

export const addProductAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("🔍 Adding new product for user :", {
    productData: req.body,
    userId: req.params.userId,
  });

  try {
    const newProduct = await addProductService(req.userId!, req.body);

    logger.info("✅ Product added successfully:", newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    logger.error("❌ Error while adding product:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isErrorWithCode(error, "23503")) {
      res
        .status(409)
        .json({ error: PRODUCTS_ERRORS.PRODUCT_CATEGORY_NOT_FOUND });
      return;
    }

    if (isErrorWithMessage(error, PRODUCTS_ERRORS.UNAUTHORIZED)) {
      res.status(403).json({ error: PRODUCTS_ERRORS.UNAUTHORIZED });
      return;
    }
    if (isErrorWithMessage(error, PRODUCTS_ERRORS.PRODUCT_NOT_CREATED)) {
      res.status(400).json({ error: PRODUCTS_ERRORS.PRODUCT_NOT_CREATED });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProductAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("🔄 Updating product for user:", {
    productId: req.params.productId,
    updateData: req.body,
    userId: req.userId,
  });

  try {
    const updatedProduct = await updateProductService(
      req.userId!, // req.userId is guaranteed to be present due to auth middleware
      req.params.productId,
      req.body
    );
    logger.info("✅ Product updated successfully:", {
      productId: req.params.productId,
      updateData: req.body,
      updatedProduct,
    });
    res.json(updatedProduct);
  } catch (error) {
    logger.error("❌ Error while updating product:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isErrorWithMessage(error, PRODUCTS_ERRORS.UNAUTHORIZED)) {
      res.status(403).json({ error: PRODUCTS_ERRORS.UNAUTHORIZED });
      return;
    }

    if (isErrorWithMessage(error, PRODUCTS_ERRORS.PRODUCT_NOT_FOUND)) {
      res.status(404).json({ error: PRODUCTS_ERRORS.PRODUCT_NOT_FOUND });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

export const getProductsByUserIdAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("🔍 Retrieving products for user:", {
    userId: req.params.userId,
  });

  try {
    const products = await getProductsByUserIdService(req.params.userId);
    logger.info("✅ Products retrieved successfully:", products);
    res.json(products);
  } catch (error) {
    logger.error("❌ Error while retrieving products:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductsListingAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("🔍 Retrieving products listing with query:", {
    query: req.query,
  });

  try {
    const products = await getProductsListingService(
      req.query as Record<string, string | boolean | number>
    );
    logger.info("✅ Products listing retrieved successfully:", products);
    res.json(products);
  } catch (error) {
    logger.error("❌ Error while retrieving products listing:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({ error: "Internal Server Error" });
  }
};
