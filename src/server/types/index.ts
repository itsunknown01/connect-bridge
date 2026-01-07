import { Request } from "express";

export interface IUser {
  email: string;
  id: number;
  name: string;
}

export interface IRequest extends Request {
  user?: IUser | undefined;
}
