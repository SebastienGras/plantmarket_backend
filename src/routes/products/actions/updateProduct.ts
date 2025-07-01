import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithMessage } from "@utils/error";
import type { Response } from "express";

import { PRODUCTS_ERRORS } from "../products.constant";
import { updateProductService } from "../services/updateProduct";

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

    res.status(500).json({ error: PRODUCTS_ERRORS.INTERNAL_SERVER_ERROR });
    return;
  }
};
