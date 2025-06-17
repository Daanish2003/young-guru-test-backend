import { z } from "zod";
import validator from "validator"


export const LoginSchema = z.object({
  phoneNumber: z.string().refine(validator.isMobilePhone, {
    message: "Invalid phone number",
  }),
  otp: z
    .string()
    .regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
});

export const PaymentOrderSchema = z.object({
  courseId: z.string().cuid(),
  amount: z.number().min(1)
});

export const PaymentVerifySchema = z.object({
  order_id: z.string(),
  status: z.enum(["Created", "Failed", "Success"]),
});

export const CallTokenSchema = z.object({
  callerId: z.string().cuid(),
  receiverId: z.string().cuid(),
  channel_name: z.string().min(3)
});


export const TestSubmitSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        selectedOption: z.string()
      })
    )
    .nonempty("answers array cannot be empty")
});
