import { logger } from "@services/logger";
import { isErrorWithMessage } from "@utils/error";
import type { Request, Response } from "express";

import { SUBCATEGORIES_ERRORS } from "./subcategories.constant";
import { getSubcategoriesByCategoryIdService } from "./subcategories.service";

export const getSubcategoriesAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId } = req.params;
  logger.info("🔍 Retrieving subcategories for categoryId:", { categoryId });

  try {
    const subcategories = await getSubcategoriesByCategoryIdService(categoryId);
    logger.info("✅ Subcategories retrieved successfully:", subcategories);
    res.json(subcategories);
  } catch (error) {
    logger.error("❌ Error while retrieving subcategories:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isErrorWithMessage(error, SUBCATEGORIES_ERRORS.CATEGORY_NOT_FOUND)) {
      res.status(404).json({ error: SUBCATEGORIES_ERRORS.CATEGORY_NOT_FOUND });
      return;
    }

    res.status(500).json({ error: SUBCATEGORIES_ERRORS.INTERNAL_SERVER_ERROR });
  }
};
