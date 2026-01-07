import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { db } from "@/src/server/config/db.ts";
import { LoginSchema, RegisterSchema } from "@/schemas/index.ts";
import { users } from "../config/schema.ts";

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
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { email: existingUser.email },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "30d" }
    );

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successful",
      accessToken,
    });
  } catch (error) {
    console.log("Login API Error:", error);
    return res.sendStatus(404).json({ message: "Login API error" });
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

      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as jwt.JwtPayload;

    const accessToken = jwt.sign(
      { email: payload.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Refresh API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refresh", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.log("Logout API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};