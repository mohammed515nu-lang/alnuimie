# Backend Server

## Requirements

- Node.js (v14+)
- MongoDB (local or Atlas)

## Installation

```bash
cd server
npm install
```

## Setup

1. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/construction-management
JWT_SECRET=your-secret-key
PORT=4000
```

2. Start MongoDB

## Run

```bash
npm run dev    # Development
npm start      # Production
```

Server runs on `http://localhost:4000`

## API Endpoints

- `GET /` - API info
- `GET /api/health` - Health check
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/projects` - Projects
- `GET /api/users` - Users
- `GET /api/materials` - Materials
- `GET /api/suppliers` - Suppliers
- `GET /api/purchases` - Purchases
- `GET /api/payments` - Payments
- `GET /api/issues` - Issues
- `GET /api/contracts` - Contracts
- `GET /api/requests` - Requests
- `GET /api/reports` - Reports

## Production checklist (Render / hosting)

Set these in the host **Environment** UI, then redeploy.

### Stripe (wallet / cards)

- `STRIPE_SECRET_KEY` — required for SetupIntent, customers, payment methods.
- `STRIPE_PUBLISHABLE_KEY` — same value as the Stripe **publishable** key (`pk_live_...` / `pk_test_...`); returned to the app with wallet setup payloads.

See [`server/.env.example`](./.env.example) for server variables. For the Expo app, use a root `.env` file (not committed) with `EXPO_PUBLIC_*` variables.

### بنيان AI (NVIDIA)

- `NVIDIA_API_KEY` — from [NVIDIA Build](https://build.nvidia.com) / API catalog.
- **At least one of** `NVIDIA_CHAT_MODEL_FAST` **or** `NVIDIA_CHAT_MODEL` — exact model id for the Chat Completions API (example: `meta/llama-3.1-8b-instruct`).
- `NVIDIA_CHAT_MODEL_FAST` — optional; if set, tried **first** (often a smaller/faster model).
- `NVIDIA_CHAT_MODEL_FALLBACK` — optional second model when the first fails (429, errors, etc.). If unset but both `FAST` and `NVIDIA_CHAT_MODEL` are set and differ, `NVIDIA_CHAT_MODEL` is used as the automatic fallback.
- Optional: `NVIDIA_API_BASE_URL` (default `https://integrate.api.nvidia.com/v1`), `NVIDIA_CHAT_TIMEOUT_MS`, `NVIDIA_MAX_TOKENS`, `NVIDIA_TEMPERATURE`.

If the model or key is wrong, the server logs a line like `[ai] NVIDIA failed (no knowledge fallback):` with the error detail.

## Expo app (EAS) — Stripe publishable key

The native app embeds the Stripe **publishable** key at **build** time. It is **not** read from Render.

1. In Expo: [Environment variables / EAS Secrets](https://docs.expo.dev/eas/environment-variables/) for the same EAS project as `app.config.ts` → `extra.eas.projectId`.
2. Add **`EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`** (same value as `STRIPE_PUBLISHABLE_KEY` / Dashboard publishable key) for the **`production`** (and `production-apk` if used) build profile.
3. Run a new build, e.g. `eas build --profile production` — changing `EXPO_PUBLIC_*` requires a new binary; updating only the server is not enough for the client-side key.
