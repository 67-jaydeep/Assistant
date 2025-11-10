// components/MainLayout.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileBottomNav";

export default function MainLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    setLoading(false);
  }, []);

  if (loading) return null; // Prevents flickering

  // Redirect to login if no token found
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* 🔹 Top Navbar */}
      <Navbar />

      {/* 🔹 Main Section (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content (scrollable) */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>

      {/* 🔹 Bottom Nav (only for mobile) */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </div>
  );
}
