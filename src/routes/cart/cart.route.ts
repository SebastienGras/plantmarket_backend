import { requireAuth } from "@middlewares/auth";
import express from "express";

import { validateData } from "../../services/validation";

import {
  addItemCartAction,
  deleteItemCartAction,
  getItemsCartByUserIdAction,
  updateItemCartAction,
} from "./cart.action";
import {
  addItemCartBody,
  getUserCartParams,
  itemCartIdParams,
  updateItemCartBody,
} from "./cart.validator";

const router = express.Router();

router
  .route("/cart")
  .post(
    requireAuth,
    validateData({ body: addItemCartBody }),
    addItemCartAction
  );

router
  .route("/cart/:itemCartId")
  .patch(
    requireAuth,
    validateData({ body: updateItemCartBody, params: itemCartIdParams }),
    updateItemCartAction
  )
  .delete(
    requireAuth,
    validateData({ params: itemCartIdParams }),
    deleteItemCartAction
  );

router
  .route("/cart/user/:userId")
  .get(
    requireAuth,
    validateData({ params: getUserCartParams }),
    getItemsCartByUserIdAction
  );

export { router };
