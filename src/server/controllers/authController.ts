import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { db } from "@/src/server/config/db.ts";
import { LoginSchema, RegisterSchema } from "@/src/schemas/index.ts";
import { users } from "../config/schema.ts";
import { IRequest } from "../types/index.ts";

import {
  sendBadRequest,
  sendCreated,
  sendResponse,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
} from "../helpers/response.ts";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const validation = LoginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: "Invalid fields" });
    }
    const { email, password } = validation.data;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return res.status(400).json({ message: "Email does not exists" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password invalid" });
    }

    const accessToken = jwt.sign(
      { email: existingUser.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" },
    );

    const refreshToken = jwt.sign(
      { email: existingUser.email },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "30d" },
    );

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, "Login Successful", {
      accessToken,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    return sendServerError(res, "Login API error", error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const validation = RegisterSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: "Invalid fields" });
    }
    const { email, name, password } = validation.data;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (hashPassword) {
      await db
        .insert(users)
        .values({ name, email, password: hashPassword })
        .execute();

      return sendCreated(res, "User created successfully");
    }
  } catch (error) {
    return sendServerError(res, "Registration error", error);
  }
};

export const refresh = async (req: IRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as jwt.JwtPayload;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, payload.email),
    });

    if (!existingUser || !existingUser.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
      { email: payload.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" },
    );

    return sendSuccess(res, "Token refreshed", {
      accessToken,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    return sendServerError(res, "Refresh API Error", error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refresh", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    return sendSuccess(res, "Logout Successful");
  } catch (error) {
    return sendServerError(res, "Logout API Error", error);
  }
};
export const updateProfile = async (req: IRequest, res: Response) => {
  try {
    const { name } = req.body;
    const user = req.user; // Already furnished by JWTMiddleware

    if (!user) return sendUnauthorized(res);

    if (!name || name.trim().length === 0) {
      return sendBadRequest(res, "Name is required");
    }

    await db.update(users).set({ name }).where(eq(users.id, user.id));

    return sendSuccess(res, "Profile updated successfully");
  } catch (error) {
    return sendServerError(res, "Update Profile Error", error);
  }
};

export const updatePassword = async (req: IRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    if (!user) return sendUnauthorized(res);

    if (!oldPassword || !newPassword) {
      return sendBadRequest(res, "All fields are required");
    }

    // Still need to fetch password as it's not in req.user intentionally
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { password: true },
    });

    if (!existingUser || !existingUser.password) {
      return sendUnauthorized(res);
    }

    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      return sendBadRequest(res, "Current password incorrect");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashPassword })
      .where(eq(users.id, user.id));

    return sendSuccess(res, "Password updated successfully");
  } catch (error) {
    return sendServerError(res, "Update Password Error", error);
  }
};

export const searchUsers = async (req: IRequest, res: Response) => {
  try {
    const { q } = req.query;
    const user = req.user;

    if (!user) return sendUnauthorized(res);

    if (!q || typeof q !== "string") {
      return sendBadRequest(res, "Search query is required");
    }

    const results = await db.query.users.findMany({
      where: (table, { or, like, and, ne }) =>
        and(
          ne(table.id, user.id),
          or(like(table.name, `%${q}%`), like(table.email, `%${q}%`)),
        ),
      columns: {
        id: true,
        name: true,
        email: true,
      },
      limit: 10,
    });

    return sendResponse(res, 200, { results });
  } catch (error) {
    return sendServerError(res, "Search Users Error", error);
  }
};
