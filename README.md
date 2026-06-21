# AI Coding Workspace

A simplified AI-powered coding workspace built for the technical assessment. Users can sign up, create isolated JavaScript, Python, and Website Builder projects, manage files, edit code, and chat with an AI assistant that can inspect and update project files.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Monaco Editor
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT access token with bcrypt password hashing
- Data: MongoDB collections for users, projects, files, and chat messages

## Features

- Signup and login
- Session persistence through JWT stored client-side
- Three workspace cards: JavaScript, Python, Website Builder
- Project dashboard filtered by workspace
- File explorer with create, edit, save, and delete actions
- Monaco-powered code editor
- Project-scoped chat history
- AI helper endpoint with optional OpenAI integration
- Basic AI file modification commands
- Website Builder live preview for `index.html`, CSS, and JavaScript files
- MongoDB ownership checks on every protected route

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

```bash
npm run install:all
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-coding-workspace
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_API_KEY` is optional. Without it, the app uses a deterministic local assistant that can summarize files and perform basic file updates.

### Run Locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Overview

Protected routes require:

```http
Authorization: Bearer <jwt>
```

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `GET /api/projects?workspace=javascript|python|website`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `DELETE /api/projects/:projectId`

### Files

- `POST /api/projects/:projectId/files`
- `PATCH /api/projects/:projectId/files/:fileId`
- `DELETE /api/projects/:projectId/files/:fileId`

### Chat

- `GET /api/projects/:projectId/chat`
- `POST /api/projects/:projectId/chat`

## AI File Modification

The fallback assistant supports simple commands in chat:

- `create file utils.js with export const sum = (a, b) => a + b;`
- `update file index.html with <h1>Hello</h1>`
- `delete file old.js`

When `OPENAI_API_KEY` is configured, the backend sends project context to OpenAI and accepts structured JSON responses containing optional file operations.

## Project Structure

```text
client/
  src/
    components/
    context/
    lib/
    pages/
server/
  src/
    controllers/
    middleware/
    models/
    routes/
    services/
```

## Scalability Notes

- Project ownership is enforced in middleware before file or chat operations.
- Files and chat messages are separate MongoDB collections so large projects can be paginated later.
- The AI service is isolated behind `services/aiService.js`, making provider changes localized.
- The editor autosave path can be upgraded to WebSockets or CRDT-based collaboration without changing the persistence model.
