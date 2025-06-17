import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { checkPayment, createNewOrder, unlockCourses, updatePaymentStatus } from "../services/payment.service.js";
import { tryCatch } from "../utils/tryCatch.js";
import { PaymentOrderSchema, PaymentVerifySchema } from "../utils/zod.js";
import asyncHandler from "express-async-handler";

export const paymentOrderHandler = asyncHandler(async (req, res) => {
  const validatedFields = PaymentOrderSchema.safeParse(req.body);
  const { user } = req as AuthenticatedRequest;

  if (!validatedFields.success) {
    res.status(400).json({
      success: false,
      error: "Invalid request data",
      details: validatedFields.error.errors,
    });

    return;
  }

  const { amount, courseId } = validatedFields.data;

  const { data: payment, error: createNewOrderError } = await tryCatch(createNewOrder(user.id, amount, courseId));

  if (createNewOrderError) {
    res.status(500).json({
      success: false,
      error: "Failed to create order",
      details: createNewOrderError,
    });
    return;
  }

  res.status(201).json({
    success: true,
    order: {
      id: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      status: payment.status,
      courseId: payment.course_id,
    },
  });
});

export const paymentVerifyHandler = asyncHandler(async (req, res) => {
  const validatedFields = PaymentVerifySchema.safeParse(req.body);

  const { user } = req as AuthenticatedRequest;

  if (!validatedFields.success) {
    res.status(400).json({
      success: false,
      error: "Invalid data",
      details: validatedFields.error.errors,
    });

    return;
  }

  const { order_id, status } = validatedFields.data;

  const { data: payment, error: CheckingPaymentError } = await tryCatch(checkPayment(order_id, user.id));

  if (CheckingPaymentError || !payment) {
    res.status(404).json({
      success: false,
      error: "Payment not found or access denied",
      details: CheckingPaymentError?.cause,
    });

    return;
  }

  const { data: updatedPayment, error: UpdatePaymentError } = await tryCatch(updatePaymentStatus(order_id, user.id, status));

  if (UpdatePaymentError) {
    res.status(500).json({
      success: false,
      error: "Failed to update payment status",
      details: UpdatePaymentError.cause,
    });

    return;
  }

  const { data: unlockAccessCourse, error: ErrorUnlockingCourseAccess } = await tryCatch(unlockCourses(updatedPayment.course_id, user.id));

  if (ErrorUnlockingCourseAccess) {
    res.status(500).json({
      success: false,
      error: "Failed to unlock course",
      details: ErrorUnlockingCourseAccess.cause,
    });

    return;
  }

  res.json({
    success: true,
    message: "Payment Verified",
    payment: updatedPayment,
    courseAccess: unlockAccessCourse,
  });
});
