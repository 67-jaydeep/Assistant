import { useState, useEffect } from "react";
import {
  Trash2,
  Edit3,
  Pin,
  PinOff,
  CheckCircle2,
  RotateCcw,
  Clock,
  Flame,
  Plus,
} from "lucide-react";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [habitType, setHabitType] = useState("binary");
  const [dailyTarget, setDailyTarget] = useState(1);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchHabits = async () => {
    const res = await fetch("http://localhost:5000/api/habits", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHabits(await res.json());
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await fetch(
      editId
        ? `http://localhost:5000/api/habits/${editId}`
        : "http://localhost:5000/api/habits",
      {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          frequency,
          habitType,
          dailyTarget: habitType === "counter" ? dailyTarget : 1,
        }),
      }
    );

    setTitle("");
    setDescription("");
    setFrequency("Daily");
    setHabitType("binary");
    setDailyTarget(1);
    setEditId(null);
    setFormOpen(false);
    fetchHabits();
  };

  const toggleComplete = async (id) => {
    await fetch(`http://localhost:5000/api/habits/${id}/complete`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHabits();
  };

  const undoProgress = async (id) => {
    await fetch(`http://localhost:5000/api/habits/${id}/undo`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHabits();
  };

  const togglePin = async (id) => {
    await fetch(`http://localhost:5000/api/habits/${id}/pin`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHabits();
  };

  const deleteHabit = async (id) => {
    await fetch(`http://localhost:5000/api/habits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHabits();
  };

  const editHabit = (habit) => {
    setTitle(habit.title);
    setDescription(habit.description);
    setFrequency(habit.frequency);
    setHabitType(habit.habitType || "binary");
    setDailyTarget(habit.dailyTarget || 1);
    setEditId(habit._id);
    setFormOpen(true);
  };

  const filteredHabits = habits.filter(
    (h) =>
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Habits
          </h2>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search habits"
            className="
              flex-1 md:w-64 px-4 py-2.5
              rounded-xl
              bg-white/70 dark:bg-slate-800/70
              backdrop-blur
              border border-slate-200 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:ring-2 focus:ring-indigo-500
            "
          />

          {/* ✅ Add Habit button – shadow removed */}
          <button
            onClick={() => setFormOpen((v) => !v)}
            className="
              flex items-center gap-2 px-4 py-2.5
              rounded-xl
              bg-gradient-to-r from-indigo-600 to-blue-600
              text-white font-medium
              hover:brightness-110
              hover:-translate-y-0.5
              active:translate-y-0
              transition-all
            "
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="
            mb-8 p-6 rounded-3xl
            bg-white/80 dark:bg-slate-800/80
            backdrop-blur
            border border-slate-200 dark:border-slate-700
            space-y-4
          "
        >
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {editId ? "Edit Habit" : "Create Habit"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Small actions compound over time
            </p>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Habit title"
            className="
              w-full px-4 py-3 rounded-2xl
              bg-slate-50 dark:bg-slate-900
              border border-slate-200 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:ring-2 focus:ring-indigo-500
            "
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Habit description"
            className="
              w-full px-4 py-3 rounded-2xl
              bg-slate-50 dark:bg-slate-900
              border border-slate-200 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              focus:ring-2 focus:ring-indigo-500
            "
            required
          />

          <div className="grid md:grid-cols-3 gap-3">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="
                px-4 py-3 rounded-2xl
                bg-slate-100 dark:bg-slate-800
                border border-slate-300 dark:border-slate-600
                text-slate-800 dark:text-slate-100
                focus:ring-2 focus:ring-indigo-500
              "
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>

            <select
              value={habitType}
              onChange={(e) => setHabitType(e.target.value)}
              className="
                px-4 py-3 rounded-2xl
                bg-slate-100 dark:bg-slate-800
                border border-slate-300 dark:border-slate-600
                text-slate-800 dark:text-slate-100
                focus:ring-2 focus:ring-indigo-500
              "
            >
              <option value="binary">Binary Habit</option>
              <option value="counter">Counter Habit</option>
            </select>

            {habitType === "counter" && (
              <input
                type="number"
                min="1"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(+e.target.value)}
                placeholder="Daily target"
                className="
                  px-4 py-3 rounded-2xl
                  bg-slate-50 dark:bg-slate-900
                  border border-slate-200 dark:border-slate-700
                  text-slate-800 dark:text-slate-100
                  focus:ring-2 focus:ring-indigo-500
                "
              />
            )}
          </div>

          <button
            type="submit"
            className="
              w-full py-3 rounded-2xl
              bg-indigo-600 hover:bg-indigo-700
              text-white font-medium transition
            "
          >
            {editId ? "Update Habit" : "Add Habit"}
          </button>
        </form>
      )}

      {/* Habit Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHabits.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-medium">No habits yet</p>
            <p className="text-sm">
              Start small — consistency beats intensity
            </p>
          </div>
        )}

        {filteredHabits.map((habit) => {
          const isCounter = habit.habitType === "counter";
          const completedToday =
            habit.completed &&
            habit.lastCompletedAt &&
            new Date(habit.lastCompletedAt).toDateString() ===
              new Date().toDateString();

          return (
            <div
              key={habit._id}
className={`
  relative p-5 rounded-3xl
  border
  bg-white/80 dark:bg-slate-800/80
  backdrop-blur
  transition-all
  hover:-translate-y-1
  ${
    habit.pinned
      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
      : "border-gray-200 dark:border-gray-700"
  }
`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg truncate text-slate-800 dark:text-slate-100">
                  {habit.title}
                </h3>

                <div className="flex gap-2">
                  <button onClick={() => togglePin(habit._id)}>
                    {habit.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                  </button>

                  <button
                    onClick={() => toggleComplete(habit._id)}
                    className={`p-2 rounded-full ${
                      habit.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                {habit.description}
              </p>

              {isCounter && (
                <div className="mb-3">
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${Math.min(
                          (habit.progress / habit.dailyTarget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {habit.progress} / {habit.dailyTarget}
                    </span>
                    {habit.progress > 0 && (
                      <button onClick={() => undoProgress(habit._id)}>
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {habit.frequency}
                </span>

                {habit.streak > 0 && (
                  <span className="flex items-center gap-1 text-orange-500">
                    <Flame size={14} /> {habit.streak}
                  </span>
                )}
              </div>

              {completedToday && (
                <div className="mt-2 text-xs text-green-600">
                  Completed today
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button onClick={() => editHabit(habit)}>
                  <Edit3 size={14} />
                </button>
                <button onClick={() => deleteHabit(habit._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Habits;
