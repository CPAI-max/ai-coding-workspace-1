import { useState } from "react";
import { Send } from "lucide-react";
import Button from "./Button.jsx";

export default function ChatPanel({ messages, onSend, loading }) {
  const [draft, setDraft] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    await onSend(draft.trim());
    setDraft("");
  }

  return (
    <aside className="chat-panel flex min-h-[520px] flex-col border-l border-line bg-panel">
      <div className="border-b border-line p-4">
        <h2 className="font-bold">AI Chat</h2>
        <p className="text-sm text-ink/60">Project-aware help and file edits.</p>
      </div>
      <div className="flex-1 space-y-3 overflow-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-ink/60">Ask about the code or request a change.</p>
        ) : null}
        {messages.map((message) => (
          <div
            key={message._id || `${message.role}-${message.content}`}
            className={`rounded-md border p-3 text-sm leading-6 ${
              message.role === "user" ? "border-marine/30 bg-blue-50" : "border-line bg-white"
            }`}
          >
            <p className="mb-1 text-xs font-bold uppercase text-ink/50">{message.role}</p>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="border-t border-line p-3">
        <textarea
          className="h-24 w-full resize-none rounded-md border border-line bg-white p-3 text-sm outline-none focus:border-marine"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask: improve this code, explain imports, update file index.html with ..."
        />
        <Button className="mt-2 w-full" disabled={loading}>
          <Send size={16} />
          {loading ? "Thinking..." : "Send"}
        </Button>
      </form>
    </aside>
  );
}
