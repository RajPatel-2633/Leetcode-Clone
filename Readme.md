# Leet-Space

A full-stack LeetCode-style coding platform with problem management, multi-language code execution, submissions, and playlists.

## Tech Stack

- Frontend: React + Vite + Tailwind + Zustand
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma ORM
- Code Execution: Judge0 API
- Auth: JWT + HTTP-only cookies

## Current Features

- User authentication (register, login, logout, auth check)
- Problem listing and per-problem detail view
- Admin problem creation with reference-solution validation
- Execute + submit code for JavaScript, Python, and Java
- Submission history and per-problem submission counts
- Playlist creation and problem curation

## Project Structure

```text
LeetCode-Clone/
  backend/
    prisma/
    src/
      controllers/
      libs/
      middleware/
      routes/
  frontend/
    src/
      components/
      pages/
      store/
      libs/
```

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm
- PostgreSQL database
- A reachable Judge0 endpoint

## Environment Variables

Create `backend/.env`:

```env
PORT=8080
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
JWT_SECRET=your_strong_jwt_secret
NODE_ENV=development
JUDGE0_API_URL=http://localhost:2358
```

Create `frontend/.env` (optional for local backend):

```env
VITE_API_URL=http://localhost:8080/api/v1
```

If `VITE_API_URL` is not set, frontend falls back to the deployed backend URL.

## Installation

```bash
# from repo root
cd backend
npm install

cd ../frontend
npm install
```

## Database Setup (Prisma)

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

For local development, you can use:

```bash
npx prisma migrate dev
```

## Run the App (Development)

In terminal 1:

```bash
cd backend
npm run dev
```

In terminal 2:

```bash
cd frontend
npm run dev
```

## Available Scripts

Backend (`backend/package.json`):

- `npm run dev` - Start backend with nodemon
- `npm run script` - Start backend with node

Frontend (`frontend/package.json`):

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Route Prefixes

All backend routes are mounted under `/api/v1`:

- `/auth`
- `/problems`
- `/execute-code`
- `/submission`
- `/playlist`

## Notes

- CORS is currently configured with a fixed allowed origin in backend `src/index.js`. Update it for your local/deployment frontend URL as needed.
- Ensure your Judge0 service is running and reachable by `JUDGE0_API_URL`.

## Author

Raj Patel ( IRONWILL 2633 )