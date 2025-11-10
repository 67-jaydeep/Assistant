import React from "react";
import { StickyNote, Pin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoteCard({ data }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="text-yellow-500" />
          <h3 className="font-semibold text-lg">Notes</h3>
        </div>
        <button
          onClick={() => navigate("/notes")}
          className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
          title="Go to Notes"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Total Notes: {data?.total || 0}
      </p>

      <div className="flex items-center gap-1">
        <Pin className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
          {data?.pinned || 0} pinned
        </p>
      </div>
    </div>
  );
}
