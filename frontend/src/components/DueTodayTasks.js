import React, { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DueTodayTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const upcoming = data
        .filter((t) => !t.completed && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

      setTasks(upcoming);
    };

    fetchTasks();
  }, []);

  return (
    <div
      onClick={() => navigate("/tasks")}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-red-400 transition min-h-[200px] flex flex-col"
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <CalendarClock className="w-4 h-4 text-red-500" />
        Due / Upcoming Tasks
      </h3>

      <ul className="mt-4 space-y-3 text-sm flex-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {task.title}
              </p>
              <p className="text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString("en-IN")}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No upcoming deadlines</p>
        )}
      </ul>
    </div>
  );
}
