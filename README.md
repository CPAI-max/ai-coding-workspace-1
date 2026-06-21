# AI Coding Workspace

A simplified AI-powered coding workspace built for the technical assessment. Users can sign up, create isolated JavaScript, Python, and Website Builder projects, manage files, edit code, and chat with an AI assistant that can inspect and update project files.

Repository: https://github.com/CPAI-max/ai-coding-workspace

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
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/CPAI-max/ai-coding-workspace.git
cd ai-coding-workspace
```

If you already have the project folder locally, open a terminal in that folder instead.

### 2. Install Dependencies

Install root, backend, and frontend dependencies:

```bash
npm run install:all
```

### 3. Configure Environment Variables

Create a file named `server/.env`.

You can copy the example file:

```bash
copy server\.env.example server\.env
```

For macOS/Linux:

```bash
cp server/.env.example server/.env
```

Use this local development configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-coding-workspace
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_API_KEY` is optional. Without it, the app uses a deterministic local assistant that can summarize files and perform basic file updates.

### 4. Start MongoDB

#### Windows

Open PowerShell as Administrator and run:

```powershell
Start-Service MongoDB
Get-Service MongoDB
```

Expected status:

```text
Running  MongoDB
```

If MongoDB is not installed, install MongoDB Community Server:

```powershell
winget install MongoDB.Server
```

Then reopen PowerShell as Administrator and start the service again.

#### macOS/Linux

Start MongoDB using your package manager or service manager. For example:

```bash
brew services start mongodb-community
```

or:

```bash
sudo systemctl start mongod
```

### 5. Run the Backend

Open a terminal:

```bash
npm run dev --prefix server
```

Expected output:

```text
API listening on http://localhost:5000
```

Test the backend:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{"ok":true}
```

### 6. Run the Frontend

Open another terminal:

```bash
npm run dev --prefix client
```

Open the Vite URL shown in the terminal:

```text
http://localhost:5173
```

If port `5173` is busy, Vite may use another port such as `5174` or `5175`.

### 7. Use the Application

1. Create a new account from the signup screen.
2. Select one of the workspace cards: JavaScript, Python, or Website Builder.
3. Create a project.
4. Open the project.
5. Create, edit, save, and delete files from the file explorer.
6. Use the AI chat panel to ask questions about the project.
7. In Website Builder projects, view the live preview below the editor.

### Run Both Apps Together

After MongoDB is running, you can also start backend and frontend together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Troubleshooting

### Signup Shows `Failed to fetch`

This means the frontend cannot reach the backend.

Check that the backend is running:

```text
http://localhost:5000/api/health
```

If the page does not return `{"ok":true}`, restart the backend:

```bash
npm run dev --prefix server
```

Also confirm MongoDB is running.

### `mongod` or `mongosh` Is Not Recognized

`mongosh` is optional for this project. The app only needs the MongoDB server/service running.

On Windows, check the service:

```powershell
Get-Service MongoDB
```

If the service is stopped:

```powershell
Start-Service MongoDB
```

Run PowerShell as Administrator if permission is denied.

### Backend Does Not Print `API listening`

The backend connects to MongoDB before starting. If MongoDB is stopped or the connection string is wrong, the API will not listen on port `5000`.

Check `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ai-coding-workspace
```

Then restart the backend.

### GitHub Push Shows `403 Permission Denied`

Make sure you are authenticated with the GitHub account that owns the repository:

```text
https://github.com/CPAI-max/ai-coding-workspace
```

If Git is logged in as another account, either switch GitHub credentials or add that account as a collaborator.

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
