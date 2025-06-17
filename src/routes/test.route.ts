import { testStartHandler, testSubmitHandler } from '#controllers/test.controller.js'
import { authMiddleware } from '#middleware/authMiddleware.js'
import { Router } from 'express'

const test_matching_router = Router()

test_matching_router.use(authMiddleware)
test_matching_router.route('/start').post(testStartHandler)
test_matching_router.route('/submit').post(testSubmitHandler)

export default test_matching_router