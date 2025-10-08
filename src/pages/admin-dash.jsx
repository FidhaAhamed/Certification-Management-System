import React, { useState } from "react";
import { LogOut, UserPlus } from "lucide-react";

const AdminDashboard = ({ currentUser, handleLogout }) => {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [dept, setDept] = useState("");
  const [clubName, setClubName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !password) {
      setMessage("❌ Name and password are required");
      return;
    }

    const payload = { role, name, password };

    if (role === "student" || role === "teacher") {
      if (!classId || !dept) {
        setMessage("❌ Class ID and Department are required for this role");
        return;
      }
      payload.class_id = classId;
      payload.dept = dept;
    } else if (role === "organizer") {
      if (!clubName) {
        setMessage("❌ Club name is required for organizers");
        return;
      }
      payload.club_name = clubName;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(`✅ Successfully created ${role}: ${name}`);
        setName("");
        setPassword("");
        setClassId("");
        setDept("");
        setClubName("");
      } else {
        setMessage(`❌ ${data.error || "Failed to create user"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700 flex items-center">
          <UserPlus className="w-6 h-6 mr-2" /> Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Create New User
          </h2>

          {message && (
            <p
              className={`p-3 mb-4 rounded-lg ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            {/* Role */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-white"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter name"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter password"
              />
            </div>

            {/* Conditional fields */}
            {(role === "student" || role === "teacher") && (
              <>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Class ID
                  </label>
                  <input
                    type="text"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter class ID"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter department"
                  />
                </div>
              </>
            )}

            {role === "organizer" && (
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Club Name
                </label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter club name"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800"
            >
              Create User
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
