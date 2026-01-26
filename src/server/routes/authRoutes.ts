import express from "express";
import {
  login,
  logout,
  refresh,
  register,
  updateProfile,
  updatePassword,
  searchUsers,
} from "../controllers/authController.ts";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/refresh", refresh);
router.get("/logout", logout);

router.put("/profile", JWTMiddleware, updateProfile);
router.put("/profile/password", JWTMiddleware, updatePassword);
router.get("/users/search", JWTMiddleware, searchUsers);

export default router;
