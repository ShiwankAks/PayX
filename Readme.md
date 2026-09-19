# PayX — Wallet & Payment System

A full-stack digital wallet application built with React, Node.js, TypeScript, and PostgreSQL. Containerised with Docker and deployed on AWS EC2 with Nginx as a reverse proxy and SSL/TLS termination.

**Live:** [https://paywallet.duckdns.org](https://paywallet.duckdns.org)

---

## Features

- **Wallet top-up (On-Ramp)** — Add money via a simulated bank using an async webhook flow with HMAC-SHA256 signature verification
- **P2P Transfers** — Send money instantly to any registered user via atomic database transactions
- **Transaction history** — View all transfers and on-ramp transactions with real-time status
- **JWT Authentication** — Secure login and signup with bcrypt password hashing
- **Input validation** — Zod v4 schemas on every endpoint; client-side validation on every form
- **Rate limiting** — Auth and transaction endpoints protected with `express-rate-limit`
- **Responsive UI** — Clean, mobile-first interface built with Tailwind CSS and served via Nginx

---

## Architecture

PayX is split into three independently containerised services orchestrated with Docker Compose:

```
Browser
   │  HTTPS
   ▼
Nginx (port 80 inside container → 8080 on host)
   │
   ├── /api/*  ──► Server container (Express · port 3000)
   │                      │
   │               Prisma ORM + PostgreSQL
   │                      │
   │               Bank container (port 3001)  ◄── webhook callback (HMAC signed)
   │
   └── /*      ──► React SPA (static files)
```

Nginx acts as a reverse proxy and single point of entry. API calls from the frontend hit `/api/*` which Nginx forwards to the Node.js server — no CORS configuration needed in production.

### On-Ramp Flow (Bank → Wallet)

```
User → POST /api/wallet/add-money
     → Server creates OnRampTransaction (Processing) + generates crypto token
     → Server calls bank POST /api/b2p/transfer-bank
     → Bank simulates processing (1 second delay)
     → Bank signs payload with HMAC-SHA256 and calls webhook
     → Server verifies signature using crypto.timingSafeEqual
     → Server credits wallet inside $transaction + marks Success
```

### P2P Transfer Flow (Wallet → Wallet)

```
User → POST /api/transfer/transfer-balance
     → Single Prisma $transaction:
         check sender balance
         deduct from sender
         credit receiver
         create Transfer record (Success)
     → Returns immediately — no bank involved
```

P2P transfers are pure internal ledger operations. The `$transaction` block ensures full atomicity — if any step fails, the entire operation rolls back with no partial state.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router v7 |
| Server | Node.js 24, Express 5, TypeScript |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (`jsonwebtoken`), bcrypt |
| Validation | Zod v4 |
| Security | HMAC-SHA256, `crypto.timingSafeEqual`, Helmet, `express-rate-limit` |
| Containerisation | Docker, Docker Compose |
| Web Server | Nginx (reverse proxy + static file server) |
| Deployment | AWS EC2, SSL/TLS |

---

## Project Structure

```
PayX/
├── docker-compose.yml
│
├── server/                      # Main backend API
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── controllers/         # auth, transfer, wallet, webhook
│       ├── middlewares/         # JWT auth, rate limiting
│       ├── routes/
│       ├── validation/          # Zod schemas + Vitest tests
│       ├── config/              # Prisma client
│       └── types/               # Express type extensions
│
├── bank/                        # Bank simulator service
│   ├── Dockerfile
│   └── src/
│       └── controllers/         # Signs HMAC payload, calls webhook
│
└── client/                      # React frontend
    ├── Dockerfile               # Multi-stage: Vite build → Nginx
    ├── nginx.conf               # SPA routing + API proxy
    └── src/
        ├── api/                 # Axios client + service functions
        ├── components/          # Navbar, BalanceCard, TransactionRow, etc.
        ├── context/             # AuthContext
        ├── hooks/               # useRequiredAuth
        ├── pages/               # Home, Login, Signup, SendMoney, AddMoney, Transactions
        ├── types/
        └── utils/               # formatCurrency, getGreeting
```

---

## Database Schema

```prisma
User               id, email (unique), username, phone (unique), password
Balance            userId (unique), amount (paisa), locked (paisa)
OnRampTransaction  userId, amount, provider, token (unique), status, startTime
Transfer           senderId, receiverId, amount, status, createdAt
```

All monetary values are stored as **integers in paisa** (₹1 = 100 paisa) to avoid floating-point precision issues.

---

## Running with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- A running PostgreSQL instance (external or local)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/PayX.git
cd PayX
```

### 2. Configure environment variables

**`server/.env`**
```env
DATABASE_URL=postgresql://user:password@host:5432/payx
JWT_SECRET=        # generate: openssl rand -hex 32
BANK_URL=http://bank:3001/api
CLIENT_URL=http://localhost:8080
WEBHOOK_SECRET=    # generate: openssl rand -hex 32
PORT=3000
```

**`bank/.env`**
```env
BACKEND_URL=http://server:3000/api
WEBHOOK_SECRET=    # must match server WEBHOOK_SECRET exactly
PORT=3001
```

> The client has no `.env` required — it uses relative `/api` paths proxied by Nginx.

### 3. Run database migrations

```bash
cd server
npm install
npx prisma migrate deploy
cd ..
```

### 4. Start all services

```bash
docker compose up --build
```

The app will be available at **http://localhost:8080**.

---

## Running Locally (Without Docker)

### Server

```bash
cd server
npm install
# create server/.env with DATABASE_URL, JWT_SECRET, BANK_URL=http://localhost:3001/api, WEBHOOK_SECRET
npx prisma migrate dev
npm run dev          # starts on port 3000
```

### Bank

```bash
cd bank
npm install
# create bank/.env with BACKEND_URL=http://localhost:3000/api, WEBHOOK_SECRET
npm run dev          # starts on port 3001
```

### Client

```bash
cd client
npm install
# create client/.env with VITE_API_URL=http://localhost:3000/api
npm run dev          # starts on port 5173
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Register a new user |
| POST | `/api/auth/login` | — | Login and receive JWT |
| GET | `/api/auth/user` | JWT | Get current user + balance |

### Wallet
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/wallet/check-balance` | JWT | Get wallet balance |
| POST | `/api/wallet/add-money` | JWT | Initiate bank top-up |
| GET | `/api/wallet/on-ramp-transactions` | JWT | Get top-up history |

### Transfers
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/transfer/transfer-balance` | JWT | Send money to another user |
| GET | `/api/transfer/users` | JWT | List all other users |
| GET | `/api/transfer/transfer-history` | JWT | Get P2P transfer history |

### Webhooks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/webhook/verify-payment-bank` | HMAC | Bank confirms top-up payment |

All protected routes require the header: `Authorization: Bearer <token>`

Optional query param on history endpoints: `?limit=N`

---

## Security

- **Passwords** hashed with bcrypt (10 rounds); never returned in any API response
- **Webhook payloads** verified using HMAC-SHA256 with `crypto.timingSafeEqual` to prevent timing attacks
- **JWT tokens** expire after 10 days
- **Rate limiting** — auth endpoints: 10 requests per 15 minutes; transfer endpoints: 10 requests per minute
- **Security headers** via Helmet
- **CORS** restricted to `CLIENT_URL`
- **Self-transfers** blocked at the API level
- **Zod validation** on all endpoints before any database access
- **`trust proxy`** set correctly for rate limiting to work behind Nginx

---

## Tests

```bash
cd server
npm test
```

34 tests across 5 files covering:
- Auth middleware (missing token, invalid token, valid token)
- Signup and login schema validation
- Transfer schema validation
- On-ramp schema validation
- Webhook schema validation

---

## Deployment (AWS EC2)

This project is deployed on an AWS EC2 instance using Docker Compose with Nginx handling SSL termination and routing.

**High-level setup:**
1. Launch an EC2 instance (Ubuntu 22.04, t2.micro or above)
2. Install Docker and Docker Compose
3. Clone the repo and create `.env` files for server and bank
4. Obtain an SSL certificate (Let's Encrypt via Certbot)
5. Configure Nginx on the host to terminate HTTPS and forward to port 8080 (the Docker Compose exposed port)
6. Run `docker compose up -d --build`

The Nginx container inside Docker handles internal routing between the frontend and the API. The host-level Nginx (or the EC2 load balancer) handles SSL termination.

---

## Known Limitations

- **No webhook retry/recovery** — if the bank fails after a top-up is initiated but before the webhook fires, the transaction stays `Processing` indefinitely. A production system would use a background job with exponential backoff to expire or retry stuck transactions.
- **No server-side user search** — the send-money page fetches all users. A production system would use cursor-based pagination with a search filter at the database layer.
- **No integration tests** — unit and schema tests exist; integration tests for the transfer and webhook flows are the next milestone.
- **No token refresh** — JWT tokens have a fixed 10-day expiry with no refresh mechanism.

---

## What I'd Add With More Time

1. **Integration tests** — Vitest + Supertest covering the full transfer flow and webhook verification against a test database
2. **Server-side search + pagination** on the user list
3. **Token refresh** — short-lived access tokens rotated against a stored refresh token
4. **Off-ramp (withdrawal)** — mirrors the on-ramp webhook pattern in reverse
5. **Docker health checks** — so Compose waits for each service to be ready before starting dependants

---

## License

MIT
