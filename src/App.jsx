import { useCallback, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Bell, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, ChartNoAxesColumn, Search, Plus, Eye, Pencil, MessageSquareText, CalendarDays, CheckCircle2, Clock3, CircleAlert, RefreshCw, Menu, X, SlidersHorizontal, Inbox } from "lucide-react";
import { api } from "./services/workRequestApi";
import RequestForm from "./components/RequestForm";
import NotesPanel from "./components/NotesPanel";
import EditRequestForm from "./components/EditRequestForm";

const STATUSES = ["New", "InProgress", "Blocked", "Completed"];
const LABEL = { New: "New", InProgress: "In Progress", Blocked: "Blocked", Completed: "Completed" };
const dateText = value => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString() : "Not set";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [due, setDue] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [notes, setNotes] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [updating, setUpdating] = useState(false);
  const pageSize = 6;
  const [darkMode, setDarkMode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await api.getAll(); setItems(Array.isArray(data) ? data : []); }
    catch (e) { setError(`Unable to load work requests. ${e.message}`); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => items.filter(x => {
    const term = `${x.title || ""} ${x.clientName || ""}`.toLowerCase();
    const dueMatches = !due || (x.dueDate && new Date(x.dueDate).toISOString().slice(0, 10) === due);
    return term.includes(search.toLowerCase().trim()) && (status === "All" || x.status === status) && (priority === "All" || x.priority === priority) && dueMatches;
  }), [items, search, status, priority, due]);
  useEffect(() => setPage(1), [search, status, priority, due]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const count = value => items.filter(x => x.status === value).length;

  async function create(payload) {
    setSaving(true); setError(""); setMessage("");
    try { await api.create(payload); setFormOpen(false); setMessage("Work request created successfully."); await load(); return true; }
    catch (e) { setError(`Unable to create request. ${e.message}`); return false; }
    finally { setSaving(false); }
  }
  async function changeStatus(id, next) {
    setError(""); setMessage("");
    try {
      const updated = await api.updateStatus(id, next);
      setItems(old => old.map(x => x.id === id ? { ...x, ...(updated || {}), status: next, updatedAt: updated?.updatedAt || new Date().toISOString() } : x));
      setMessage(`Request #${id} status changed to ${LABEL[next]}.`);
    } catch (e) { setError(`Unable to update status. ${e.message}`); await load(); }
  }
  function clear() { setSearch(""); setStatus("All"); setPriority("All"); setDue(""); }

    async function saveEdit(data) {
    setUpdating(true);
    setError("");
    setMessage("");

    try {
      await api.update(editing.id, data);

      setEditing(null);
      setMessage("Work request updated successfully.");

      await load();
    } catch (e) {
      setError(`Unable to update request. ${e.message}`);
    } finally {
      setUpdating(false);
    }
  }
  return <div className={`shell ${darkMode ? "dark-mode" : "light-mode"}`}>
    <aside className={`sidebar ${navOpen ? "nav-open" : ""}`}>
      <div className="brand"><div className="brand-icon"><BriefcaseBusiness size={25}/></div><div><strong>FlexGCC</strong><span>Work Request Tracker</span></div><button className="icon mobile-close" onClick={() => setNavOpen(false)}><X/></button></div>
      <div className="nav-label">WORKSPACE</div><nav>
        <button className="nav-item active"><ClipboardList size={18}/>Work Requests</button>
        <button className="nav-item" onClick={clear}><LayoutDashboard size={18}/>Dashboard</button>
        <button className="nav-item" onClick={() => setStatus("New")}><Inbox size={18}/>My Requests</button>
        <button className="nav-item" onClick={clear}><ClipboardList size={18}/>All Requests</button>
        <button className="nav-item" onClick={() => setMessage(`There are ${items.length} total requests.`)}><ChartNoAxesColumn size={18}/>Reports</button>
      </nav>
      <div className="sidebar-user"><div className="avatar">M</div><div><b>Manikanta</b><small>Full Stack Developer</small></div><ChevronDown size={16}/></div>
      <div className="copyright">© {new Date().getFullYear()} FlexGCC. All rights reserved.</div>
    </aside>
    {navOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setNavOpen(false)}/>}
    <main className="main">
      <header className="topbar">
  <button
    className="icon menu"
    onClick={() => setNavOpen(true)}
    aria-label="Open navigation"
  >
    <Menu />
  </button>

  <div className="crumb">
    Workspace <span>/</span> <b>Work Requests</b>
  </div>

  <div className="topbar-actions">
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setDarkMode(prev => !prev)}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light Mode" : "Dark Mode"}
    >
      {darkMode ? "☀️" : "🌙"}
      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>

    <div className="top-user">
      <div className="avatar">M</div>
      <b>Manikanta</b>
      <ChevronDown size={15} />
    </div>
  </div>
