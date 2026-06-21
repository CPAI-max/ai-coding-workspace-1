const templates = {
  javascript: [
    {
      path: "index.js",
      language: "javascript",
      content: "import { greet } from './utils.js';\n\nconsole.log(greet('workspace'));\n"
    },
    {
      path: "utils.js",
      language: "javascript",
      content: "export function greet(name) {\n  return `Hello, ${name}!`;\n}\n"
    }
  ],
  python: [
    {
      path: "main.py",
      language: "python",
      content: "from helpers import greet\n\nprint(greet('workspace'))\n"
    },
    {
      path: "helpers.py",
      language: "python",
      content: "def greet(name):\n    return f\"Hello, {name}!\"\n"
    }
  ],
  website: [
    {
      path: "index.html",
      language: "html",
      content:
        "<!doctype html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <script src=\"https://cdn.tailwindcss.com\"></script>\n    <link rel=\"stylesheet\" href=\"styles.css\" />\n  </head>\n  <body class=\"bg-slate-950 text-white\">\n    <main class=\"min-h-screen grid place-items-center p-8\">\n      <section class=\"max-w-xl\">\n        <p class=\"text-cyan-300 uppercase tracking-wide text-sm\">Website Builder</p>\n        <h1 class=\"mt-3 text-5xl font-bold\">Build something bright.</h1>\n        <button id=\"cta\" class=\"mt-6 rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-950\">Click me</button>\n      </section>\n    </main>\n    <script src=\"script.js\"></script>\n  </body>\n</html>\n"
    },
    {
      path: "styles.css",
      language: "css",
      content: "body {\n  font-family: Inter, ui-sans-serif, system-ui, sans-serif;\n}\n"
    },
    {
      path: "script.js",
      language: "javascript",
      content: "document.getElementById('cta')?.addEventListener('click', () => {\n  alert('Preview is alive');\n});\n"
    }
  ]
};

export function defaultFilesFor(workspace) {
  return templates[workspace] || [];
}

export function languageFromPath(path, workspace) {
  const extension = path.split(".").pop()?.toLowerCase();
  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown"
  };

  return map[extension] || (workspace === "python" ? "python" : "plaintext");
}
