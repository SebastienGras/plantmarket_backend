import { requireAuth } from "@middlewares/auth";
import express from "express";

import { validateData } from "../../services/validation";

import {
  addItemAction,
  deleteItemAction,
  getItemsByUserIdAction,
  getSummaryByUserIdAction,
  updateItemAction,
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
  .post(requireAuth, validateData({ body: addItemCartBody }), addItemAction);

router
  .route("/cart/:productId")
  .patch(
    requireAuth,
    validateData({ body: updateItemCartBody }),
    updateItemAction
  )
  .delete(
    requireAuth,
    validateData({ params: itemCartIdParams }),
    deleteItemAction
  );

router
  .route("/cart/summary/:userId")
  .get(
    requireAuth,
    validateData({ params: getUserCartParams }),
    getSummaryByUserIdAction
  );

router
  .route("/cart/user/:userId")
  .get(
    requireAuth,
    validateData({ params: getUserCartParams }),
    getItemsByUserIdAction
  );

export { router };
