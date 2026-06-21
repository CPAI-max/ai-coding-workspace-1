import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, RefreshCcw, Trash2 } from "lucide-react";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import { workspaceById, workspaces } from "../lib/workspaces.js";

export default function Dashboard({ onOpenProject }) {
  const { user, logout } = useAuth();
  const [workspace, setWorkspace] = useState("javascript");
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const active = useMemo(() => workspaceById(workspace), [workspace]);

  async function loadProjects(selected = workspace) {
    setLoading(true);
    setError("");
    try {
      const data = await api.listProjects(selected);
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects(workspace);
  }, [workspace]);

  async function createProject(event) {
    event.preventDefault();
    if (!newName.trim()) return;

    try {
      const data = await api.createProject({
        name: newName.trim(),
        workspace,
        description: active.description
      });
      setNewName("");
      onOpenProject(data.project._id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeProject(projectId) {
    await api.deleteProject(projectId);
    setProjects((items) => items.filter((project) => project._id !== projectId));
  }

  return (
    <main className="min-h-screen bg-[#ece7db] text-ink">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <h1 className="text-2xl font-bold">AI Coding Workspace</h1>
            <p className="text-sm text-ink/65">Signed in as {user.name}</p>
          </div>
          <Button variant="secondary" onClick={logout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          {workspaces.map(({ id, title, description, accent, Icon }) => (
            <button
              key={id}
              onClick={() => setWorkspace(id)}
              className={`rounded-lg border bg-panel p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${
                workspace === id ? "border-ink" : "border-line"
              }`}
            >
              <div className={`mb-4 grid size-11 place-items-center rounded-md ${accent} text-white`}>
                <Icon size={22} />
              </div>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form onSubmit={createProject} className="rounded-lg border border-line bg-panel p-5 shadow-sm">
            <h2 className="text-lg font-bold">Create {active.title}</h2>
            <label className="mt-5 block text-sm font-semibold">
              Project name
              <input
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-marine"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Inventory scripts"
              />
            </label>
            <Button className="mt-4 w-full">
              <Plus size={17} />
              Create Project
            </Button>
          </form>

          <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Projects</h2>
                <p className="text-sm text-ink/65">{active.title}</p>
              </div>
              <Button variant="ghost" onClick={() => loadProjects()}>
                <RefreshCcw size={16} />
              </Button>
            </div>

            {error && <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {loading ? <p className="text-sm text-ink/65">Loading projects...</p> : null}
            {!loading && projects.length === 0 ? <p className="text-sm text-ink/65">No projects in this workspace yet.</p> : null}

            <div className="grid gap-3">
              {projects.map((project) => (
                <article key={project._id} className="rounded-md border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <button className="text-left" onClick={() => onOpenProject(project._id)}>
                      <h3 className="font-bold">{project.name}</h3>
                      <p className="mt-1 text-sm text-ink/60">{project.description}</p>
                    </button>
                    <Button variant="danger" onClick={() => removeProject(project._id)} title="Delete project">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
