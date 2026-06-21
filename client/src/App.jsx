import { useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectWorkspace from "./pages/ProjectWorkspace.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user, loading } = useAuth();
  const [activeProject, setActiveProject] = useState(null);

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-panel text-ink">Loading workspace...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return activeProject ? (
    <ProjectWorkspace projectId={activeProject} onBack={() => setActiveProject(null)} />
  ) : (
    <Dashboard onOpenProject={setActiveProject} />
  );
}
