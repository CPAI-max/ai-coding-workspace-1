import { Braces, FileCode2, Globe2 } from "lucide-react";

export const workspaces = [
  {
    id: "javascript",
    title: "JavaScript Workspace",
    description: "Build modular JavaScript projects with linked files and assistant support.",
    accent: "bg-marine",
    Icon: Braces
  },
  {
    id: "python",
    title: "Python Workspace",
    description: "Organize Python files and ask contextual questions about your code.",
    accent: "bg-fern",
    Icon: FileCode2
  },
  {
    id: "website",
    title: "Website Builder",
    description: "Create HTML, CSS, JavaScript, and Tailwind pages with live preview.",
    accent: "bg-ember",
    Icon: Globe2
  }
];

export function workspaceById(id) {
  return workspaces.find((workspace) => workspace.id === id) || workspaces[0];
}
