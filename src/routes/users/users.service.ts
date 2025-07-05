import type { USER_CAMEL_DTO, USER_DTO } from "@models/users";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQueryOne } from "@services/query";
import { partialUpdateForQuery } from "@utils/query";

import { USER_UPDATE_FIELDS, USERS_DAL, USERS_ERRORS } from "./users.constant";

const getUserByIdService = async (userId: string): Promise<USER_CAMEL_DTO> => {
  logger.debug("getUserByIdService called with userId:", { userId });

  const result = await safeQueryOne<USER_DTO>(dal[USERS_DAL.getUserById], [
    userId,
  ]);

  if (!result) {
    throw new Error(USERS_ERRORS.USER_NOT_FOUND);
  }
  return result;
};

const updateUserByIdService = async (
  reqestUserId: string,
  userId: string,
  updateData: Partial<USER_CAMEL_DTO>
): Promise<USER_CAMEL_DTO> => {
  logger.info("updateUserByIdService called with :", {
    userId,
    updateData,
    reqestUserId,
  });

  if (reqestUserId !== userId) {
    logger.error("❌ Unauthorized update attempt:", {
      requestUserId: reqestUserId,
      userId,
    });
    throw new Error(USERS_ERRORS.UNAUTHORIZED);
  }

  const valuesToUpdate = partialUpdateForQuery(
    [...USER_UPDATE_FIELDS],
    updateData
  );

  const updatedUser = await safeQueryOne<USER_DTO>(
    dal[USERS_DAL.updateUserById],
    [userId, ...valuesToUpdate]
  );

  if (!updatedUser) {
    throw new Error(USERS_ERRORS.USER_NOT_FOUND);
  }

  logger.info("✅ User updated successfully:", {
    updatedUser,
  });

  return updatedUser;
};

export { getUserByIdService, updateUserByIdService };
