import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithCode, isErrorWithMessage } from "@utils/error";
import type { Request, Response } from "express";

import { PRODUCTS_ERRORS } from "./products.constant";
import {
  addProductService,
  deleteProductService,
  getProductByIdService,
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

export const deleteProductAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    logger.info("🔄 Deleting product for user:", {
      productId: req.params.productId,
      userId: req.userId,
    });

    await deleteProductService(req.userId!, req.params.productId);

    logger.info("✅ Product deleted successfully:", {
      productId: req.params.productId,
    });

    res.status(204);
    return;
  } catch (error) {
    logger.error("❌ Error while deleting product:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isErrorWithMessage(error, PRODUCTS_ERRORS.PRODUCT_NOT_FOUND)) {
      res.status(404).json({ error: PRODUCTS_ERRORS.PRODUCT_NOT_FOUND });
      return;
    }

    if (isErrorWithMessage(error, PRODUCTS_ERRORS.UNAUTHORIZED)) {
      res.status(403).json({ error: PRODUCTS_ERRORS.UNAUTHORIZED });
      return;
    }

    res.status(500).json({ message: "Internal Server Error" });
    return;
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
      req.userId!,
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

export const getProductByIdAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("🔍 Retrieving product by ID:", {
    productId: req.params.productId,
  });
  try {
    const product = await getProductByIdService(req.params.productId);

    logger.info("✅ Product retrieved successfully:", product);
    res.json(product);
  } catch (error) {
    logger.error("❌ Error while retrieving product:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    if (isErrorWithMessage(error, PRODUCTS_ERRORS.PRODUCT_NOT_FOUND)) {
      res.status(404).json({ error: PRODUCTS_ERRORS.PRODUCT_NOT_FOUND });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
    return;
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
