import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IRequest, IUser } from "../types/index.ts";
import { users } from "../config/schema.ts";
import { eq } from "drizzle-orm";
import { db } from "../config/db.ts";

import { sendUnauthorized } from "../helpers/response.ts";
import { getOrSet } from "../helpers/cache.ts";

dotenv.config();

export default function JWTMiddleware(
  req: IRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) return sendUnauthorized(res);

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);

      try {
        const decodedToken = decoded as IUser;

        // 🚀 CACHE USER PROFILE (10 MINS TTL)
        const userProfile = await getOrSet(
          `user_profile:${decodedToken.email}`,
          async () => {
            const existingUser = await db.query.users.findFirst({
              where: eq(users.email, decodedToken.email),
            });
            if (!existingUser || !existingUser.id) return null;
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
            };
          },
          600,
        );

        if (!userProfile) {
          return sendUnauthorized(res);
        }

        req.user = userProfile;
        next();
      } catch (error) {
        console.error("JWTMiddleware Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    },
  );
}
