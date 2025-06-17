import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { getAllCourses, getUserCourseAccessList } from "#services/course.service.js";
import { tryCatch } from "#utils/tryCatch.js"; // adjust path to your tryCatch file
import { AuthenticatedRequest } from "#middleware/authMiddleware.js";

export const getCourseHandler = asyncHandler(async (req, res) => {
  const { user } = req as AuthenticatedRequest;

  const { data: allCourses, error: coursesError } = await tryCatch(getAllCourses());
  if (coursesError) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch courses",
      details: coursesError.message
    });

    return
  }

  const { data: unlockedCourseIds, error: accessError } = await tryCatch(getUserCourseAccessList(user.id));
  if (accessError) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch user course access",
      details: accessError.message
    });

    return
  }

  const result = allCourses.map(course => ({
    title: course.title,
    videoUrl: unlockedCourseIds.has(course.id) ? course.video_url : null,
    isLocked: !unlockedCourseIds.has(course.id)
  }));

  res.status(200).json({
    success: true,
    data: result
  });
});
