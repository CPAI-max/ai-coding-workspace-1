The Project Name: AI Coding Workspace  : A simplified AI-powered coding workspace built for the technical assessment. Users can sign up, create isolated JavaScript, Python, and Website Builder projects, manage files, edit code, and chat with an AI assistant that can inspect and update project files.
Repository: https://github.com/CPAI-max/ai-coding-workspace-1.git
Tech Stack   :Frontend: React, Vite, Tailwind CSS, Monaco Editor 
Backend: Node.js, Express, MongoDB, Mongoose
Auth: JWT access token with bcrypt password hashing
Data: MongoDB collections for users, projects, files, and chat messages
Features
Signup and login
Session persistence through JWT stored client-side
Three workspace cards: JavaScript, Python, Website Builder
Project dashboard filtered by workspace
File explorer with create, edit, save, and delete actions
Monaco-powered code editor
Project-scoped chat history
AI helper endpoint with optional OpenAI integration
Basic AI file modification commands
Website Builder live preview for index.html, CSS, and JavaScript files
MongoDB ownership checks on every protected route

Getting Started
Prerequisites
Node.js 20+
MongoDB Community Server running locally, or a MongoDB Atlas connection string
Git
1. Clone the Repository
git clone https://github.com/CPAI-max/ai-coding-workspace-1.git
cd ai-coding-workspace-1
If you already have the project folder locally, open a terminal in that folder instead.
2. Install Dependencies
Install root, backend, and frontend dependencies:
npm run install:all
3. Configure Environment Variables
Create a file named server/.env.
You can copy the example file:
copy server\.env.example server\.env
For macOS/Linux:
cp server/.env.example server/.env
Use this local development configuration:
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-coding-workspace-1
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_API_KEY is optional. Without it, the app uses a deterministic local assistant that can summarize files and perform basic file updates.
4. Start MongoDB
Windows
Open PowerShell as Administrator and run:
Start-Service MongoDB
Get-Service MongoDB
Expected status:
Running  MongoDB
If MongoDB is not installed, install MongoDB Community Server:
winget install MongoDB.Server
Then reopen PowerShell as Administrator and start the service again.
macOS/Linux
Start MongoDB using your package manager or service manager. For example:
brew services start mongodb-community
or:
sudo systemctl start mongod
5. Run the Backend
Open a terminal:
npm run dev --prefix server
Expected output:
API listening on http://localhost:5000
Test the backend:
http://localhost:5000/api/health
Expected response:
{"ok":true}
6. Run the Frontend
Open another terminal:
npm run dev --prefix client
Open the Vite URL shown in the terminal:
http://localhost:5173
If port 5173 is busy, Vite may use another port such as 5174 or 5175.
7. Use the Application
Create a new account from the signup screen.
Select one of the workspace cards: JavaScript, Python, or Website Builder.
Create a project.
Open the project.
Create, edit, save, and delete files from the file explorer.
Use the AI chat panel to ask questions about the project.
In Website Builder projects, view the live preview below the editor.
Run Both Apps Together
After MongoDB is running, you can also start backend and frontend together:
npm run dev
Frontend: http://localhost:5173
Backend: http://localhost:5000
  
