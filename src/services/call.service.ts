import { prisma } from "#models/client.js"

export const createNewCallSession = async (caller_id: string, receiver_id: string, channel_name: string, token: string) => {
    return await prisma.callSession.create({
        data: {
            caller_id,
            receiver_id,
            channel: channel_name,
            token
        }
    })
}