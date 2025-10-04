import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // React Router hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save user details in localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect based on role using navigate
      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "organizer") navigate("/organizer");
      else if (role === "admin") navigate("/admin");
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="max-w-md w-full p-10 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            CERTIFICATE MANAGEMENT SYSTEM
          </h1>
          <p className="text-gray-500">
            Centralized platform for certificate access and management.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-white"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-700 text-white font-semibold rounded-lg"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
