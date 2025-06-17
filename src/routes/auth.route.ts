import { loginHandler } from "../controllers/auth.controller.js";
import { Router } from "express";

const auth_router = Router();

auth_router.route("/login").post(loginHandler);

export default auth_router;
