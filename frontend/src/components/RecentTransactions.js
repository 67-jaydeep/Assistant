import React, { useEffect, useState } from "react";
import { List, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Sort and show latest 5 only
        const recentFive = data.slice(0, 5);
        setTransactions(recentFive);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center">
        Loading recent transactions...
      </p>
    );

  return (
    <div className="w-full md:w-1/2 px-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <List className="w-5 h-5 text-green-500" /> Recent Transactions
        </h2>

        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((t, idx) => (
              <li
                key={idx}
                className="py-3 flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-3">
                  <Wallet
                    className={`w-4 h-4 ${
                      t.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {t.title || "Untitled Transaction"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t.accountName || "Unknown Account"} • {t.category}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm font-semibold flex items-center gap-1 ${
                      t.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {t.type === "income" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    ₹{t.amount}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No recent transactions yet.
          </p>
        )}
      </div>
    </div>
  );
}
