import { useState } from "react";
import { Code2, LogIn } from "lucide-react";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { authenticate } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await authenticate(mode, form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#ece7db] px-4">
      <section className="w-full max-w-md rounded-lg border border-line bg-panel p-6 shadow-sm">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-md bg-fern text-white">
            <Code2 size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">AI Coding Workspace</h1>
            <p className="text-sm text-ink/65">Sign in to manage your coding projects.</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-md border border-line bg-white p-1">
          {["login", "signup"].map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded px-3 py-2 text-sm font-semibold capitalize ${
                mode === item ? "bg-ink text-white" : "text-ink/65"
              }`}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <label className="block text-sm font-semibold text-ink">
              Name
              <input
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-marine"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
          )}
          <label className="block text-sm font-semibold text-ink">
            Email
            <input
              className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-marine"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Password
            <input
              className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-marine"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={8}
              required
            />
          </label>
          {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button className="w-full" disabled={submitting}>
            <LogIn size={17} />
            {submitting ? "Working..." : mode === "login" ? "Login" : "Create Account"}
          </Button>
        </form>
      </section>
    </main>
  );
}
