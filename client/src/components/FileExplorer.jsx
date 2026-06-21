import { File, Plus, Save, Trash2 } from "lucide-react";
import Button from "./Button.jsx";

export default function FileExplorer({
  files,
  activeFileId,
  onSelect,
  onCreate,
  onDelete,
  dirty,
  onSave,
  saving
}) {
  return (
    <aside className="min-h-[520px] border-r border-line bg-panel p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-bold">Files</h2>
        <Button variant="ghost" onClick={onCreate} title="Create file">
          <Plus size={16} />
        </Button>
      </div>

      <div className="space-y-1">
        {files.map((file) => (
          <button
            key={file._id}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${
              activeFileId === file._id ? "bg-ink text-white" : "hover:bg-black/5"
            }`}
            onClick={() => onSelect(file._id)}
          >
            <File size={15} />
            <span className="min-w-0 truncate">{file.path}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onSave} disabled={!dirty || saving}>
          <Save size={15} />
          {saving ? "Saving" : "Save"}
        </Button>
        <Button variant="danger" onClick={onDelete} disabled={!activeFileId}>
          <Trash2 size={15} />
          Delete
        </Button>
      </div>
    </aside>
  );
}
