import express from "express";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";
import {
  createChannelOutcome,
  deleteChannelOutcome,
  fetchChannelOutcomes,
} from "../controllers/outcomeController.ts";

const router = express.Router();

router.get("/:id/outcomes", JWTMiddleware, fetchChannelOutcomes);
router.post("/:id/outcomes", JWTMiddleware, createChannelOutcome);
router.delete("/:id/outcomes/:outcomeId", JWTMiddleware, deleteChannelOutcome);

export default router;
