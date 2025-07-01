import type { CART_CAMEL_DTO, CART_SUMMARY_CAMEL_DTO } from "@models/cart";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQuery } from "@services/query";

const CART_ERRORS = {
  ITEM_NOT_FOUND: "Cart item not found",
  PRODUCT_NOT_FOUND: "Product not found",
};

const CART_DAL = {
  addItem: "cart/addItemCart",
  updateItem: "cart/updateItemCart",
  deleteItem: "cart/deleteItemCart",
  getItemsByUserId: "cart/getItemsCartByUserId",
  getItemById: "cart/getItemCartById",
};

export const addItemToCartService = async (
  userId: string,
  data: { productId: string; quantity: number }
): Promise<CART_CAMEL_DTO> => {
  logger.info("🛒 addItemToCartService called:", { userId, data });

  const result = await safeQuery<CART_CAMEL_DTO>(dal[CART_DAL.addItem], [
    userId,
    data.productId,
    data.quantity,
  ]);

  if (!result?.rowCount || result.rowCount === 0) {
    throw new Error(CART_ERRORS.PRODUCT_NOT_FOUND);
  }

  logger.info("✅ Item added to cart:", result.rows[0]);
  return result.rows[0];
};

export const updateCartItemService = async (
  userId: string,
  itemCartId: string,
  quantity: number
): Promise<CART_CAMEL_DTO> => {
  logger.info("📝 updateCartItemService called:", {
    userId,
    itemCartId,
    quantity,
  });

  const item = await safeQuery<CART_CAMEL_DTO>(dal[CART_DAL.getItemById], [
    itemCartId,
  ]);

  if (!item?.rowCount || item.rows.length === 0) {
    throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
  }

  if (item.rows[0].userId !== userId) {
    throw new Error("Unauthorized");
  }

  const updated = await safeQuery<CART_CAMEL_DTO>(dal[CART_DAL.updateItem], [
    itemCartId,
    quantity,
  ]);

  if (!updated?.rowCount || updated.rowCount === 0) {
    throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
  }

  logger.info("✅ Cart item updated:", updated.rows[0]);
  return updated.rows[0];
};

export const deleteItemFromCartService = async (
  userId: string,
  itemCartId: string
): Promise<void> => {
  logger.info("🗑 deleteItemFromCartService called:", { userId, itemCartId });

  const item = await safeQuery<CART_CAMEL_DTO>(dal[CART_DAL.getItemById], [
    itemCartId,
  ]);

  if (!item?.rowCount || item.rows.length === 0) {
    throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
  }

  if (item.rows[0].userId !== userId) {
    throw new Error("Unauthorized");
  }

  const deleted = await safeQuery(dal[CART_DAL.deleteItem], [itemCartId]);

  if (!deleted?.rowCount || deleted.rowCount === 0) {
    throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
  }

  logger.info("✅ Cart item deleted successfully");
};

export const getCartItemsByUserIdService = async (
  userId: string
): Promise<CART_SUMMARY_CAMEL_DTO> => {
  logger.info("📦 getCartItemsByUserIdService called:", { userId });

  const result = await safeQuery<CART_SUMMARY_CAMEL_DTO>(
    dal[CART_DAL.getItemsByUserId],
    [userId]
  );

  if (!result?.rowCount || result.rowCount === 0) {
    logger.info("ℹ️ No items in cart for user:", { userId });
    return {
      userId,
      cartId: "",
      itemCount: 0,
      totalPrice: 0,
    };
  }

  logger.info("✅ Cart items retrieved:", result.rows);
  return result.rows[0];
};
