import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { SessionPayload, verifyJWT } from "../services/auth.service.js";

export type AuthenticatedRequest = Request & {
  user: SessionPayload;
};

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  const decryptedData = await verifyJWT(token);

  if (!decryptedData) {
    res.status(401);
    throw new Error("Unauthorized: Invalid token");
  }

  (req as AuthenticatedRequest).user = decryptedData;

  next();
});
