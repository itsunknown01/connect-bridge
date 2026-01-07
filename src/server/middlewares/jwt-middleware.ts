import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IRequest, IUser } from "../types/index.ts";

dotenv.config();

export default function JWTMiddleware(
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);

        const decodedToken = decoded as IUser;

        req.user = {
          id: decodedToken?.id,
          name: decodedToken?.name,
          email: decodedToken?.email,
        };
        next();
      }
    );
  } catch (error) {
    console.error(error);
  }
}
