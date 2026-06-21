function buildPreview(files) {
  const index = files.find((file) => file.path.endsWith("index.html"))?.content || "";
  const styles = files
    .filter((file) => file.language === "css" || file.path.endsWith(".css"))
    .map((file) => `<style>${file.content}</style>`)
    .join("\n");
  const scripts = files
    .filter((file) => file.language === "javascript" || file.path.endsWith(".js"))
    .map((file) => `<script>${file.content}<\/script>`)
    .join("\n");

  if (!index) {
    return "<main style='font-family: sans-serif; padding: 24px'>Create index.html to preview the website.</main>";
  }

  return index.replace("</head>", `${styles}</head>`).replace("</body>", `${scripts}</body>`);
}

export default function WebsitePreview({ files }) {
  return (
    <section className="border-t border-line bg-white">
      <div className="border-b border-line bg-panel px-4 py-2 text-sm font-bold">Live Preview</div>
      <iframe className="h-80 w-full bg-white" title="Website preview" sandbox="allow-scripts" srcDoc={buildPreview(files)} />
    </section>
  );
}
