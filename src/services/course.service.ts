import { prisma } from "../models/client.js";

export const getAllCourses = async () => {
  return await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      video_url: true,
    },
    orderBy: {
      title: "asc",
    },
  });
};

export const getUserCourseAccessList = async (userId: string) => {
  const accessList = await prisma.courseAccess.findMany({
    where: { user_id: userId },
    orderBy: { unlocked_at: "asc" },
    select: { course_id: true },
  });

  return new Set(accessList.map((a) => a.course_id));
};
