import { prisma } from "../models/client.js";
import { LevelEnum } from "@prisma/client";

export const updateUserLevel = async (userId: string, level: LevelEnum) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      level: level,
    },
  });
};
