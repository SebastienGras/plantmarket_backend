import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithMessage } from "@utils/error";
import type { Response } from "express";

import { CART_ERRORS } from "./cart.constant";
import {
  addItemToCartService,
  deleteItemFromCartService,
  getCartItemsByUserIdService,
  updateCartItemService,
} from "./cart.service";

export const addItemCartAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("🛒 Adding item to cart:", {
    userId: req.userId,
    body: req.body,
  });

  try {
    const cartItem = await addItemToCartService(req.userId!, req.body);
    logger.info("✅ Item added to cart:", cartItem);
    res.status(201).json(cartItem);
  } catch (error) {
    logger.error("❌ Failed to add item to cart:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isErrorWithMessage(error, CART_ERRORS.PRODUCT_NOT_FOUND)) {
      res.status(404).json({ error: CART_ERRORS.PRODUCT_NOT_FOUND });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateItemCartAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("📝 Updating cart item:", {
    userId: req.userId,
    itemCartId: req.params.itemCartId,
    update: req.body,
  });

  try {
    const updatedItem = await updateCartItemService(
      req.userId!,
      req.params.itemCartId,
      req.body.quantity
    );

    logger.info("✅ Cart item updated:", updatedItem);
    res.json(updatedItem);
  } catch (error) {
    logger.error("❌ Failed to update cart item:", {
      message: error instanceof Error ? error.message : String(error),
    });

    if (isErrorWithMessage(error, CART_ERRORS.ITEM_NOT_FOUND)) {
      res.status(404).json({ error: CART_ERRORS.ITEM_NOT_FOUND });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteItemCartAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("🗑️ Removing cart item:", {
    userId: req.userId,
    itemCartId: req.params.itemCartId,
  });

  try {
    await deleteItemFromCartService(req.userId!, req.params.itemCartId);

    logger.info("✅ Cart item deleted:", { itemCartId: req.params.itemCartId });
    res.status(204).send();
  } catch (error) {
    logger.error("❌ Failed to delete cart item:", {
      message: error instanceof Error ? error.message : String(error),
    });

    if (isErrorWithMessage(error, CART_ERRORS.ITEM_NOT_FOUND)) {
      res.status(404).json({ error: CART_ERRORS.ITEM_NOT_FOUND });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getItemsCartByUserIdAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("📦 Fetching cart items for user:", {
    userId: req.params.userId,
  });

  try {
    const cartItems = await getCartItemsByUserIdService(req.params.userId);
    logger.info("✅ Cart items retrieved:", cartItems);
    res.json(cartItems);
  } catch (error) {
    logger.error("❌ Failed to fetch cart items:", {
      message: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({ error: "Internal Server Error" });
  }
};
