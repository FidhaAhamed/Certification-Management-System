import React, { useEffect, useState } from "react";
import { Download, LogOut, BookOpen } from "lucide-react";

const StudentDashboard = ({ currentUser, handleLogout }) => {
  const [student, setStudent] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

console.log("currentUser in StudentDashboard:", currentUser);

  useEffect(() => {
  const id = currentUser?.id || currentUser?.student_id; // Support both
  if (!id) return;

  const fetchData = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/student/${id}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to fetch data");
      } else {
        setStudent(data.student);
        setCertificates(data.certificates);
      }
    } catch (err) {
      setError("Server error while fetching student data.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [currentUser]);

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!student) return <div className="text-center p-8 text-red-600">No student data found</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            STUDENT CERTIFICATE PORTAL
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-red-700 py-2 px-4 rounded-lg transition"
          >
            <LogOut className="w-4 h-4 mr-1" /> LOG OUT
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        {/* Student Info */}
        <div className="bg-white shadow-lg rounded-xl mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-2">Welcome, {student.name}</h2>
          <p className="text-gray-600">ID: {student.student_id}</p>
          <p className="text-gray-600">Department: {student.dept}</p>
        </div>

        {/* Certificates */}
        <h3 className="text-xl font-bold mb-4">Your Certificates</h3>
        <div className="bg-white shadow rounded-xl overflow-hidden">
          {certificates.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((cert) => (
                  <tr key={cert.id}>
                    <td className="px-6 py-4">{cert.event_name || "Event"}</td>
                    <td className="px-6 py-4">{cert.issue_date}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDownload(cert.file_url)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-1 inline" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-gray-500 text-center">No certificates found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
