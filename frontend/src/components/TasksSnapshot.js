import React, { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TasksSnapshot() {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tasks = await res.json();

      setStats({
        total: tasks.length,
        pending: tasks.filter((t) => !t.completed).length,
        completed: tasks.filter((t) => t.completed).length,
      });
    };

    fetchTasks();
  }, []);

  return (
    <div
      onClick={() => navigate("/tasks")}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-400 transition min-h-[200px] flex flex-col"
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <ListChecks className="w-4 h-4 text-blue-500" />
        Tasks Snapshot
      </h3>

      <div className="mt-4 grid grid-cols-3 text-center text-sm flex-1 items-center">
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {stats.total}
          </p>
          <p className="text-gray-500">Total</p>
        </div>

        <div>
          <p className="font-semibold text-yellow-500">
            {stats.pending}
          </p>
          <p className="text-gray-500">Pending</p>
        </div>

        <div>
          <p className="font-semibold text-green-500">
            {stats.completed}
          </p>
          <p className="text-gray-500">Done</p>
        </div>
      </div>
    </div>
  );
}
