import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Plus,
  X,
} from "lucide-react";

export default function Expenses() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [accountName, setAccountName] = useState("Cash");
  const [accounts, setAccounts] = useState(["Cash"]);

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [newAccount, setNewAccount] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch all expenses
  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:5000/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExpenses(data);
  };

  // ✅ Fetch all accounts (from DB)
  const fetchAccounts = async () => {
    const res = await fetch("http://localhost:5000/api/expenses/accounts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAccounts(data.length > 0 ? data : ["Cash"]);
    setAccountName(data[0] || "Cash");
  };

  // ✅ Fetch summary
  const fetchSummary = async () => {
    const res = await fetch("http://localhost:5000/api/expenses/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSummary(data);
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    fetchAccounts(); // 🔹 Load saved accounts
  }, []);

  // ✅ Add new transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, amount, type, category, accountName, date };
    await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setTitle("");
    setAmount("");
    setCategory("");
    fetchExpenses();
    fetchSummary();
    
  };

  // ✅ Delete transaction
  const deleteExpense = async (id) => {
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses();
    fetchSummary();
  };

  // ✅ Add new account permanently
  const addAccount = async () => {
    if (newAccount && !accounts.includes(newAccount)) {
      await fetch("http://localhost:5000/api/expenses/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newAccount }),
      });
      setAccounts([...accounts, newAccount]);
      setAccountName(newAccount);
      setNewAccount("");
      setShowAddModal(false);
    }
  };

  // ✅ Calculate global totals
  const globalTotals = Object.values(summary).reduce(
    (acc, val) => {
      acc.income += val.income;
      acc.expense += val.expense;
      acc.balance += val.balance;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition">
      {/* 🧾 Header aligned left */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Expense Tracker
      </h2>

      {/* 💱 Type Toggle */}
      <div className="flex justify-start gap-4 mb-6">
        <button
          onClick={() => setType("expense")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition ${
            type === "expense"
              ? "bg-red-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          }`}
        >
          <ArrowDownCircle className="w-5 h-5" /> Expense
        </button>
        <button
          onClick={() => setType("income")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition ${
            type === "income"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          }`}
        >
          <ArrowUpCircle className="w-5 h-5" /> Income
        </button>
      </div>

      {/* 📋 Add Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === "expense" ? "Expense Title" : "Income Title"}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount ₹"
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={type === "expense" ? "Category (Food, Rent...)" : "Source (Job, Freelance...)"}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />

          {/* 🏦 Account with Add Button */}
          <div className="flex items-center gap-2">
            <select
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {accounts.map((acc, i) => (
                <option key={i} value={acc}>
                  {acc}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
              title="Add New Account"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add {type === "expense" ? "Expense" : "Income"}</span>
        </button>
      </form>

      {/* ➕ Smart Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-80 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Add New Account
            </h3>
            <input
              type="text"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              placeholder="e.g. HDFC Bank"
              className="w-full p-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={addAccount}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Add Account
            </button>
          </div>
        </div>
      )}

      {/* 💰 Global Totals */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mx-auto w-full">
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl shadow text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Income</p>
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{globalTotals.income}
          </h3>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl shadow text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Expenses</p>
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
            ₹{globalTotals.expense}
          </h3>
        </div>
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Balance</p>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{globalTotals.balance}
          </h3>
        </div>
      </div>

      {/* 🏦 Account Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mx-auto w-full">
        {Object.keys(summary).map((acc, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl shadow bg-gray-100 dark:bg-gray-800 text-center transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
              <Wallet className="w-5 h-5" />
              <h4 className="font-semibold text-lg">{acc}</h4>
            </div>
            <p className="text-green-600 dark:text-green-400">
              Income: ₹{summary[acc].income}
            </p>
            <p className="text-red-600 dark:text-red-400">
              Expense: ₹{summary[acc].expense}
            </p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              Balance: ₹{summary[acc].balance}
            </p>
          </div>
        ))}
      </div>

      {/* 📜 Expense List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto w-full">
        {expenses.length > 0 ? (
          expenses.map((item) => (
            <div
              key={item._id}
              className={`p-4 rounded-2xl shadow border ${
                item.type === "income"
                  ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                  : "border-red-400 bg-red-50 dark:bg-red-900/20"
              } transition hover:shadow-lg`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                  {item.title}
                </h3>
                <button
                  onClick={() => deleteExpense(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                ₹{item.amount} — {item.category}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.accountName} | {item.date.split("T")[0]}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center w-full">
            No transactions yet.
          </p>
        )}
      </div>
    </div>
  );
}
