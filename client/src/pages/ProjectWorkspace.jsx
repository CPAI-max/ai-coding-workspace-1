import Editor from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Button from "../components/Button.jsx";
import ChatPanel from "../components/ChatPanel.jsx";
import FileExplorer from "../components/FileExplorer.jsx";
import WebsitePreview from "../components/WebsitePreview.jsx";
import { api } from "../lib/api.js";
import { workspaceById } from "../lib/workspaces.js";

export default function ProjectWorkspace({ projectId, onBack }) {
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [chat, setChat] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [draft, setDraft] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");

  const activeFile = useMemo(() => files.find((file) => file._id === activeFileId), [files, activeFileId]);
  const workspace = project ? workspaceById(project.workspace) : null;
  const WorkspaceIcon = workspace?.Icon;

  async function loadProject() {
    setError("");
    const data = await api.getProject(projectId);
    setProject(data.project);
    setFiles(data.files);
    setChat(data.chat);
    const firstFile = data.files[0];
    setActiveFileId((current) => current || firstFile?._id || null);
    setDraft(firstFile?.content || "");
    setDirty(false);
  }

  useEffect(() => {
    loadProject().catch((err) => setError(err.message));
  }, [projectId]);

  useEffect(() => {
    if (!activeFile || dirty) return;
    setDraft(activeFile.content);
  }, [activeFile?._id]);

  function selectFile(fileId) {
    const selected = files.find((file) => file._id === fileId);
    setActiveFileId(fileId);
    setDraft(selected?.content || "");
    setDirty(false);
  }

  async function saveFile() {
    if (!activeFile) return;
    setSaving(true);
    try {
      const data = await api.updateFile(projectId, activeFile._id, { content: draft });
      setFiles((items) => items.map((file) => (file._id === data.file._id ? data.file : file)));
      setDirty(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function createFile() {
    const path = window.prompt("File path, e.g. src/app.js");
    if (!path) return;

    try {
      const data = await api.createFile(projectId, { path, content: "" });
      setFiles((items) => [...items, data.file].sort((a, b) => a.path.localeCompare(b.path)));
      setActiveFileId(data.file._id);
      setDraft(data.file.content);
      setDirty(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteFile() {
    if (!activeFile) return;
    const confirmed = window.confirm(`Delete ${activeFile.path}?`);
    if (!confirmed) return;

    await api.deleteFile(projectId, activeFile._id);
    const remaining = files.filter((file) => file._id !== activeFile._id);
    setFiles(remaining);
    setActiveFileId(remaining[0]?._id || null);
    setDraft(remaining[0]?.content || "");
    setDirty(false);
  }

  async function sendChat(message) {
    setChatLoading(true);
    setError("");
    try {
      const data = await api.sendChat(projectId, message);
      setChat((items) => [...items, ...data.messages]);
      setFiles(data.files);
      const updatedActive = data.files.find((file) => file._id === activeFileId);
      if (updatedActive && !dirty) {
        setDraft(updatedActive.content);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setChatLoading(false);
    }
  }

  if (!project || !workspace) {
    return <div className="grid min-h-screen place-items-center bg-panel text-ink">Opening project...</div>;
  }

  return (
    <main className="min-h-screen bg-[#ece7db] text-ink">
      <header className="border-b border-line bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft size={17} />
            </Button>
            <div className={`grid size-10 place-items-center rounded-md ${workspace.accent} text-white`}>
              {WorkspaceIcon ? <WorkspaceIcon size={20} /> : null}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold">{project.name}</h1>
              <p className="text-sm text-ink/60">{workspace.title}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={loadProject}>
            <RefreshCcw size={16} />
            Refresh
          </Button>
        </div>
      </header>

      {error && <p className="m-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="workspace-grid grid min-h-[calc(100vh-73px)] border-t border-line">
        <FileExplorer
          files={files}
          activeFileId={activeFileId}
          onSelect={selectFile}
          onCreate={createFile}
          onDelete={deleteFile}
          onSave={saveFile}
          dirty={dirty}
          saving={saving}
        />

        <section className="min-w-0 bg-[#1e1e1e]">
          <div className="flex min-h-11 items-center justify-between border-b border-black bg-[#252526] px-4 text-sm text-white">
            <span className="truncate">{activeFile?.path || "No file selected"}</span>
            <span className="text-xs text-white/50">{dirty ? "Unsaved changes" : "Saved"}</span>
          </div>
          <Editor
            height={project.workspace === "website" ? "calc(100vh - 433px)" : "calc(100vh - 118px)"}
            theme="vs-dark"
            language={activeFile?.language || "plaintext"}
            value={draft}
            onChange={(value) => {
              setDraft(value || "");
              setDirty(true);
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
          {project.workspace === "website" ? <WebsitePreview files={files.map((file) => (file._id === activeFileId ? { ...file, content: draft } : file))} /> : null}
        </section>

        <ChatPanel messages={chat} onSend={sendChat} loading={chatLoading} />
      </section>
    </main>
  );
}
