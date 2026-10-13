import { useState } from "react";
import { X } from "lucide-react";

const initial = {
  title: "",
  clientName: "",
  description: "",
  priority: "Medium",
  status: "New",
  dueDate: ""
};

export default function RequestForm({ onClose, onCreate, saving }) {
  const [form, setForm] = useState(initial);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const today = now.toISOString().split("T")[0];

  const change = e =>
    setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();

    if (form.dueDate < today) {
      alert("Due date cannot be in the past.");
      return;
    }

    const ok = await onCreate({
      ...form,
      dueDate: `${form.dueDate}T00:00:00`
    });

    if (ok) onClose();
  }

  return (
    <div className="backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="modal">
        <header className="modal-head">
          <div>
            <small>WORKSPACE</small>
            <h2>Create New Work Request</h2>
          </div>
          <button type="button" className="icon" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Title *
              <input name="title" required maxLength="100" value={form.title} onChange={change} />
            </label>

            <label>
              Client Name *
              <input name="clientName" required maxLength="100" value={form.clientName} onChange={change} />
            </label>

            <label>
              Priority *
              <select name="priority" value={form.priority} onChange={change}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label>
              Status *
              <select name="status" value={form.status} onChange={change}>
                <option>New</option>
                <option>InProgress</option>
                <option>Blocked</option>
                <option>Completed</option>
              </select>
            </label>

            <label>
              Due Date *
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                min={today}
                onChange={change}
                required
              />
            </label>

            <label className="wide">
              Description
              <textarea
                name="description"
                maxLength="1000"
                rows="3"
                value={form.description}
                onChange={change}
              />
            </label>
          </div>

          <footer className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn primary" disabled={saving}>
              {saving ? "Creating..." : "Create Request"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
