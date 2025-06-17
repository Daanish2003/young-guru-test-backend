import { callTokenHandler } from "#controllers/call.controller.js"
import { authMiddleware } from "#middleware/authMiddleware.js"
import { Router } from "express"

const call_router = Router()

call_router.use(authMiddleware)
call_router.route('/token').post(callTokenHandler)

export default call_router