import { useState } from "react";
import { Sun, Moon, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const name = localStorage.getItem("name") || "User";

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Your Buddy
      </h1>

      <div className="flex items-center space-x-4 relative">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="w-5 h-5 text-gray-400" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                {name}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
