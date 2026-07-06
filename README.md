# 📋 Let's Do List

A bold, feature-rich todo list application built with **Next.js**, **Prisma**, and **PostgreSQL**. Featuring a distinctive **Neubrutalism** design, soft deletes, and optimistic UI updates.

## 🚀 Overview

This is a modern full-stack web application designed for a take-home test. It implements a fully functional layered REST API backing a React frontend, styled with a distinct, vivid Neubrutalism visual language.

### Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **UI Components:** shadcn/ui
- **Styling:** TailwindCSS + Custom Neubrutalism overrides
- **Testing:** Vitest
- **Deployment:** Docker Compose

---

## 🎨 Design: Neubrutalism

The UI steps away from the typical clean corporate look and embraces **Neubrutalism**:
- Sharp corners (`border-radius: 0px`)
- Thicc, bold black borders
- Chunky, un-blurred offset shadows
- Flat, highly saturated colors (Yellow, Orange, Pink, Blue)
- Dynamic hover and active click states that make the UI feel tactile

---

## 📐 Architecture

The application follows a **Layered Architecture** with SOLID principles in mind:

```text
┌──────────────────────────────────────────────────────┐
│  CLIENT (React Components)                           │
│  └── Custom Hook: useTodos() [useState + fetch]      │
│      └── Optimistic updates + rollback               │
├──────────────────────────────────────────────────────┤
│  API ROUTES (Controllers) — /src/app/api/todos/      │
│  └── Middleware wrapper: Zod validation & errors     │
├──────────────────────────────────────────────────────┤
│  SERVICE LAYER — /src/lib/services/todo.service.ts   │
│  └── Business logic (CRUD, filters, soft delete)     │
├──────────────────────────────────────────────────────┤
│  DATA LAYER — Prisma Client                          │
│  └── PostgreSQL                                      │
└──────────────────────────────────────────────────────┘
```

**Why this architecture?**
- **Separation of concerns:** Each layer has a single responsibility.
- **Dependency Inversion:** Services are agnostic to HTTP (Next.js request objects); they only take validated data.
- **Testability:** The service layer can be fully unit-tested independently of the API boundaries.

---

## 🚀 Getting Started

### Option A: Docker Compose (Recommended)

Requires Docker Desktop installed.

```bash
git clone <repo>
cd letsdo-list
docker compose up --build
```
> The app will run at http://localhost:3000

### Option B: Local Development

Requires Node.js 20+ and a PostgreSQL database.

```bash
git clone <repo>
cd letsdo-list
npm install

# Set up your .env file with DATABASE_URL
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todolist?schema=public" > .env

# Run database migrations and generate client
npx prisma migrate dev --name init
npx prisma generate

# (Optional) Seed the database
npx prisma db seed

# Run the development server
npm run dev
```

---

## 🧪 Testing

Unit tests run against the service layer utilizing **Vitest** and mock the Prisma client.

```bash
npm run test
```

---

## 🧠 Key Design Decisions & Problem-Solving

- **REST API over Server Actions:** Chosen to demonstrate classic backend separation and allow for middleware (validation wrapper) and clean error handling. Docker-friendly and language-agnostic at the API layer.
- **Soft Delete over Hard Delete:** Records are flagged with a `deletedAt` timestamp instead of being destroyed. This enables the elegant "Undo" feature when a user accidentally deletes a task.
- **Neubrutalism Identity:** Chosen to create a standout, memorable aesthetic that differentiates this submission from the standard template look.
- **`useState` + `fetch` for Data Fetching:** Purposefully built a custom `useTodos` hook instead of relying on SWR or React Query to explicitly demonstrate knowledge of state synchronization, optimistic UI updates, error rollbacks, and race-condition mitigation (ignoring stale responses).
- **Application-Managed `position`:** The DB `position` field relies on an application-level calculation (`max(position) + 1`) rather than auto-increment. Auto-increment cannot be updated after insertion, and application-managed positions are essential for future drag-and-drop support.

---

## ⚠️ Known Limitations & Edge Cases

- **Filter vs. Optimistic Rollback:** If a user edits a todo that removes it from the current filter view (e.g., changing status to "Completed" while viewing "Active"), and the API fails, the rollback happens in state, but the UI might temporarily misrepresent it due to the filter logic.
- **No Auth / Single Player:** Currently a single global shared list without user authentication.
- **List Reordering:** The database supports `position` sorting, but UI drag-and-drop functionality (using `dnd-kit`) was omitted for time constraints.

---

## 🛠️ Trade-offs & Future Improvements

- **E2E Testing:** Add Playwright to run full browser-based end-to-end tests for the optimistic UI interactions.
- **Authentication:** Integrate NextAuth to support multiple users with private lists.
