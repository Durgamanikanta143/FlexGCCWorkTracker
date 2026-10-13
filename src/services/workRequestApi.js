const BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:7040/api";

async function call(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
  });
  if (!response.ok) {
    const text = await response.text();
    let message = text || `Request failed (${response.status})`;
    try { const json = JSON.parse(text); message = json.message || json.title || message; } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}


export const api = {
  getAll: () => call("/work-requests"),

  create: (data) =>  call("/work-requests", {   method: "POST",  body: JSON.stringify(data) }),

  update: (id, data) =>call(`/work-requests/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  updateStatus: (id, status) => call(`/work-requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status })}),

  getNotes: (id) =>call(`/work-requests/${id}/notes`),

  addNote: (id, note) =>   call(`/work-requests/${id}/notes`, {      method: "POST",      body: JSON.stringify({ note })})
};
