import { useState } from "react";
import { loginAPI } from "../services/api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await loginAPI(email, password);
    if (res.success) setUser(res.user);
    else setError("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input className="border p-2 mb-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 mb-2 w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Login</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
}