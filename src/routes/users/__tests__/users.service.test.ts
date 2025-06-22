import * as safeQueryModule from "@services/query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { USERS_ERRORS } from "../users.constant";
import { getUserByIdService, updateUserByIdService } from "../users.service";

describe("getUserByIdService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user if found", async () => {
    vi.spyOn(safeQueryModule, "safeQuery").mockResolvedValueOnce({
      rows: [{ id: "123", email: "test@example.com" }],
      rowCount: 1,
    });

    const user = await getUserByIdService("123");
    expect(user).toEqual({ id: "123", email: "test@example.com" });
  });

  it("should throw USER_NOT_FOUND if user does not exist", async () => {
    vi.spyOn(safeQueryModule, "safeQuery").mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    await expect(getUserByIdService("999")).rejects.toThrow(
      USERS_ERRORS.USER_NOT_FOUND
    );
  });
});

describe("updateUserByIdService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("throws error if user is not authorized", async () => {
    await expect(
      updateUserByIdService("123", "456", { firstname: "New Name" })
    ).rejects.toThrow(USERS_ERRORS.UNAUTHORIZED);
  });
  it("should throw USER_NOT_FOUND if user does not exist", async () => {
    vi.spyOn(safeQueryModule, "safeQuery").mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    await expect(
      updateUserByIdService("123", "123", { firstname: "New Name" })
    ).rejects.toThrow(USERS_ERRORS.USER_NOT_FOUND);
  });

  it("should update user if authorized", async () => {
    vi.spyOn(safeQueryModule, "safeQuery").mockResolvedValueOnce({
      rows: [{ id: "123", firstname: "New Name" }],
      rowCount: 1,
    });

    const updatedUser = await updateUserByIdService("123", "123", {
      firstname: "New Name",
    });
    expect(updatedUser).toEqual({ id: "123", firstname: "New Name" });
  });
});
