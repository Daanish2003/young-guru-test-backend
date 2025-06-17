import { prisma } from "#models/client.js"
import { Payment } from "#models/generated/prisma/client.js"
import { PaymentStatus } from "#models/generated/prisma/enums.js"

export const createNewOrder = async (userId: string, amount: Payment['amount'], course_id: string) => {
    return await prisma.payment.create({
        data: {
            user_id: userId,
            amount: amount,
            status: 'Created',
            course_id
        }
    })
}

export const checkPayment = async(order_id: string, user_id: string) => {
    return await prisma.payment.findFirst({
        where: { order_id, user_id },
    });
}

export const updatePaymentStatus = async(order_id: string, user_id: string, status: PaymentStatus) => {
    return await prisma.payment.update({
        where: { order_id, user_id },
        data: { status }
    })
}

export const unlockCourses = async(course_id: string, user_id: string) => {
    return await prisma.courseAccess.create({
        data: {
            user_id,
            course_id,
        }
    })
}