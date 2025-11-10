import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  Wallet,
  Heart,
} from "lucide-react";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare className="w-5 h-5" /> },
    { name: "Expenses", path: "/expenses", icon: <Wallet className="w-5 h-5" /> },
    { name: "Notes", path: "/notes", icon: <StickyNote className="w-5 h-5" /> },
    { name: "Habits", path: "/habits", icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col bg-gray-100 dark:bg-gray-800 p-4 w-60 min-h-screen shadow-sm transition-all duration-300">
      <ul className="space-y-2 mt-4">
        {links.map((link) => (
          <li key={link.name}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                  isActive ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
