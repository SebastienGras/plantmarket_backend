import { requireAuth } from "@middlewares/auth";
import express from "express";

import { validateData } from "../../services/validation";

import {
  addProductAction,
  getProductByIdAction,
  getProductsByUserIdAction,
  getProductsListingAction,
  updateProductAction,
} from "./products.action";
import {
  addProductBody,
  getProductsListingQuery,
  getUserProductsParams,
  updateProductBody,
  productIdParams,
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
  );

router
  .route("/products/user/:userId")
  .get(
    validateData({ params: getUserProductsParams }),
    getProductsByUserIdAction
  );

export { router };
