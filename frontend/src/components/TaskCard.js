import React from "react";
import { CheckSquare, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ data }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-lg">Tasks</h3>
        </div>
        <button
          onClick={() => navigate("/tasks")}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          title="Go to Tasks"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {data?.total || 0} total | {data?.completed || 0} completed
      </p>

      <div className="flex items-center gap-2">
        {data?.pending > 0 ? (
          <>
            <AlertCircle className="text-yellow-500 w-4 h-4" />
            <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
              {data.pending} pending task(s)
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="text-green-500 w-4 h-4" />
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
              All tasks completed!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
