# 📋 Let's Do List

A bold, feature-rich todo list application built with **Next.js**, **Prisma**, and **PostgreSQL**. Featuring a distinctive **Neubrutalism** design, drag-and-drop reordering, soft deletes, and optimistic UI updates.

**Live Demo:** [https://letsdo-list.vercel.app](https://letsdo-list.vercel.app)

---

## 🚀 Overview

This is a modern full-stack web application. It implements a fully functional layered REST API backing a React frontend, styled with a distinct, vivid Neubrutalism visual language. 

### Key Features
- **Full CRUD & Soft Deletes:** Create, read, update, and delete tasks. Deleted tasks can be restored via an "Undo" toast.
- **Drag & Drop:** Visually reorder tasks; order persists securely in the database.
- **Search & Filters:** Real-time text search, priority grouping (High/Medium/Low), and completion status filtering.
- **Internationalization (i18n):** Instantly switch between English (EN), Vietnamese (VI), and Japanese (JA).
- **Optimistic UI:** Instant visual feedback without waiting for network requests to finish.

### Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL (Neon Serverless in Prod, Docker locally)
- **ORM:** Prisma
- **UI Components:** shadcn/ui & dnd-kit
- **Styling:** TailwindCSS + Custom Neubrutalism overrides

---

## 💻 Getting Started

You can run this project locally using either **Docker** (easiest) or a standard Node.js development environment.

### Option A: Docker Compose (Recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

```bash
git clone https://github.com/OXplakhoa/letsdo-list.git
cd letsdo-list

# Build and start the containers in the background
docker compose up --build -d
```
> The app will run at **http://localhost:3000** with a fresh PostgreSQL database automatically connected and migrated.

### Option B: Local Development

Requires Node.js 20+ and your own running PostgreSQL database.

```bash
git clone https://github.com/OXplakhoa/letsdo-list.git
cd letsdo-list

# Install dependencies
npm install

# Set up your environment variable
echo "DATABASE_URL=postgresql://user:password@localhost:5432/todolist?schema=public" > .env

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed the database with sample tasks
npx prisma db seed

# Run the development server
npm run dev
```
> The app will run at **http://localhost:3000**
