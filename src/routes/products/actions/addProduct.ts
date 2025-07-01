import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithCode, isErrorWithMessage } from "@utils/error";
import type { Response } from "express";

import { PRODUCTS_ERRORS } from "../products.constant";
import { addProductService } from "../services/addProduct";

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

    res.status(500).json({ error: PRODUCTS_ERRORS.INTERNAL_SERVER_ERROR });
  }
};
