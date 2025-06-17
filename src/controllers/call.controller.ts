import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CallTokenSchema } from "#utils/zod.js";
import { tryCatch } from "#utils/tryCatch.js";
import { createNewCallSession } from "#services/call.service.js";

const generateDummyToken = () => "dummy-token-" + Math.random().toString(36).substring(2);

export const callTokenHandler = asyncHandler(async (req: Request, res: Response) => {
  const validated = CallTokenSchema.safeParse(req.body);

  if (!validated.success) {
    res.status(400).json({
      success: false,
      error: "Invalid input",
      details: validated.error.errors
    });
    return
  }

  const { callerId, receiverId, channel_name } = validated.data;
  const token = generateDummyToken();

  const { data: callSession, error } = await tryCatch(
    createNewCallSession(callerId, receiverId, channel_name, token)
  );

  if (error || !callSession) {
    res.status(500).json({
      success: false,
      error: "Failed to create call session",
      details: error?.message || "Unknown error"
    });

    return
  }

  res.status(200).json({
    success: true,
    data: {
      channel: channel_name,
      token: callSession.token,
      createdAt: callSession.created_at
    }
  });
});
