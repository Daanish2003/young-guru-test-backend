import { getCourseHandler } from "../controllers/course.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const course_router = Router();

course_router.use(authMiddleware);
course_router.route("/").get(getCourseHandler);

export default course_router;
