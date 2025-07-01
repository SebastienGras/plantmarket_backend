import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithMessage } from "@utils/error";
import type { Response } from "express";

import { PRODUCTS_ERRORS } from "../products.constant";
import { deleteProductService } from "../services/deleteProduct";

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

    res.status(200).json({});
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

    res.status(500).json({ message: PRODUCTS_ERRORS.INTERNAL_SERVER_ERROR });
    return;
  }
};
