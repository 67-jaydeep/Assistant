import React, { useEffect, useState } from "react";
import { List, NotebookPen, Wallet, Heart } from "lucide-react";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/activities/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setActivities(data.slice(0, 5)); // ✅ Only 5 latest activities
      } catch (err) {
        console.error("Error fetching recent activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center">
        Loading recent activities...
      </p>
    );

  return (
    <div className="w-full md:w-1/2 px-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <List className="w-5 h-5 text-blue-500" /> Recent Activity
        </h2>

        <div className="flex-1">
          {activities.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {activities.map((a, idx) => (
                <li
                  key={idx}
                  className="py-3 flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-3">
                    {a.type === "task" && (
                      <NotebookPen className="w-4 h-4 text-blue-500" />
                    )}
                    {a.type === "note" && (
                      <NotebookPen className="w-4 h-4 text-yellow-500" />
                    )}
                    {a.type === "expense" && (
                      <Wallet className="w-4 h-4 text-green-500" />
                    )}
                    {a.type === "habit" && (
                      <Heart className="w-4 h-4 text-red-500" />
                    )}

                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {a.action.charAt(0).toUpperCase() + a.action.slice(1)}{" "}
                        {a.type}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {a.details}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No recent activity yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
