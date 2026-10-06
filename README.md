# EduLearn — Online Learning Platform with ChatGPT Integration

A full-stack online learning platform built with the MERN stack. Students can browse and enroll in courses, track their progress, and get AI-powered course recommendations. Instructors can create, edit, and manage their own courses and view enrolled students.

## Live demo

- **App**: https://nimble-churros-0ba3a4.netlify.app
- **API health check**: https://edulearn-gpt.onrender.com/api/health

> The backend is hosted on Render's free tier, which spins down after ~15 minutes of inactivity. The first request after a period of inactivity may take 30-50 seconds to wake up — this is expected, not a bug.

Seeded accounts (see [Seeding the database](#seeding-the-database)) all use the password `password123`, e.g. `sarah.chen@edulearn.dev` (instructor). Register your own student account to test enrollment.

## Features

**Student**
- Register / log in
- Browse all available courses, with search (by title, topic, or instructor) and pagination (10 per page)
- View course details in a popup, enroll in a course
- Track progress per course (Enrolled → In Progress → Completed) from My Courses
- Get AI-powered course recommendations from a free-text prompt (e.g. "I want to be a software engineer, what should I take?")

**Instructor**
- Register / log in
- Create, edit, and delete their own courses
- View enrolled students per course

**Both**
- JWT-based authentication, role-based access control enforced server-side
- Role-aware navigation and protected routes

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas), Mongoose |
| Auth | JWT, bcrypt |
| AI | OpenAI API (`gpt-4o-mini` — see [note on GPT-3](#note-on-gpt-3)) |
| Hosting | Render (backend), Netlify (frontend) |
| CI | GitHub Actions (lint, build, test, dependency audit) |

## Project structure

```
edulearn-gpt/
├── .github/workflows/ci.yml   # CI: backend test/audit, frontend lint/build
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── api/                # axios client
│       ├── components/         # UI, layout, course, recommendation components
│       ├── context/             # AuthContext
│       ├── pages/               # route-level pages, grouped by auth/courses/student/instructor
│       ├── routes/              # ProtectedRoute
│       └── utils/                # authBridge, courseCardVariants
├── server/                    # Express backend
│   └── src/
│       ├── config/              # DB connection
│       ├── controllers/          # route handlers
│       ├── middleware/           # auth, RBAC, validation, error handling
│       ├── models/               # Mongoose schemas
│       ├── routes/               # Express routers
│       ├── scripts/seed.js       # demo data seeder
│       └── services/gptService.js # OpenAI integration
│   └── tests/                  # Jest + Supertest
└── docs/
    ├── API.md                  # full API reference
    └── DATABASE.md              # schema + ER diagram
```

## Getting started (local development)

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- An [OpenAI API key](https://platform.openai.com/api-keys) (optional for local dev — see mock mode below)

### 1. Clone and install

```bash
git clone https://github.com/Muditha-Sankalpa/edulearn-gpt.git
cd edulearn-gpt

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**`server/.env`** (copy from `server/.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
OPENAI_API_KEY=your_openai_key
USE_REAL_GPT=false
CLIENT_URL=http://localhost:5173
```

`USE_REAL_GPT=false` (the default) returns a canned mock recommendation instead of calling OpenAI — useful for developing the UI without spending API quota. Set it to `true` to use the real model.

**`client/.env`** (copy from `client/.env.example`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Seed demo data (optional but recommended)

```bash
cd server
npm run seed
```

Creates 5 instructors and 20 courses across varied topics (all instructor accounts use password `password123`). Safe to re-run — it upserts rather than duplicating.

### 4. Run it

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

Frontend: http://localhost:5173 · Backend: http://localhost:5000

### Running tests

```bash
cd server
npm test
```

29 tests covering auth, courses, enrollments, RBAC, and recommendations (Jest + Supertest + an in-memory MongoDB instance, no real database needed).

## API documentation

See [docs/API.md](docs/API.md) for the full endpoint reference (method, auth requirements, request/response shapes).

## Database structure

See [docs/DATABASE.md](docs/DATABASE.md) for the schema and entity-relationship diagram.

## Deployment

- **Backend** → Render, auto-deploys on push to `main`. Required env vars: `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `USE_REAL_GPT`, `CLIENT_URL`.
- **Frontend** → Netlify, auto-deploys on push to `main`. Required env var: `VITE_API_BASE_URL` (must point at the deployed backend, e.g. `https://edulearn-gpt.onrender.com/api`). Includes a `public/_redirects` rule so client-side routes work on refresh/direct navigation.

### Note on GPT-3
The assessment brief specifies GPT-3. OpenAI fully deprecated GPT-3 models in 2024 — none remain callable via the API. This project uses `gpt-4o-mini` via the current Chat Completions API as the equivalent: same prompt-in, recommendations-out behavior the brief describes, on a model that's actually still available.

### Note on Heroku / "cloud platform"
The brief lists AWS, Azure, and Heroku as example cloud platforms. Heroku's free tier no longer exists; Render and Netlify are the current, widely-used equivalents (Render specifically is commonly described as the modern Heroku replacement) and were chosen deliberately after AWS's new account signup flow required a paid-plan upgrade to access the services this project needs (see git history for the full investigation).

## Known limitations (deliberate scope decisions)

These were left out intentionally — documented here rather than treated as bugs:

- **In-memory rate limiting.** Resets on server restart and isn't shared across instances. Acceptable for a single-instance free-tier deployment; would need a shared store (e.g. Redis) behind a load balancer.
- **No JWT refresh tokens.** Tokens expire after 1 day and can't be revoked early. Acceptable for this project's threat model; a refresh-token flow would be the next step for a production app with stricter session requirements.
- **No horizontal scaling / load balancing.** Render's free tier runs a single instance. The backend is stateless (JWT auth, no server-side sessions), so it would scale horizontally without code changes if deployed behind infrastructure that supported it.

## Security notes

- Passwords hashed with bcrypt (10 rounds), minimum 8 characters
- JWT-based auth, role-based access control enforced on every protected route (never trust the client)
- Rate limiting on auth endpoints (brute-force protection) and the recommendation endpoint (API quota protection)
- CORS restricted to an explicit origin allowlist
- Mongoose `sanitizeFilter` enabled (NoSQL injection protection)
- `trust proxy` enabled — required for rate limiting to work correctly behind Render's reverse proxy
- Error responses never leak internal details in production
