import { useState, useEffect } from "react";
import { Trash2, Edit3, Pin, PinOff, CheckCircle, Circle } from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/tasks/${editId}`
      : "http://localhost:5000/api/tasks";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, priority, dueDate }),
      });
      setTitle("");
      setDescription("");
      setPriority("Low");
      setDueDate("");
      setEditId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setEditId(task._id);
  };

  const togglePin = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error pinning task:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks
    .filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned === b.pinned) return new Date(b.createdAt) - new Date(a.createdAt);
      return b.pinned ? 1 : -1;
    });

  // Determine smart due date color
  const getDueDateClass = (date) => {
    if (!date) return "bg-gray-400 text-white";
    const today = new Date();
    const due = new Date(date);
    const diff = (due - today) / (1000 * 60 * 60 * 24); // difference in days
    if (diff < 0) return "bg-red-500 text-white"; // overdue
    if (diff <= 2) return "bg-yellow-500 text-white"; // due soon
    return "bg-blue-500 text-white"; // later
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Tasks</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>

        {/* Priority badges + Due Date */}
        <div className="flex flex-wrap gap-3 items-center mt-2">
          {["Low", "Medium", "High"].map((level) => (
            <span
              key={level}
              onClick={() => setPriority(level)}
              className={`cursor-pointer px-3 py-1 rounded-full text-white text-sm font-semibold transition
                ${priority === level ? "ring-2 ring-offset-1 ring-blue-500" : ""}
                ${level === "Low" ? "bg-green-500" : level === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}
            >
              {level}
            </span>
          ))}

          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition mt-2"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Tasks List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`p-4 rounded-xl shadow border transition-all duration-200
                         ${task.pinned
                           ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                           : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}
                         ${task.completed ? "opacity-60 line-through" : ""}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                  {task.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleComplete(task._id)}
                    className="text-green-500 hover:text-green-700"
                    title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                  >
                    {task.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => togglePin(task._id)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title={task.pinned ? "Unpin task" : "Pin task"}
                  >
                    {task.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => editTask(task)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-gray-700 dark:text-gray-300 break-words">{task.description}</p>

              {/* Priority + Smart Due Date Badge */}
              <div className="mt-1 flex gap-2 items-center flex-wrap">
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs font-semibold
                    ${task.priority === "Low" ? "bg-green-500" : task.priority === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}
                >
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDueDateClass(task.dueDate)}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center w-full">No tasks found.</p>
        )}
      </div>
    </div>
  );
}
