import React, { useState } from 'react';
import { LogOut, Monitor, UserCheck, Download } from 'lucide-react';

// --- MOCK DATA SIMULATION (Mirroring DB schema: Teachers, Students, Certificates) ---

const MOCK_TEACHERS = [
  // Mock Advisor FAC001 is linked to the CSE department (matching STU001 and STU002)
  { id: 'FAC001', name: 'Dr. John Mathew', dept: 'CSE', class: null },
];

const MOCK_STUDENTS = [
  { id: 'STU001', name: 'Anusree K Jinan', class: 'S4', dept: 'CSE' },
  { id: 'STU002', name: 'Joann J Koodathil', class: 'S4', dept: 'CSE' },
  { id: 'STU003', name: 'Benny T George', class: 'S4', dept: 'ECE' }, // ECE student for filtering test
];

const MOCK_CERTIFICATES = [
  { cert_id: 1, student_id: 'STU001', event_name: 'Web Dev Workshop 2025', organizer: 'Tech Club', date: '2025-07-15', file_url: 'https://placehold.co/1200x800/22c55e/ffffff?text=CERTIFICATE_A' },
  { cert_id: 2, student_id: 'STU001', event_name: 'Cloud Computing Seminar', organizer: 'Dept of CSE', date: '2025-09-01', file_url: 'https://placehold.co/1200x800/1d4ed8/ffffff?text=CERTIFICATE_B' },
  { cert_id: 3, student_id: 'STU002', event_name: 'Python Programming Contest', organizer: 'Coding Society', date: '2024-11-20', file_url: 'https://placehold.co/1200x800/f59e0b/ffffff?text=CERTIFICATE_C' },
  { cert_id: 4, student_id: 'STU003', event_name: 'AI/ML Bootcamp', organizer: 'Innovate Group', date: '2025-08-10', file_url: 'https://placehold.co/1200x800/be185d/ffffff?text=CERTIFICATE_D' },
];

// --- AdvisorDashboard Component ---
/**
 * Allows the Faculty Advisor to select a student and view their certificates.
 * * @param {object} currentUser - Contains {id: string} of the advisor (e.g., 'FAC001').
 * @param {function} handleLogout - Callback function for logging out.
 */
const AdvisorDashboard = ({ currentUser = { id: 'FAC001' }, handleLogout = () => console.log('Mock Logout') }) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Find the current advisor's data
  const advisor = MOCK_TEACHERS.find(t => t.id === currentUser.id);

  // Filter students relevant to this advisor's department (CSE)
  const studentsToTrack = MOCK_STUDENTS.filter(s => s.dept === advisor?.dept);
  
  // Get data for the currently selected student
  const selectedStudent = studentsToTrack.find(s => s.id === selectedStudentId);
  const selectedStudentCerts = MOCK_CERTIFICATES.filter(c => c.student_id === selectedStudentId);

  if (!advisor) return <div className="text-center p-8 text-red-600">Error: Advisor data not found for ID: {currentUser.id}.</div>;

  const handleDownload = (fileUrl, eventName) => {
    console.log(`Advisor viewing/downloading certificate for: ${eventName}`);
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header Bar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700 flex items-center">
            <Monitor className="w-6 h-6 mr-2" />
            FACULTY ADVISOR PORTAL
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
        {/* Advisor Information Card and Student Selector */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl mb-8 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1">
             <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome, {advisor.name}</h2>
             <p className="text-sm text-gray-600">Department: <span className="font-medium">{advisor.dept}</span></p>
          </div>
          
          {/* Student Selector Dropdown */}
          <div className="md:col-span-2 flex items-center space-x-4">
            <label htmlFor="student-select" className="text-gray-700 font-medium whitespace-nowrap">
              Select Student to Track:
            </label>
            <select
              id="student-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
            >
              <option value="" disabled>--- Choose a Student ({studentsToTrack.length}) ---</option>
              {studentsToTrack.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.class}, {student.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Certificate Tracking Area */}
        {selectedStudent ? (
          <div>
            <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="w-6 h-6 text-blue-600"/>
                <h3 className="text-xl font-bold text-gray-800">
                    Certificates for {selectedStudent.name}
                </h3>
            </div>
            
            {/* Student Info Bar (for clarity) */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg text-sm text-blue-700">
                Tracking: <span className="font-semibold">{selectedStudent.name}</span> | 
                Class: {selectedStudent.class} | 
                Total Certificates: {selectedStudentCerts.length}
            </div>

            {/* Certificates Table (Reusing Student Dashboard structure) */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedStudentCerts.length > 0 ? (
                      selectedStudentCerts.map((cert) => (
                        <tr key={cert.cert_id} className="hover:bg-blue-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.event_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.organizer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => handleDownload(cert.file_url, cert.event_name)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                              title="View & Download Certificate"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500 text-lg">
                          This student has no certificates in the system yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Initial State/No Student Selected */
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300">
            <UserCheck className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 font-medium">
              Please select a student from the dropdown above to view their achievements.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdvisorDashboard;