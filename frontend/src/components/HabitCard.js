import React from "react";
import { Heart, CheckCircle, Flame, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HabitCard({ data }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Heart className="text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-lg">Habits</h3>
        </div>
        <button
          onClick={() => navigate("/habits")}
          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          title="Go to Habits"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Total Habits: {data?.total || 0}
      </p>

      <div className="flex items-center gap-2">
        {data?.pending > 0 ? (
          <>
            <Flame className="w-4 h-4 text-red-500" />
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {data.pending} active habits
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
              All habits complete!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
