import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import StudentDashboard from "./pages/student-dash";
import TeacherDashboard from "./pages/teacher-dash";
import OrganizerDashboard from "./pages/organizer-dash";
import AdminDashboard from "./pages/admin-dash";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("user"))?.user || null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; // Redirect to login
  };

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/student"
          element={
            currentUser
              ? <StudentDashboard currentUser={currentUser} handleLogout={handleLogout} />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/teacher"
          element={currentUser ? <TeacherDashboard handleLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/organizer"
          element={
            currentUser ? (
              <ErrorBoundary>
                <OrganizerDashboard currentUser={currentUser} handleLogout={handleLogout} />
              </ErrorBoundary>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin"
          element={currentUser ? <AdminDashboard handleLogout={handleLogout} /> : <Navigate to="/" />}
        />

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
