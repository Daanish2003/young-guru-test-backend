import cors from 'cors';
import express from 'express';
import "dotenv/config";
import auth_router from '#routes/auth.route.js';
import test_matching_router from '#routes/test.route.js';
import course_router from '#routes/course.route.js';
import payment_router from '#routes/payment.route.js';
import call_router from '#routes/call.route.js';

const app = express();

app.use(cors({
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: '*',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', auth_router)
app.use('/test', test_matching_router)
app.use('/courses', course_router)
app.use('/payment', payment_router)
app.use('/call', call_router)

export { app };
