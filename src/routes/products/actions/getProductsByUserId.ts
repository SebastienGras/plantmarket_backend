import { logger } from "@services/logger";
import type { Request, Response } from "express";

import { PRODUCTS_ERRORS } from "../products.constant";
import { getProductsByUserIdService } from "../services/getProductsByUserId";

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

    res.status(500).json({ error: PRODUCTS_ERRORS.INTERNAL_SERVER_ERROR });
  }
};
