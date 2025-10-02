import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  if (!user) return <Login setUser={setUser} />;
  return <Dashboard user={user} />;
}

export default App;