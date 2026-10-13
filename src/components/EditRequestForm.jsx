
import { useState } from "react";
import { X } from "lucide-react";

export default function EditRequestForm({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    title: item.title || "",
    clientName: item.clientName || "",
    description: item.description || "",
    priority: item.priority || "Medium",
    status: item.status || "New",
    dueDate: item.dueDate
      ? new Date(item.dueDate).toISOString().slice(0, 10)
      : ""
  });

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    onSave({
      ...form,
      dueDate: `${form.dueDate}T00:00:00`
    });
  }

  return (
    <div className="backdrop">
      <section className="modal">
        <header className="modal-head">
          <div>
            <small>EDIT REQUEST #{item.id}</small>
            <h2>Edit Work Request</h2>
          </div>
          <button className="icon" type="button" onClick={onClose}>
            <X />
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Title *
              <input name="title" required maxLength={100}
                value={form.title} onChange={change} />
            </label>

            <label>
              Client Name *
              <input name="clientName" required maxLength={100}
                value={form.clientName} onChange={change} />
            </label>

            <label>
              Priority
              <select name="priority" value={form.priority} onChange={change}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={change}>
                <option value="New">New</option>
                <option value="InProgress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label>
              Due Date *
              <input type="date" name="dueDate" required
                value={form.dueDate} onChange={change} />
            </label>

            <label className="wide">
              Description
              <textarea name="description" rows={3} maxLength={1000}
                value={form.description} onChange={change} />
            </label>
          </div>

          <footer className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
