# Backend Machine Test — Task Sheet (1 Hour)

## Setup

1. Run The server if any bug occurs debug and fix it 

> Test all routes using **Postman**.

---

## Project Overview

This is a basic Express + Mongoose REST API with user authentication.

### Available Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|:---:|
| POST | `/api/auth/register` | Create a new user | ❌ |
| POST | `/api/auth/login` | Login, returns access token | ❌ |
| POST | `/api/auth/logout` | Logout | ✅ |
| GET | `/api/auth/me` | Get current user info | ✅ |
| GET | `/api/posts` | List all posts | ✅ |
| POST | `/api/posts` | Create a post | ✅ |
| DELETE | `/api/posts/:id` | Delete a post | ✅ |

Protected routes require the header: `Authorization: Bearer <accessToken>`

---

## Your Tasks

Find and fix **all the bugs** in this project. The bugs span across authentication, authorization, and CRUD operations.

> **Rules:**
> - Do **not** install any extra npm packages — everything you need is already in `package.json`
> - Make sure **all routes** work correctly after your fixes
> - Write clean, readable code

---

### Task 1 — Token Verification is Broken

**File:** `middleware/auth.js`

After login, use your access token to access `GET /api/auth/me`. Now try using a **random/tampered token** or wait for it to **expire** and try again. You will notice the request still succeeds.

**Find and fix the root cause.** The token should be properly _verified_, not just _decoded_.

---

### Task 2 — Logout Doesn't Actually Invalidate the Token

**File:** `controllers/authController.js`

Call `POST /api/auth/logout`. Then immediately use the **same access token** to call `GET /api/auth/me`. You will notice it still works — the logout did nothing.

**Find and fix the root cause.** The utility you need is already imported in the file — you just need to use it correctly.

> **Hint:** Also check `middleware/auth.js` — even after blacklisting, does the middleware actually check for it?

---

### Task 3 — `/api/auth/me` Leaks Sensitive Data

**File:** `controllers/authController.js`

Look at the `getMe` controller. The route comment says it should return only `id`, `name`, and `email` — but that's not what's happening.

**Fix the response** so it returns only the fields mentioned in the comment and removes any sensitive data.

---

### Task 4 — Creating a Post is Broken

**File:** `controllers/postController.js`

Try to create a post via `POST /api/posts` with a valid token. It will crash.

There are **2 issues** in the `createPost` function:

1. **The author reference is wrong** — it uses a variable that doesn't exist in scope. Figure out the correct way to get the authenticated user's ID.
2. **The response is incomplete** — the created post should be returned in the response body.

---

### Task 5 — Anyone Can Delete Anyone's Post

**File:** `controllers/postController.js`

Currently, any authenticated user can delete **any post**, even if they didn't create it.

**Add an authorization check** — only the author of a post should be allowed to delete it. Return a `403` status if someone else tries.

---

### Task 6 — Missing `.env` Configuration

**File:** `.env` (create from `.env.example`)

The server won't start without a `.env` file. The `.env.example` is provided but the `dotenv` package is installed and **never loaded** anywhere in the code.

**Find where `dotenv` should be configured** so that `process.env` variables are available throughout the app.

---

## Evaluation Criteria

| Area | What we look at |
|---|---|
| Bug identification | Did you find all the bugs? |
| Security awareness | Do you understand *why* each bug is dangerous? |
| Authorization logic | Are protected resources properly guarded? |
| Code quality | Clean, readable, no unnecessary changes |
| Error handling | Correct HTTP status codes and messages |
