import express from "express";
import { login, logout, refresh, register } from "../controllers/authController.ts";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/refresh", JWTMiddleware, refresh);
router.get("/logout", logout);

export default router;