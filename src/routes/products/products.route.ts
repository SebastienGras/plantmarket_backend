import { requireAuth } from "@middlewares/auth";
import express from "express";

import { validateData } from "../../services/validation";

import {
  addProductAction,
  deleteProductAction,
  getProductByIdAction,
  getProductsByUserIdAction,
  getProductsListingAction,
  updateProductAction,
} from "./products.action";
import {
  addProductBody,
  getProductsListingQuery,
  getUserProductsParams,
  productIdParams,
  updateProductBody,
} from "./products.validator";

const router = express.Router();

router
  .route("/products")
  .get(
    validateData({ query: getProductsListingQuery }),
    getProductsListingAction
  )
  .post(requireAuth, validateData({ body: addProductBody }), addProductAction);

router
  .route("/products/:productId")
  .get(validateData({ params: productIdParams }), getProductByIdAction)
  .patch(
    requireAuth,
    validateData({ body: updateProductBody, params: productIdParams }),
    updateProductAction
  )
  .delete(
    requireAuth,
    validateData({ params: productIdParams }),
    deleteProductAction
  );

router
  .route("/products/user/:userId")
  .get(
    validateData({ params: getUserProductsParams }),
    getProductsByUserIdAction
  );

export { router };
