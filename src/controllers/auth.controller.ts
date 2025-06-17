import { createNewUser, generateJWT, getExistingUser, saveLoginInfo, verifyOtp } from "../services/auth.service.js";
import { tryCatch } from "../utils/tryCatch.js";
import { LoginSchema } from "../utils/zod.js";
import asyncHandler from "express-async-handler";

export const loginHandler = asyncHandler(async (req, res): Promise<void> => {
  const validatedFields = LoginSchema.safeParse(req.body);

  if (validatedFields.error) {
    res.status(400).json({
      success: false,
      error: "Invalid credentials",
      details: validatedFields.error,
    });
    return;
  }

  const { phoneNumber, otp } = validatedFields.data;

  const result = verifyOtp(phoneNumber, otp);

  if (!result.success) {
    res.status(401).json({
      success: false,
      error: "Invalid OTP",
      details: result.error,
    });
    return;
  }

  const { data: existingUser, error: getExistingUserError } = await tryCatch(getExistingUser(phoneNumber));

  if (getExistingUserError) {
    res.status(500).json({
      success: false,
      error: "Something went wrong while fetching user",
      details: getExistingUserError?.message ?? getExistingUserError,
    });
    return;
  }

  let user = existingUser;

  if (!user) {
    const { data: newUser, error: createNewUserError } = await tryCatch(createNewUser(phoneNumber));

    if (createNewUserError) {
      res.status(500).json({
        success: false,
        error: "Something went wrong while creating user",
        details: createNewUserError?.message ?? createNewUserError,
      });
      return;
    }

    user = newUser;
  }

  const { data: jwtToken, error: generateJWTTokenError } = await tryCatch(generateJWT(user));

  if (generateJWTTokenError) {
    res.status(500).json({
      success: false,
      error: "Something went wrong while generating token",
      details: generateJWTTokenError?.message ?? generateJWTTokenError,
    });
    return;
  }

  const ipAddress = req.ip;

  if (!ipAddress) {
    res.status(500).json({
      success: false,
      error: "IP address not found",
      details: "Request IP could not be determined from req.ip",
    });
    return;
  }

  const { error: loginSaveError } = await tryCatch(
    saveLoginInfo({
      ipAddress,
      userId: user.id,
    }),
  );

  if (loginSaveError) {
    res.status(500).json({
      success: false,
      error: "Failed to save login info",
      details: loginSaveError?.message ?? loginSaveError,
    });
    return;
  }

  res.status(200).json({
    success: true,
    token: jwtToken,
    message: "User has been logged in",
  });
});
