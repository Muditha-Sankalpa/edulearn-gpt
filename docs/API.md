# API Reference

Base URL (local): `http://localhost:5000/api`
Base URL (deployed): `https://edulearn-gpt.onrender.com/api`

All request/response bodies are JSON. Protected routes require an `Authorization: Bearer <token>` header, obtained from `/auth/login` or `/auth/register`.

## Conventions

- **Auth** column: `Public` (no token needed), `Any logged in` (valid token, any role), `Student`/`Instructor` (valid token + matching role).
- Validation errors return `400` with `{ "errors": [...] }` (express-validator format).
- Ownership/role violations return `403` with `{ "message": "..." }`.
- Not-found resources return `404` with `{ "message": "..." }`.
- Rate-limited routes return `429` with `{ "message": "..." }` when exceeded.

---

## Auth

### `POST /auth/register`
Create an account. **Auth:** Public. Rate limited (20 req / 15 min / IP).

**Body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "password123", "role": "student" }
```
`role` must be `"student"` or `"instructor"`. `password` must be 8-72 characters.

**Response** `201`
```json
{ "token": "...", "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "student" } }
```
`409` if the email is already registered.

### `POST /auth/login`
**Auth:** Public. Rate limited (20 req / 15 min / IP).

**Body**
```json
{ "email": "jane@example.com", "password": "password123" }
```

**Response** `200` — same shape as register. `401` on invalid credentials.

### `GET /auth/me`
Returns the current authenticated user (used to resync client state). **Auth:** Any logged in.

**Response** `200`
```json
{ "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "student" } }
```

---

## Courses

### `GET /courses`
List all courses. **Auth:** Public.

**Response** `200` — array of courses, each with `instructor: { _id, name }` populated (instructor email is never exposed publicly).

### `GET /courses/:id`
Get one course by id. **Auth:** Public. `400` if `:id` isn't a valid MongoDB ObjectId. `404` if not found.

### `GET /courses/mine`
List the logged-in instructor's own courses. **Auth:** Instructor.

### `POST /courses`
Create a course. **Auth:** Instructor.

**Body**
```json
{ "title": "Intro to React", "description": "...", "content": "..." }
```
`409` if this instructor already has a course with that exact title.

### `PUT /courses/:id`
Update a course. **Auth:** Instructor, must own the course (`403` otherwise). Same body shape as create.

### `DELETE /courses/:id`
Delete a course. **Auth:** Instructor, must own the course. Cascades — also deletes all enrollments referencing this course.

### `GET /courses/:id/students`
List students enrolled in a course. **Auth:** Instructor, must own the course.

**Response** `200`
```json
[{ "studentId": "...", "name": "Jane Doe", "email": "jane@example.com", "enrolledAt": "2026-10-01T00:00:00.000Z" }]
```

---

## Enrollments

### `POST /enrollments`
Enroll in a course. **Auth:** Student.

**Body**
```json
{ "courseId": "..." }
```
`201` on success, `404` if the course doesn't exist, `409` if already enrolled.

### `GET /enrollments/me`
List the logged-in student's enrollments, with the course (and its instructor's name) populated. **Auth:** Student.

### `PATCH /enrollments/:id`
Update the status of one of your own enrollments. **Auth:** Student, must own the enrollment (`403` otherwise).

**Body**
```json
{ "status": "in-progress" }
```
`status` must be one of `"enrolled"`, `"in-progress"`, `"completed"`.

---

## Recommendations

### `POST /recommendations`
Get AI-generated course recommendations based on a free-text prompt. **Auth:** Student. Rate limited (10 req / 24h / user).

**Body**
```json
{ "prompt": "I want to be a software engineer, what courses should I follow?" }
```
`prompt` must be non-empty and ≤500 characters.

**Response** `200`
```json
{
  "message": "Here are some courses to get you started.",
  "recommendedCourses": [
    { "id": "...", "title": "Introduction to Web Development" },
    { "id": "...", "title": "Modern JavaScript Fundamentals" }
  ]
}
```

Notes:
- `recommendedCourses` items include the real course `id` so the UI can link directly to each course's detail view.
- When `USE_REAL_GPT=false` (default), returns the first 3 real courses from the catalog as a mock response — no OpenAI call is made.
- When real, recommendations are grounded in the actual course catalog: the model's output is cross-checked against real course titles, so hallucinated/invented titles are filtered out before the response is returned.
- `502` if the OpenAI API call itself fails (outage, invalid key, etc.) — returns a friendly error message rather than a raw 500.

---

## Health check

### `GET /health`
**Auth:** Public. Returns `{ "status": "ok" }`. Used for deployment health checks.
