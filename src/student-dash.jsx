import React from 'react';
import { Download, LogOut, BookOpen } from 'lucide-react';

// --- MOCK DATA SIMULATION (Essential for standalone functionality) ---
const MOCK_STUDENTS = [
  { id: 'STU001', name: 'Anusree K Jinan', class: 'S4', dept: 'CSE' },
  { id: 'STU002', name: 'Joann J Koodathil', class: 'S4', dept: 'CSE' },
];

const MOCK_CERTIFICATES = [
  { cert_id: 1, student_id: 'STU001', event_name: 'Web Dev Workshop 2025', organizer: 'Tech Club', date: '2025-07-15', file_url: 'https://placehold.co/1200x800/22c55e/ffffff?text=CERTIFICATE' },
  { cert_id: 2, student_id: 'STU001', event_name: 'Cloud Computing Seminar', organizer: 'Dept of CSE', date: '2025-09-01', file_url: 'https://placehold.co/1200x800/1d4ed8/ffffff?text=CERTIFICATE' },
  { cert_id: 3, student_id: 'STU001', event_name: 'Python Programming Contest', organizer: 'Coding Society', date: '2024-11-20', file_url: 'https://placehold.co/1200x800/f59e0b/ffffff?text=CERTIFICATE' },
  { cert_id: 4, student_id: 'STU002', event_name: 'AI/ML Bootcamp', organizer: 'Innovate Group', date: '2025-08-10', file_url: 'https://placehold.co/1200x800/be185d/ffffff?text=CERTIFICATE' },
];

// --- StudentDashboard Component ---
/**
 * Displays the student's details and a list of their issued certificates.
 * * @param {object} currentUser - Contains {id: string} of the currently logged-in student.
 * @param {function} handleLogout - Callback function for logging out.
 */
const StudentDashboard = ({ currentUser = { id: 'STU001' }, handleLogout = () => console.log('Mock Logout') }) => {
  // Use mock data for the specified ID for standalone testing
  const student = MOCK_STUDENTS.find(s => s.id === currentUser.id);
  const studentCerts = MOCK_CERTIFICATES.filter(c => c.student_id === currentUser.id);

  if (!student) return <div className="text-center p-8 text-red-600">Error: Student data not found for ID: {currentUser.id}.</div>;

  const handleDownload = (fileUrl, eventName) => {
    console.log(`Attempting to view/download certificate for: ${eventName}`);
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header Bar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            STUDENT CERTIFICATE PORTAL
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-red-700 py-2 px-4 rounded-lg transition duration-150 shadow-md"
          >
            <LogOut className="w-4 h-4 mr-1" /> LOG OUT
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Student Information Card */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl mb-8 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome, {student.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <p><span className="font-medium text-gray-700">ID:</span> {student.id}</p>
            <p><span className="font-medium text-gray-700">Class:</span> {student.class}</p>
            <p><span className="font-medium text-gray-700">Department:</span> {student.dept}</p>
            <p><span className="font-medium text-gray-700">Certificates:</span> {studentCerts.length}</p>
          </div>
        </div>

        {/* Certificates Table */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">YOUR CERTIFICATES</h3>
        <div className="bg-white overflow-hidden shadow-lg rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organizer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentCerts.length > 0 ? (
                  studentCerts.map((cert) => (
                    <tr key={cert.cert_id} className="hover:bg-indigo-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cert.event_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.organizer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleDownload(cert.file_url, cert.event_name)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                          title="View & Download Certificate"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 text-lg">
                      No certificates have been issued to you yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
