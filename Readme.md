# PayX — Wallet & Payment System

A full-stack digital wallet application built with React, Node.js, TypeScript, and PostgreSQL. Supports wallet top-ups via a simulated bank and instant P2P transfers between users.

---

## Features

- **Wallet top-up (On-Ramp)** — Add money via a simulated bank using a secure webhook flow with HMAC signature verification
- **P2P Transfers** — Send money instantly to any registered user via atomic database transactions
- **Transaction history** — View all transfers and on-ramp transactions with status tracking
- **JWT Authentication** — Secure login and signup with bcrypt password hashing
- **Input validation** — Zod schemas on every endpoint, client-side validation on every form
- **Responsive UI** — Clean, mobile-friendly interface built with Tailwind CSS

---

## Architecture

PayX is split into three independent services:

```
┌─────────────────┐        ┌──────────────────────┐
│  Client          │        │  Server (Port 3000)   │
│  React + Vite    │◄──────►│  Express + Prisma     │
│  (Port 5173)     │        │  PostgreSQL            │
└─────────────────┘        └──────────┬───────────┘
                                       │  Webhook (HMAC signed)
                            ┌──────────▼───────────┐
                            │  Bank Simulator        │
                            │  Express (Port 3001)   │
                            └──────────────────────┘
```

### On-Ramp Flow (Bank → Wallet)

```
User → POST /api/wallet/add-money
     → Server creates OnRampTransaction (Processing) + generates token
     → Server calls Bank POST /api/b2p/transfer-bank
     → Bank simulates processing (1s delay)
     → Bank signs payload with HMAC-SHA256 and calls webhook
     → Server verifies signature with timingSafeEqual
     → Server credits wallet + marks transaction Success
```

### P2P Transfer Flow (Wallet → Wallet)

```
User → POST /api/transfer/transfer-balance
     → Single Prisma $transaction:
         deduct from sender
         credit receiver
         create Transfer record (Success)
     → Returns immediately — no bank involved
```

P2P transfers are internal ledger operations and do not require bank confirmation. The `$transaction` block ensures atomicity — if any step fails, the entire operation rolls back.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express 5, TypeScript |
| ORM | Prisma 7 (with `@prisma/adapter-pg`) |
| Database | PostgreSQL |
| Auth | JWT (`jsonwebtoken`), bcrypt |
| Validation | Zod v4 |
| Security | HMAC-SHA256, `crypto.timingSafeEqual` |
| HTTP Client | Axios |

---

## Project Structure

```
PayX/
├── server/               # Main backend API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── controllers/  # authController, transferController,
│       │                 # walletController, webhookController
│       ├── middlewares/  # JWT auth middleware
│       ├── routes/       # Route definitions
│       ├── validation/   # Zod schemas
│       ├── config/       # Prisma client
│       └── types/        # Express type extensions
│
├── bank/                 # Bank simulator service
│   └── src/
│       ├── controllers/  # Handles on-ramp, signs webhook payload
│       └── routes/
│
└── client/               # React frontend
    └── src/
        ├── api/          # Axios client + service functions
        ├── components/   # Navbar, BalanceCard, TransactionRow, etc.
        ├── context/      # AuthContext
        ├── hooks/        # useRequiredAuth
        ├── pages/        # Home, Login, Signup, SendMoney, AddMoney, Transactions
        ├── types/        # Shared TypeScript types
        └── utils/        # formatCurrency, getGreeting
```

---

## Database Schema

```prisma
User          id, email (unique), username, phone (unique), password
Balance       userId (unique), amount (paisa), locked (paisa)
OnRampTransaction  userId, amount, provider, token (unique), status, startTime
Transfer      senderId, receiverId, amount, status, createdAt
```

All monetary values are stored in **paisa** (1 rupee = 100 paisa) as integers to avoid floating-point precision issues.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/ShiwankAks/PayX.git
cd PayX
```

### 2. Set up the Server

```bash
cd server
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/payx
JWT_SECRET=your_jwt_secret_here
BANK_URL=http://localhost:3001/api
CLIENT_URL=http://localhost:5173
WEBHOOK_SECRET=your_webhook_secret_here
```

Run migrations and start:

```bash
npx prisma migrate dev
npm run server
```

### 3. Set up the Bank Simulator

```bash
cd bank
npm install
```

Create a `.env` file:

```env
BACKEND_URL=http://localhost:3000/api
WEBHOOK_SECRET=your_webhook_secret_here   # Must match server WEBHOOK_SECRET
```

Start:

```bash
npm run bank
```

### 4. Set up the Client

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Start:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/user` | Yes | Get current user + balance |

### Wallet

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/wallet/check-balance` | Yes | Get wallet balance |
| POST | `/api/wallet/add-money` | Yes | Initiate on-ramp (bank top-up) |
| GET | `/api/wallet/on-ramp-transactions` | Yes | Get on-ramp history |

### Transfers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/transfer/transfer-balance` | Yes | Send money to another user |
| GET | `/api/transfer/users` | Yes | List all other users |
| GET | `/api/transfer/transfer-history` | Yes | Get P2P transfer history |

### Webhooks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/webhook/verify-payment-bank` | HMAC | Bank confirms on-ramp payment |

All protected routes require `Authorization: Bearer <token>` header.

---

## Security

- **Passwords** are hashed with bcrypt (10 rounds) and never returned in any response
- **Webhook payloads** from the bank are verified using HMAC-SHA256 signatures and `crypto.timingSafeEqual` to prevent timing attacks
- **JWT tokens** expire after 10 days
- **CORS** is restricted to `CLIENT_URL` only
- **Self-transfers** are blocked at the API level
- **Input validation** via Zod on all endpoints before any database access

---

## Known Limitations

- **No webhook retry / recovery:** If the bank simulator goes down after an on-ramp is initiated but before the webhook fires, the transaction stays in `Processing` indefinitely. A production system would use a background job with exponential backoff to retry or expire stuck transactions.
- **No pagination on user list:** The send-money user search fetches all users. A production system would implement server-side search with cursor-based pagination.
- **No rate limiting:** Auth endpoints are not rate-limited. A production system would use `express-rate-limit` to prevent brute-force attacks.
- **No refresh tokens:** JWT tokens have a fixed 10-day expiry with no refresh mechanism.
- **No tests:** Unit and integration tests are planned as the next development milestone.

---

## What I'd Add With More Time

1. **Tests** — Integration tests using Vitest + Supertest covering the transfer flow, webhook verification, and auth endpoints
2. **Rate limiting** — `express-rate-limit` on auth routes
3. **Withdrawal (Off-Ramp)** — The UI has a "Coming Soon" placeholder; the backend would mirror the on-ramp webhook pattern in reverse
4. **Server-side search** — Replace the client-side filter on the send-money page with a paginated, database-level search
5. **Refresh tokens** — Rotate short-lived access tokens against a stored refresh token

---

## License

MIT