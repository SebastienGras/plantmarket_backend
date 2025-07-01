import { logger } from "@services/logger";
import type { Request, Response } from "express";

import { PRODUCTS_ERRORS } from "../products.constant";
import { getProductsListingService } from "../services/getProductsListing";

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

    res.status(500).json({ error: PRODUCTS_ERRORS.INTERNAL_SERVER_ERROR });
  }
};
