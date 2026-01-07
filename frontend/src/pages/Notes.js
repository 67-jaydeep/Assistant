import { useState, useEffect } from "react";
import {
  Trash2,
  Edit3,
  Pin,
  PinOff,
  Eye,
  X,
  Plus,

} from "lucide-react";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [viewNote, setViewNote] = useState(null);

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    const res = await fetch("http://localhost:5000/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(await res.json());
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await fetch(
      editId
        ? `http://localhost:5000/api/notes/${editId}`
        : "http://localhost:5000/api/notes",
      {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      }
    );

    setTitle("");
    setContent("");
    setEditId(null);
    setFormOpen(false);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
    setFormOpen(true);
  };

  const togglePin = async (id) => {
    await fetch(`http://localhost:5000/api/notes/${id}/pin`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      a.pinned === b.pinned
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : b.pinned
        ? 1
        : -1
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Notes
        </h2>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => setFormOpen((v) => !v)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all hover:-translate-y-0.5"
          >
           <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Collapsible Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            required
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={5}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
          >
            {editId ? "Update Note" : "Add Note"}
          </button>
        </form>
      )}

      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className={`p-5 rounded-3xl border bg-white/80 dark:bg-slate-800/80 transition-all hover:-translate-y-1 ${
              note.pinned
                ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg truncate text-slate-800 dark:text-slate-100">
                {note.title}
              </h3>

              <div className="flex gap-2">
                <button onClick={() => setViewNote(note)}>
                  <Eye size={16} />
                </button>
                <button onClick={() => togglePin(note._id)}>
                  {note.pinned ? (
                    <PinOff size={16} className="text-yellow-500" />
                  ) : (
                    <Pin size={16} className="text-yellow-500" />
                  )}
                </button>
                <button onClick={() => editNote(note)}>
                  <Edit3 size={16} className="text-blue-500" />
                </button>
                <button onClick={() => deleteNote(note._id)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
              {note.content}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {viewNote && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {viewNote.title}
              </h3>
              <button onClick={() => setViewNote(null)}>
                <X />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {viewNote.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
