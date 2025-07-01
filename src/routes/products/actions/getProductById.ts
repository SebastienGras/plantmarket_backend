import { logger } from "@services/logger";
import { isErrorWithMessage } from "@utils/error";
import type { Request, Response } from "express";

import { PRODUCTS_ERRORS } from "../products.constant";
import { getProductByIdService } from "../services/getProductById";

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
    res.status(500).json({ error: PRODUCTS_ERRORS.INTERNAL_SERVER_ERROR });
    return;
  }
};
