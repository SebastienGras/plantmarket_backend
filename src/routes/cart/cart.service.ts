import type {
  CART_CAMEL_DTO,
  CART_DELETED_CAMEL_DTO,
  CART_ITEMS_CAMEL_DTO,
  CART_SUMMARY_CAMEL_DTO,
  CART_UPDATED_CAMEL_DTO,
} from "@models/cart";
import { dal } from "@services/dal";
import { logger } from "@services/logger";
import { safeQuery } from "@services/query";

import { CART_DAL, CART_ERRORS } from "./cart.constant";

export const addItemService = async (
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

export const updateItemService = async (
  userId: string,
  cartId: string,
  productId: string,
  quantity: number
): Promise<CART_UPDATED_CAMEL_DTO> => {
  logger.info("📝 updateCartItemService called:", {
    cartId,
    productId,
    quantity,
  });

  // Si on ne faisait pas ça, n'importe quel utilisateur pourrait mettre à jour n'importe quel panier
  const currentCart = await safeQuery<CART_CAMEL_DTO>(
    dal[CART_DAL.getCurrentCartByUserId],
    [userId]
  );

  if (
    !currentCart?.rowCount ||
    currentCart.rowCount === 0 ||
    currentCart.rows[0].id !== cartId
  ) {
    logger.error("❌ Cart not found for user:", { userId, cartId });
    throw new Error(CART_ERRORS.UNAUTHORIZED);
  }

  const updated = await safeQuery<CART_UPDATED_CAMEL_DTO>(
    dal[CART_DAL.updateItem],
    [cartId, productId, quantity]
  );

  if (!updated?.rowCount || updated.rowCount === 0) {
    throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
  }
  logger.info("✅ Cart item updated:", updated.rows[0]);
  return updated.rows[0];
};

export const deleteItemService = async (
  userId: string,
  cartId: string,
  productId: string
): Promise<CART_DELETED_CAMEL_DTO> => {
  logger.info("🗑️ deleteCartItemService called:", {
    userId,
    cartId,
    productId,
  });

  const currentCart = await safeQuery(dal[CART_DAL.getCurrentCartByUserId], [
    userId,
  ]);

  if (
    !currentCart?.rowCount ||
    currentCart.rowCount === 0 ||
    currentCart.rows[0].id !== cartId
  ) {
    logger.error("❌ Cart not found or unauthorized access:", {
      userId,
      cartId,
    });
    throw new Error(CART_ERRORS.UNAUTHORIZED);
  }

  const deletedItem = await safeQuery<CART_DELETED_CAMEL_DTO>(
    dal[CART_DAL.deleteItem],
    [cartId, productId]
  );

  if (!deletedItem?.rowCount || deletedItem.rowCount === 0) {
    logger.error("❌ Item not found for deletion:", { cartId, productId });
    throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
  }

  logger.info("✅ Cart item deleted:", deletedItem.rows[0]);
  return deletedItem.rows[0];
};

export const getSummaryByUserIdService = async (
  userId: string
): Promise<CART_SUMMARY_CAMEL_DTO> => {
  logger.info("📦 getSummaryByUserIdService called:", { userId });

  const result = await safeQuery<CART_SUMMARY_CAMEL_DTO>(
    dal[CART_DAL.getSummaryByUserId],
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

export const getItemsByUserIdService = async (
  userId: string
): Promise<CART_ITEMS_CAMEL_DTO[]> => {
  logger.info("📦 getItemsByUserIdService called:", { userId });

  const result = await safeQuery<CART_ITEMS_CAMEL_DTO>(
    dal[CART_DAL.getItemsByUserId],
    [userId]
  );

  if (!result?.rowCount || result.rowCount === 0) {
    logger.info("ℹ️ No items in cart for user:", { userId });
    return [];
  }

  logger.info("✅ Cart items retrieved:", result.rows);
  return result.rows;
};
