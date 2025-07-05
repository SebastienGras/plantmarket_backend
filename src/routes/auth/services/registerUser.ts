import type { USER_CAMEL_DTO, USER_DTO } from "@models/users";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQueryOne } from "@services/query";
import * as bcrypt from "bcrypt";

import { AUTH_DAL, AUTH_ERRORS } from "../auth.constant";
import type { RegisterUserInput } from "../auth.validator";

const registerUserService = async (
  user: RegisterUserInput
): Promise<USER_CAMEL_DTO> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const values = [user.email, hashedPassword];

  if (user.password !== user.confirmPassword) {
    logger.error("❌ Password mismatch:", {
      email: user.email,
    });
    throw new Error(AUTH_ERRORS.PASSWORD_MISMATCH);
  }

  const result = await safeQueryOne<USER_DTO>(
    dal[AUTH_DAL.registerUser],
    values
  );
  if (!result) {
    throw new Error("Query result is null");
  }
  return result;
};

export { registerUserService };
