const { useState, useEffect } = require("react");
const { Trash2, Edit3, Pin, PinOff, CheckCircle2 } = require("lucide-react");

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all habits
  const fetchHabits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  // Add / Update Habit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/habits/${editId}`
      : "http://localhost:5000/api/habits";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, frequency }),
      });
      setTitle("");
      setDescription("");
      setFrequency("Daily");
      setEditId(null);
      fetchHabits();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  // Delete Habit
  const deleteHabit = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // Edit Habit
  const editHabit = (habit) => {
    setTitle(habit.title);
    setDescription(habit.description);
    setFrequency(habit.frequency);
    setEditId(habit._id);
  };

  // Toggle Pin
  const togglePin = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabits();
    } catch (error) {
      console.error("Error pinning habit:", error);
    }
  };

  // Toggle Complete
  const toggleComplete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabits();
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // Search + Sort
  const filteredHabits = habits
    .filter(
      (h) =>
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned === b.pinned) return new Date(b.createdAt) - new Date(a.createdAt);
      return b.pinned ? 1 : -1;
    });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Habits
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search habits..."
          className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Habit title"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Habit description..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>

        {/* Frequency */}
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {editId ? "Update Habit" : "Add Habit"}
        </button>
      </form>

      {/* Habit Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => (
            <div
              key={habit._id}
              className={`p-4 rounded-xl shadow border transition-all duration-200 
                         ${habit.pinned
                           ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                           : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                  {habit.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => togglePin(habit._id)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    {habit.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleComplete(habit._id)}
                    className={`${
                      habit.completed ? "text-green-600" : "text-gray-400 hover:text-green-500"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => editHabit(habit)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300 break-words">
                {habit.description}
              </p>
              <div className="mt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>🕒 {habit.frequency}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center w-full">
            No habits found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Habits;