# 📘 Young Guru Backend Assignment

A modular backend for **Young Guru Academy**, a mobile-first spoken English app. This assignment demonstrates clean backend design using **Node.js**, **Express**, and **PostgreSQL** – covering authentication, test engine logic, course access, simulated payment, and audio call setup.


## 🔧 How to Run the Project Locally

```bash
# 1. Clone the repository
git clone https://github.com/Daanish2003/young-guru-test-backend.git
cd young-guru-test-backend

# 2. Install dependencies
pnpm install

# 3. Set environment variables
cp .env.example .env
# (Update .env with your PostgreSQL DB and SECRET for JWT or use docker with docker-compose)

# 4. Setup and seed the database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Start the server
pnpm dev
```

## 🧩 Tech Stack Used

| Layer        | Technology                     |
|--------------|---------------------------------|
| Language     | Node.js (JavaScript)            |
| Framework    | Express.js                      |
| Database     | PostgreSQL + Prisma ORM         |
| Auth         | JWT + Simulated Firebase Auth   |
| Payments     | Simulated Razorpay Integration  |
| Call Tokens  | Dummy Agora token generator     |
| API Format   | RESTful JSON                    |
| Structure    | MVC (controllers, services, etc.) |

## 🔗 API Routes

### 🔐 Authentication

| Method | Endpoint          | Description                   |
|--------|-------------------|-------------------------------|
| POST   | `/auth/login`     | Simulated login via OTP       |

### 🧠 Level Matching Test Engine

| Method | Endpoint           | Description                       |
|--------|--------------------|-----------------------------------|
| POST   | `/test/start`      | Returns hardcoded 20 MCQs         |
| POST   | `/test/submit`     | Submits answers, scores level     |

### 🎓 Courses

| Method | Endpoint       | Description                        |
|--------|----------------|------------------------------------|
| GET    | `/courses`     | List of 3 dummy courses (locked/unlocked) |

### 💳 Payment

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| POST   | `/payment/order`   | Create a dummy Razorpay order   |
| POST   | `/payment/verify`  | Simulate payment & unlock course |

### 📞 Audio Call

| Method | Endpoint        | Description                         |
|--------|-----------------|-------------------------------------|
| POST   | `/call/token`   | Create audio session & dummy token  |

## 🗃️ Database Schema

### ✅ Tables

- `users` – phone, level
- `logins` – user_id, login_time, ip_address
- `courses` – title, video_url
- `payments` – user_id, order_id, amount, status
- `course_access` – user_id, course_id, unlocked_at
- `call_sessions` – caller_id, receiver_id, channel, token, created_at

## 🤖 Simulated or Hardcoded Parts

| Feature        | Simulation Method                    |
|----------------|--------------------------------------|
| OTP Login      | Hardcoded in `fakeOTPStore`          |
| Quiz Questions | Hardcoded in `test.config.js`        |
| Razorpay       | Order & status mocked                |
| ZegoCloud Token| Dummy token string generated         |

## 👥 Test Users

| User     | Phone Number     | OTP     |
|----------|------------------|---------|
| User A   | +919876543210    | 123456  |
| User B   | +918765432109    | 654321  |

Use these for testing login, calls, and authorization.

## 📦 Postman Collection

You can find all routes in the [Postman Collection JSON](./young-guru-backend.postman_collection.json), including:

- ✅ Login
- ✅ Test Submission
- ✅ Course Access
- ✅ Payment Flow
- ✅ Call Token API

## 💡 Assumptions Made

- Firebase OTP is simulated via a static in-memory store.
- Payment verification is mocked (not Razorpay SDK).
- Only one quiz test is supported and results overwrite previous ones.
- Video URLs and course data are static.
