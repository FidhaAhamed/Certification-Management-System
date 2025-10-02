import { useState } from "react";
import { registerAPI } from "../services/api";

export default function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await registerAPI({ name, email, role, password });
    if (res.success) {
      setSuccess("User registered! Please login.");
      setError("");
    } else {
      setError("Registration failed.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input className="border p-2 mb-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 mb-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <select className="border p-2 mb-2 w-full" value={role} onChange={e => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
        <input className="border p-2 mb-2 w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">Register</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </form>
    </div>
  );
}