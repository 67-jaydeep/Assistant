import { useState, useEffect } from "react";
import { Trash2, Edit3, Pin, PinOff } from "lucide-react";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add or Update Note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/notes/${editId}`
      : "http://localhost:5000/api/notes";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      setTitle("");
      setContent("");
      setEditId(null);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit Note
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
  };

  // Toggle pin / unpin
  const togglePin = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (error) {
      console.error("Error pinning note:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes by search term
  const filteredNotes = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // pinned first
      if (a.pinned === b.pinned) {
        return new Date(b.createdAt) - new Date(a.createdAt); // newest first
      }
      return b.pinned ? 1 : -1;
    });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Notes
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note content..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {editId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className={`p-4 rounded-xl shadow border transition-all duration-200 
                         ${
                           note.pinned
                             ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                             : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                         }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                  {note.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => togglePin(note._id)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title={note.pinned ? "Unpin note" : "Pin note"}
                  >
                    {note.pinned ? (
                      <PinOff className="w-4 h-4" />
                    ) : (
                      <Pin className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => editNote(note)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300 break-words">
                {note.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center w-full">
            No notes found.
          </p>
        )}
      </div>
    </div>
  );
}
