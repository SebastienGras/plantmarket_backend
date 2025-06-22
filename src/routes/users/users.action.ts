import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithMessage } from "@utils/error";
import type { Request, Response } from "express";

import { USERS_ERRORS } from "./users.constant";
import { getUserByIdService, updateUserByIdService } from "./users.service";

export const getUserByIdAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("🔍 Retrieving user by ID:", {
    userId: req.params.id,
  });

  try {
    const user = await getUserByIdService(req.params.id);
    logger.info("✅ User retrieved successfully:", user);
    res.json(user);
  } catch (error) {
    logger.error("❌ Error while getting user:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isErrorWithMessage(error, USERS_ERRORS.USER_NOT_FOUND)) {
      res.status(404).json({ error: USERS_ERRORS.USER_NOT_FOUND });
      return;
    }

    res.status(500).json({ error: USERS_ERRORS.INTERNAL_SERVER_ERROR });
    return;
  }
};

export const updateUserByIdAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("🔄 Updating user by ID:", {
    userId: req.params.id,
    updateData: req.body,
  });

  try {
    const updatedUser = await updateUserByIdService(
      req.userId!,
      req.params.id,
      req.body
    );
    logger.info("✅ User updated successfully:", {
      userId: req.params.id,
      updateData: req.body,
      updatedUser,
    });
    res.json(updatedUser);
  } catch (error) {
    logger.error("❌ Error while updating user:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isErrorWithMessage(error, USERS_ERRORS.USER_NOT_FOUND)) {
      res.status(404).json({ error: USERS_ERRORS.USER_NOT_FOUND });
      return;
    }

    if (isErrorWithMessage(error, USERS_ERRORS.UNAUTHORIZED)) {
      res.status(403).json({ error: USERS_ERRORS.UNAUTHORIZED });
      return;
    }

    res.status(500).json({ error: USERS_ERRORS.INTERNAL_SERVER_ERROR });
    return;
  }
};
