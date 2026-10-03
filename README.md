# DevFlow — Unified Developer Collaboration Platform

DevFlow is a unified developer collaboration and engineering workflow platform. It acts as a **centralized layer** bringing together task management, code activity, CI/CD pipeline status, and AI assistance into one developer-focused workspace.

---

## 🚀 Key Features (Module 1)

* **🔐 User Authentication & Roles**: JWT Bearer token authentication, bcrypt password hashing, and role-based access (`ADMIN`, `LEAD`, `DEVELOPER`). Pre-configured 1-click demo login switch.
* **📂 Project Workspace Management**: Create & organize engineering projects with custom keys (e.g. `DF`), categories (`WEB`, `MOBILE`, `BACKEND`, `INFRA`, `AI`), and color accents.
* **📋 Interactive Kanban Board**: 4 workflow stages (`To Do` → `In Progress` → `In Review` → `Done`) with native HTML5 Drag-and-Drop and accessible quick-move action controls.
* **🏷️ Rich Task Metadata**: Priority pills (`URGENT`, `HIGH`, `MEDIUM`, `LOW`), git branch badges (`feature/branch-name`), tag badges, assignee avatars, and estimated engineering hours.
* **⚡ Real-time Socket.IO Sync**: Live event broadcasting (`task:created`, `task:updated`, `task:moved`, `task:deleted`) across all connected workspace windows with floating toast notifications.
* **📊 Analytics Dashboard**: Real-time project progress tracking, completion rates, status/priority breakdown, and live activity stream audit log.

---

## 🏗️ Architecture & Technology Stack

* **Frontend**: React 18 + TypeScript + Vite + Custom Glassmorphism Styling (CSS Variables, Lucide icons)
* **Backend**: Node.js + Express.js + RESTful API controllers & Socket.IO WebSockets server
* **Database & ORM**: Prisma ORM with SQLite (scalable to PostgreSQL)
* **Real-Time Engine**: Socket.IO event rooms

---

## 🛠️ Quick Start & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/meghana922007/devflow.git
cd devflow

# 2. Install all dependencies (root, server, and client)
npm run setup

# 3. Initialize & seed SQLite database with demo data
npm run db:seed --prefix server

# 4. Start backend & frontend dev servers concurrently
npm run dev
```

The application will be accessible at:
- **Frontend Dashboard**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api`

---

## 🔑 Demo Credentials

| User | Email | Role | GitHub |
| :--- | :--- | :--- | :--- |
| **Alex Rivers** | `alex@devflow.io` | Lead Admin | `@arivers-dev` |
| **Meghana Dev** | `meghana@devflow.io` | Lead Engineer | `@meghana-dev` |
| **Squid 7** | `squid7@devflow.io` | Core Contributor | `@squid-7` |
| **Sarah Chen** | `sarah@devflow.io` | Backend Specialist | `@sarah-chen` |
| **Marcus Vance** | `marcus@devflow.io` | Frontend Developer | `@marcus-vance` |

*Default password for all demo accounts:* `password123`

---

## 👥 Project Contributors

- [**@meghana922007**](https://github.com/meghana922007) — Project Maintainer & Lead Developer
- [**@squid-7**](https://github.com/squid-7) — Core Contributor & Workflow Engineer

