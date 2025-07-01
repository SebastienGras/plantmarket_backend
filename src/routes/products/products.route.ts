import { requireAuth } from "@middlewares/auth";
import express from "express";

import { validateData } from "../../services/validation";

import { addProductAction } from "./actions/addProduct";
import { deleteProductAction } from "./actions/deleteProduct";
import { getProductByIdAction } from "./actions/getProductById";
import { getProductsByUserIdAction } from "./actions/getProductsByUserId";
import { getProductsListingAction } from "./actions/getProductsListing";
import { updateProductAction } from "./actions/updateProduct";
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
