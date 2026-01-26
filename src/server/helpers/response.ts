import { Response } from "express";

/**
 * Standard API response format
 */
export const sendResponse = (res: Response, status: number, data: any) => {
  return res.status(status).json(data);
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  error?: any,
) => {
  if (error) {
    console.error(`[API Error] ${status} - ${message}:`, error);
  }
  return res.status(status).json({ message });
};

export const sendSuccess = (res: Response, message: string, data: any = {}) => {
  return res.status(200).json({ message, ...data });
};

export const sendCreated = (res: Response, message: string, data: any = {}) => {
  return res.status(201).json({ message, ...data });
};

export const sendUnauthorized = (
  res: Response,
  message: string = "Unauthorized",
) => {
  return sendError(res, 401, message);
};

export const sendForbidden = (res: Response, message: string = "Forbidden") => {
  return sendError(res, 403, message);
};

export const sendNotFound = (res: Response, message: string = "Not Found") => {
  return sendError(res, 404, message);
};

export const sendServerError = (
  res: Response,
  message: string = "Internal Server Error",
  error?: any,
) => {
  return sendError(res, 500, message, error);
};

export const sendBadRequest = (
  res: Response,
  message: string = "Bad Request",
) => {
  return sendError(res, 400, message);
};
