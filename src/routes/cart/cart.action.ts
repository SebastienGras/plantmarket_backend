import type { AuthenticatedRequest } from "@middlewares/auth";
import { logger } from "@services/logger";
import { isErrorWithMessage } from "@utils/error";
import type { Response } from "express";

import { CART_ERRORS } from "./cart.constant";
import {
  addItemService,
  deleteItemService,
  getItemsByUserIdService,
  getSummaryByUserIdService,
  updateItemService,
} from "./cart.service";

export const addItemAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("🛒 Adding item to cart:", {
    userId: req.userId,
    body: req.body,
  });

  try {
    const cartItem = await addItemService(req.userId!, req.body);
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

    res.status(500).json({ error: CART_ERRORS.INTERNAL_SERVER_ERROR });
  }
};

export const updateItemAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("📝 Updating cart item:", {
    userId: req.userId,
    itemCartId: req.params.productId,
    quantity: req.body.quantity,
  });
  try {
    const updatedItem = await updateItemService(
      req.userId!,
      req.params.cartId,
      req.params.productId,
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

    res.status(500).json({ error: CART_ERRORS.INTERNAL_SERVER_ERROR });
    return;
  }
};

export const deleteItemAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { cartId, productId } = req.params;
  const userId = req.userId;

  logger.info("🗑️ Deleting cart item:", {
    userId: userId,
    cartId: cartId,
    producId: productId,
  });

  try {
    const deletedItem = await deleteItemService(userId!, cartId, productId);

    logger.info("✅ Cart item deleted:", deletedItem!);
    res.status(200).json(deletedItem);
  } catch (error) {
    logger.error("❌ Failed to delete cart item:", {
      message: error instanceof Error ? error.message : String(error),
    });

    if (isErrorWithMessage(error, CART_ERRORS.ITEM_NOT_FOUND)) {
      res.status(404).json({ error: CART_ERRORS.ITEM_NOT_FOUND });
      return;
    }

    if (isErrorWithMessage(error, CART_ERRORS.UNAUTHORIZED)) {
      res.status(403).json({ error: CART_ERRORS.UNAUTHORIZED });
      return;
    }

    res.status(500).json({ error: CART_ERRORS.INTERNAL_SERVER_ERROR });
  }
};

export const getSummaryByUserIdAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("📦 Fetching cart summary for user:", {
    userId: req.params.userId,
  });

  try {
    const cartItems = await getSummaryByUserIdService(req.params.userId);
    logger.info("✅ Cart items retrieved:", cartItems);
    res.json(cartItems);
  } catch (error) {
    logger.error("❌ Failed to fetch cart items:", {
      message: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({ error: CART_ERRORS.INTERNAL_SERVER_ERROR });
  }
};

export const getItemsByUserIdAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  logger.info("📦 Fetching cart items for user:", {
    userId: req.params.userId,
  });

  try {
    const cartItems = await getItemsByUserIdService(req.params.userId);
    logger.info("✅ Cart items retrieved:", cartItems);
    res.json(cartItems);
  } catch (error) {
    logger.error("❌ Failed to fetch cart items:", {
      message: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({ error: CART_ERRORS.INTERNAL_SERVER_ERROR });
  }
};
