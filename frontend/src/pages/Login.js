import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);

      // Proper navigation
      navigate("/dashboard",{ replace: true }); // This works if inside Router
    } else {
      setError(data.message);
    }
  } catch (err) {
    setError("Server error");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
          Login
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
