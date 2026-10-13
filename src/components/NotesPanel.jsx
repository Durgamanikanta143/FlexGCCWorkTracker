import { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { api } from "../services/workRequestApi";

export default function NotesPanel({ item, onClose, onError }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api.getNotes(item.id).then(data => active && setNotes(Array.isArray(data) ? data : []))
      .catch(e => active && onError(e.message));
    return () => { active = false; };
  }, [item.id, onError]);
  async function add(e) {
    e.preventDefault(); if (!text.trim()) return;
    setBusy(true);
    try { const created = await api.addNote(item.id, text.trim()); setNotes(n => [created, ...n]); setText(""); }
    catch (e) { onError(e.message); } finally { setBusy(false); }
  }
  useEffect(() => {
  api.getNotes(item.id)
    .then(data => setNotes(Array.isArray(data) ? data : []))
    .catch(e => onError(e.message));
   }, [item.id, onError]);

  return <div className="notes-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <aside className="notes-panel"><header className="modal-head"><div><small>REQUEST NOTES</small><h2>{item.title}</h2></div><button className="icon" onClick={onClose} aria-label="Close notes"><X/></button></header>
      <div className="notes-list">{notes.length ? notes.map(n => <article className="note" key={n.id}><b>{n.author || "Team member"}</b><time>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</time><p>{n.note}</p></article>) : <p className="muted">No notes yet. Add the first update below.</p>}</div>
      <form className="note-form" onSubmit={add}><input value={text} onChange={e => setText(e.target.value)} maxLength="1000" placeholder="Add a note..." aria-label="Add a note"/><button className="btn primary" disabled={busy || !text.trim()}><Send size={15}/>{busy ? "Adding..." : "Add Note"}</button></form>
    </aside></div>;
}