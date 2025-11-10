import React from "react";
import { PieChart, TrendingUp, CheckCircle2, Notebook, Target } from "lucide-react";

export default function InsightsCard({ summary }) {
  if (!summary) return null;

  const insights = [
    {
      title: "Tasks Completed Today",
      value: summary.insights?.todayTasks || 0,
      color: "text-blue-600 dark:text-blue-400",
      icon: <CheckCircle2 className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      desc: "Keep the streak going 💪",
    },
    {
      title: "Monthly Savings",
      value: `₹${summary.insights?.monthlySavings || 0}`,
      color: "text-green-600 dark:text-green-400",
      icon: <TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400" />,
      desc: "Smart money management 💰",
    },
    {
      title: "Active Habits",
      value: summary.habits?.total || 0,
      color: "text-yellow-600 dark:text-yellow-400",
      icon: <Target className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />,
      desc: "Stay consistent every day 🌞",
    },
    {
      title: "Pinned Notes",
      value: summary.notes?.pinned || 0,
      color: "text-pink-600 dark:text-pink-400",
      icon: <Notebook className="w-6 h-6 text-pink-500 dark:text-pink-400" />,
      desc: "Creative thoughts saved 📒",
    },
  ];

  return (
    <div className="mt-10 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-blue-500" />
        Smart Insights
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              {insight.icon}
              <p className={`text-sm font-medium ${insight.color}`}>{insight.title}</p>
            </div>

            <h3
              className={`text-2xl font-bold mb-2 ${insight.color}`}
            >
              {insight.value}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">{insight.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
