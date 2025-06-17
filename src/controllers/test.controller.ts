import { LevelEnum } from "@prisma/client";
import { questions } from "../config/test.config.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { updateUserLevel } from "../services/test.service.js";
import { tryCatch } from "../utils/tryCatch.js";
import { TestSubmitSchema } from "../utils/zod.js";
import asyncHandler from "express-async-handler";

export const testStartHandler = asyncHandler(async (req, res): Promise<void> => {
  const sanitizedQuestions = questions.map(({ answer, ...rest }) => rest);

  res.status(200).json({
    questions: sanitizedQuestions,
  });
});

export const testSubmitHandler = asyncHandler(async (req, res) => {
  const validatedFields = TestSubmitSchema.safeParse(req.body);
  const { user } = req as AuthenticatedRequest;

  if (!validatedFields.success) {
    res.status(400).json({
      success: false,
      error: "Invalid request data",
      details: validatedFields.error.errors,
    });
    return;
  }

  const { answers } = validatedFields.data;

  if (!user || !Array.isArray(answers)) {
    res.status(400).json({
      success: false,
      error: "Invalid request body",
      details: "userId and answers[] are required",
    });
    return;
  }

  const correctAnswerMap = questions.reduce(
    (map, q) => {
      map[q.id] = q.answer;
      return map;
    },
    {} as Record<string, string>,
  );

  // Calculate score
  let score = 0;
  for (const ans of answers) {
    const correct = correctAnswerMap[ans.questionId];
    if (correct && ans.selectedOption === correct) {
      score += 1;
    }
  }

  let level: LevelEnum;
  if (score <= 7) {
    level = "Beginner";
  } else if (score <= 14) {
    level = "Intermediate";
  } else {
    level = "Advanced";
  }

  const { error: updateUserLevelError } = await tryCatch(updateUserLevel(user.id, level));

  if (updateUserLevelError) {
    res.status(500).json({
      success: false,
      error: "Failed to update user level",
      details: updateUserLevelError.message || updateUserLevelError.toString(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Test submitted successfully",
    score,
    level,
  });
});
