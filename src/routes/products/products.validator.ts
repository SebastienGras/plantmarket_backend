import { z } from "zod";

const addProductBody = z.object({
  title: z.string().min(1, "Product title is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().min(1, "Product category is required"),
  subcategoryId: z.string().min(1, "Product subcategory is required"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  actif: z.boolean(),
});

const updateProductBody = z.object({
  title: z.string().min(1, "Product title is required").optional(),
  description: z.string().min(1, "Product description is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  categoryId: z.string().min(1, "Product category is required").optional(),
  subcategoryId: z
    .string()
    .min(1, "Product subcategory is required")
    .optional(),
  stock: z
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer")
    .optional(),
  actif: z.boolean(),
});

const getProductsListingQuery = z.object({
  actif: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => val === "true" || val === true),
  categoryId: z.string().min(1, "Category ID is required").optional(),
  subcategoryId: z.string().min(1, "Subcategory ID is required").optional(),
  minPrice: z
    .number()
    .nonnegative("Minimum price must be a non-negative number")
    .optional(),
  maxPrice: z
    .number()
    .nonnegative("Maximum price must be a non-negative number")
    .optional(),
  orderBy: z
    .enum(["asc", "desc"], {
      message: "Order must be either 'asc' or 'desc'",
    })
    .optional(),
  search: z.string().min(1, "Search term is required").optional(),
  page: z
    .number()
    .int()
    .nonnegative("Page must be a non-negative integer")
    .optional(),
  limit: z
    .number()
    .int()
    .positive("Limit must be a positive integer")
    .optional(),
});

const productIdParams = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

const getUserProductsParams = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export {
  addProductBody,
  getProductsListingQuery,
  getUserProductsParams,
  updateProductBody,
  productIdParams,
};
export type AddProductBodyInput = z.infer<typeof addProductBody>;
