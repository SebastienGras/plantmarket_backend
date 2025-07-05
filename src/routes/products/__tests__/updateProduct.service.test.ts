import * as safeQueryModule from "@services/query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PRODUCTS_ERRORS } from "../products.constant";
import { updateProductService } from "../services/updateProduct";

describe("updateProductService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw PRODUCT_NOT_FOUND if product does not exist", async () => {
    vi.spyOn(safeQueryModule, "safeQueryOne").mockResolvedValueOnce(null);

    await expect(
      updateProductService("123", "1", { price: 200 })
    ).rejects.toThrow(PRODUCTS_ERRORS.PRODUCT_NOT_FOUND);
  });

  it("should throw UNAUTHORIZED if product does not belong to user", async () => {
    vi.spyOn(safeQueryModule, "safeQueryOne").mockResolvedValueOnce({
      id: "1",
      sellerId: "456",
    });

    await expect(
      updateProductService("123", "1", { price: 200 })
    ).rejects.toThrow(PRODUCTS_ERRORS.UNAUTHORIZED);
  });

  it("should update product if authorized and product found", async () => {
    // Mock the safeQueryOne function to return a product
    // The first call checks if the product exists,
    // and the second call updates the product with the new price
    vi.spyOn(safeQueryModule, "safeQueryOne")
      .mockResolvedValueOnce({
        id: "1",
        sellerId: "123",
      })
      .mockResolvedValueOnce({
        id: "1",
        sellerId: "123",
        price: 200,
      });

    const updatedProduct = await updateProductService("123", "1", {
      price: 200,
    });
    expect(updatedProduct).toEqual({ id: "1", sellerId: "123", price: 200 });
  });
});
