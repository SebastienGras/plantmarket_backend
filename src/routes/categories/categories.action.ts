import { logger } from "@services/logger";
import type { Request, Response } from "express";

import { CATEGORIES_ERRORS } from "./categories.constant";
import { getCategoriesService } from "./categories.service";

export const getCategoriesAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("🔍 Retrieving categories");

  try {
    const categories = await getCategoriesService();
    logger.info("✅ Categories retrieved successfully:", categories);
    res.json(categories);
  } catch (error) {
    logger.error("❌ Error while retrieving categories:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({ error: CATEGORIES_ERRORS.INTERNAL_SERVER_ERROR });
  }
};
