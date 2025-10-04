import React, { useState, useEffect } from "react";
import { LogOut, BookOpen } from "lucide-react";

const TeacherDashboard = ({ currentUser, handleLogout }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/teacher/${currentUser.id}`);
        const data = await res.json();

        if (!data.success) throw new Error(data.error || "Failed to fetch data");

        // Merge students + certificates
        const studentsWithCerts = data.students.map((s) => ({
          ...s,
          certificates: data.certificates.filter((c) => c.student_id === s.id),
        }));

        setStudents(studentsWithCerts);
      } catch (err) {
        console.error("Error fetching teacher dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [currentUser.id]);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" /> Teacher Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-6">Students & Certificates</h2>

        {students.length === 0 ? (
          <p>No students found in your class.</p>
        ) : (
          <div className="space-y-6">
            {students.map((student) => (
              <div key={student.id} className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">
                  {student.name} (ID: {student.id})
                </h3>

                {student.certificates.length === 0 ? (
                  <p className="text-gray-500">No certificates issued yet.</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {student.certificates.map((cert) => (
                        <tr key={cert.id}>
                          <td className="px-6 py-4">{cert.event_name || "Event"}</td>
                          <td className="px-6 py-4">{cert.issue_date}</td>
                          <td className="px-6 py-4 text-center">
                            <a
                              href={cert.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
