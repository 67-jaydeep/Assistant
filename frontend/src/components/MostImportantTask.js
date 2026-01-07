import React, { useEffect, useState } from "react";
import { Star, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MostImportantTask() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const priorityOrder = { high: 1, medium: 2, low: 3 };

      const important = data
        .filter((t) => !t.completed)
        .sort(
          (a, b) =>
            (priorityOrder[a.priority] || 4) -
            (priorityOrder[b.priority] || 4)
        )
        .slice(0, 3);

      setTasks(important);
    };

    fetchTasks();
  }, []);

  return (
    <div
      onClick={() => navigate("/tasks")}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 cursor-pointer transition hover:shadow-md min-h-[200px] flex flex-col"
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500" />
        Most Important Tasks
      </h3>

      <ul className="mt-4 space-y-3 text-sm flex-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {task.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <AlertCircle className="w-3 h-3" />
                <span className="capitalize">{task.priority} priority</span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No pending tasks 🎉</p>
        )}
      </ul>
    </div>
  );
}
