import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  StickyNote,
  Heart,
} from "lucide-react";

export default function BottomNav() {
  const links = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare className="w-5 h-5" /> },
    { name: "Expenses", path: "/expenses", icon: <Wallet className="w-5 h-5" /> },
    { name: "Notes", path: "/notes", icon: <StickyNote className="w-5 h-5" /> },
    { name: "Habits", path: "/habits", icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-100 dark:bg-gray-800 shadow-inner flex justify-around py-3 border-t border-gray-200 dark:border-gray-700">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-medium ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          <span className="text-2xl mb-1">{link.icon}</span>
          <span>{link.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
