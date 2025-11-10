import React from "react";
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ExpenseCard({ data }) {
  const navigate = useNavigate();

  const income = data?.income || 0;
  const expense = data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="group bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-lg">Expenses</h3>
        </div>
        <button
          onClick={() => navigate("/expenses")}
          className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white"
          title="Go to Expenses"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 text-sm">
        <p className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="w-4 h-4" /> Income: ₹{income}
        </p>
        <p className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="w-4 h-4" /> Expense: ₹{expense}
        </p>
        <p
          className={`text-sm font-semibold ${
            balance >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          Balance: ₹{balance}
        </p>
      </div>
    </div>
  );
}
