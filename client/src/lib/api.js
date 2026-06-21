const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem("workspace_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || "Request failed", response.status);
  }

  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  listProjects: (workspace) => request(`/projects?workspace=${workspace}`),
  createProject: (payload) => request("/projects", { method: "POST", body: JSON.stringify(payload) }),
  getProject: (projectId) => request(`/projects/${projectId}`),
  deleteProject: (projectId) => request(`/projects/${projectId}`, { method: "DELETE" }),
  createFile: (projectId, payload) =>
    request(`/projects/${projectId}/files`, { method: "POST", body: JSON.stringify(payload) }),
  updateFile: (projectId, fileId, payload) =>
    request(`/projects/${projectId}/files/${fileId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteFile: (projectId, fileId) => request(`/projects/${projectId}/files/${fileId}`, { method: "DELETE" }),
  sendChat: (projectId, message) =>
    request(`/projects/${projectId}/chat`, { method: "POST", body: JSON.stringify({ message }) })
};
