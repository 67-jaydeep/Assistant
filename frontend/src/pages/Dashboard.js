import React, { useState, useEffect, useCallback } from "react";
import TaskCard from "../components/TaskCard";
import ExpenseCard from "../components/ExpenseCard";
import NoteCard from "../components/NoteCard";
import HabitCard from "../components/HabitCard";
import RecentActivity from "../components/RecentActivity";
import RecentTransactions from "../components/RecentTransactions";
import MostImportantTask from "../components/MostImportantTask";
import TasksSnapshot from "../components/TasksSnapshot";
import DueTodayTasks from "../components/DueTodayTasks";
import { useNavigate } from "react-router-dom";
import { Sun, Cloud, Moon, MapPin, Clock } from "lucide-react";

export default function Dashboard() {
  const [firstName, setFirstName] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("Fetching location...");
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  // ✅ Fetch Dashboard Summary
  const fetchSummary = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/dashboard-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ✅ Fetch Weather
  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  }, []);

  // ✅ Get Location
  const getUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          fetchWeather(lat, lon);
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Your Area";
            setLocation(city);
          } catch {
            setLocation("Unknown");
          }
        },
        () => setLocation("Location unavailable")
      );
    } else {
      setLocation("Not supported");
    }
  }, [fetchWeather]);

  // ✅ Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return { text: "Good Morning", icon: <Sun className="w-6 h-6 text-yellow-500" /> };
    if (hour < 18)
      return { text: "Good Afternoon", icon: <Cloud className="w-6 h-6 text-blue-500" /> };
    return { text: "Good Evening", icon: <Moon className="w-6 h-6 text-indigo-400" /> };
  };

  // ✅ Live Time Update
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Mount once
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setFirstName(storedName.trim().split(" ")[0]);
    fetchSummary();
    getUserLocation();
  }, [fetchSummary, getUserLocation]);

  const { text, icon } = getGreeting();
  const formattedDate = dateTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading) return <div className="text-center mt-20">Loading dashboard...</div>;

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
      {/* 🔥 Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-2xl md:text-3xl font-semibold">
            {text},{" "}
            <span className="text-blue-600 dark:text-blue-400">{firstName}</span>
          </h1>
        </div>

        {/* 🌤️ Weather + Time */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span>{location}</span>
          </div>
          {weather && (
            <>
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span>{Math.round(weather.temperature)}°C</span>
            </>
          )}
          <span className="text-gray-500 dark:text-gray-400">•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-500" />
            <span>
              {formattedTime} | {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* 🧩 Cards Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto mb-10">
        <TaskCard data={summary?.tasks} />
        <ExpenseCard data={summary?.expenses} />
        <NoteCard data={summary?.notes} />
        <HabitCard data={summary?.habits} />
      </div>
<div className="mt-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
  <RecentActivity />
  <RecentTransactions />
</div>
<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
  <MostImportantTask />
  <TasksSnapshot />
  <DueTodayTasks />
</div>
    </div>
  );
}
