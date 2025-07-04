import { z } from "zod";

const addItemCartBody = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

const updateItemCartParams = z.object({
  cartId: z.string().min(1, "Cart ID is required"),
  productId: z.string().min(1, "Product ID is required"),
});

const updateItemCartBody = z.object({
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

const itemCartIdParams = z.object({
  itemCartId: z.string().min(1, "Cart Item ID is required"),
});

const getUserCartParams = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export {
  addItemCartBody,
  getUserCartParams,
  itemCartIdParams,
  updateItemCartBody,
  updateItemCartParams,
};