</header>
      <section className="content">
        <div className="page-heading"><div className="heading-icon"><BriefcaseBusiness size={25}/></div><div><h1>Work Request Tracker</h1><p>Create, track and manage client work requests</p></div></div>
        <div className="stats">
          <article className="stat blue"><div className="stat-icon"><ClipboardList/></div><div><span>Total Requests</span><strong>{items.length}</strong><small>All work requests</small></div></article>
          <article className="stat green"><div className="stat-icon"><CheckCircle2/></div><div><span>Completed</span><strong>{count("Completed")}</strong><small>Successfully finished</small></div></article>
          <article className="stat yellow"><div className="stat-icon"><Clock3/></div><div><span>In Progress</span><strong>{count("InProgress")}</strong><small>Currently active</small></div></article>
          <article className="stat red"><div className="stat-icon"><CircleAlert/></div><div><span>Blocked</span><strong>{count("Blocked")}</strong><small>Needs attention</small></div></article>
        </div>
        {error && <div className="alert error"><CircleAlert size={17}/><span>{error}</span><button onClick={load}>Retry</button><button className="icon" onClick={() => setError("")} aria-label="Dismiss"><X size={16}/></button></div>}
        {message && <div className="alert success"><CheckCircle2 size={17}/><span>{message}</span><button className="icon" onClick={() => setMessage("")} aria-label="Dismiss"><X size={16}/></button></div>}
        <section className="card">
          <div className="card-heading"><div><h2>Work Requests</h2><p>Review and manage your client work items.</p></div><button className="btn primary" onClick={() => setFormOpen(true)}><Plus size={17}/>New Request</button></div>
          <div className="filters">
            <label className="search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or client name..." aria-label="Search"/></label>
            <label className="filter"><SlidersHorizontal size={15}/><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Status filter"><option value="All">All Status</option>{STATUSES.map(s => <option key={s} value={s}>{LABEL[s]}</option>)}</select></label>
            <label className="filter"><span>⚑</span><select value={priority} onChange={e => setPriority(e.target.value)} aria-label="Priority filter"><option value="All">All Priority</option><option>High</option><option>Medium</option><option>Low</option></select></label>
            <label className="date-filter"><CalendarDays size={16}/><input type="date" value={due} onChange={e => setDue(e.target.value)} aria-label="Due date filter"/></label>
            <button className="btn quiet" onClick={clear}>Clear</button>
          </div>
          <div className="table-wrap"><table><thead><tr><th>#</th><th>Title</th><th>Client Name</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Created On</th><th>Actions</th></tr></thead>
            <tbody>{loading ? <tr><td colSpan="8"><div className="empty"><RefreshCw className="spin"/>Loading requests…</div></td></tr> :
              visible.length === 0 ? <tr><td colSpan="8"><div className="empty"><Inbox size={25}/><b>No work requests found</b><span>Try another filter or create a request.</span></div></td></tr> :
              visible.map((x, i) => <tr key={x.id}><td>{(page - 1) * pageSize + i + 1}</td><td className="title-cell"><b>{x.title}</b><small>{x.description || "No description"}</small></td><td>{x.clientName}</td>
                <td><select className={`status-select s-${(x.status || "new").toLowerCase()}`} value={x.status} onChange={e => changeStatus(x.id, e.target.value)} aria-label={`Change ${x.title} status`}>{STATUSES.map(s => <option key={s} value={s}>{LABEL[s]}</option>)}</select></td>
                <td><span className={`badge p-${(x.priority || "medium").toLowerCase()}`}>{x.priority}</span></td><td>{dateText(x.dueDate)}</td><td>{dateText(x.createdAt)}</td>
               <td>
                <div className="actions">
                  <button        className="action view"   title="View details" onClick={() => setDetails(x)} >
                    <Eye size={16} />
                  </button>

                  <button  className="action edit" title="Edit request"  onClick={() => setEditing(x)} >
                    <Pencil size={16} />
                  </button>

                  <button  className="action notes" title="Add Note"  onClick={() => setNotes(x)}>
                    <MessageSquareText size={16} />
                  </button>
                </div>
              </td>
               </tr>)}
            </tbody></table></div>
          <div className="table-footer"><span>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries</span><div className="pagination"><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page"><ChevronLeft size={16}/></button><span>{page} / {pages}</span><button disabled={page >= pages} onClick={() => setPage(p => p + 1)} aria-label="Next page"><ChevronRight size={16}/></button></div></div>
        </section><footer className="page-footer">© {new Date().getFullYear()} FlexGCC. All rights reserved.</footer>
      </section>
    </main>
    {formOpen && <RequestForm onClose={() => setFormOpen(false)} onCreate={create} saving={saving}/>}
     {editing && (<EditRequestForm item={editing}  onClose={() => setEditing(null)}   onSave={saveEdit}  saving={updating}/>)}
    {details && <div className="backdrop" onMouseDown={e => e.target === e.currentTarget && setDetails(null)}><section className="modal details"><header className="modal-head"><div><small>REQUEST #{details.id}</small><h2>{details.title}</h2></div><button className="icon" onClick={() => setDetails(null)} aria-label="Close"><X/></button></header><p className="description">{details.description || "No description provided."}</p><div className="detail-grid"><div><span>Client</span><b>{details.clientName}</b></div><div><span>Priority</span><b>{details.priority}</b></div><div><span>Status</span><b>{LABEL[details.status] || details.status}</b></div><div><span>Due Date</span><b>{dateText(details.dueDate)}</b></div><div><span>Created On</span><b>{dateText(details.createdAt)}</b></div></div><footer className="modal-actions"><button className="btn secondary" onClick={() => setDetails(null)}>Close</button></footer></section></div>}
    {notes && <NotesPanel item={notes} onClose={() => setNotes(null)} onError={setError}/>}
  </div>;
}