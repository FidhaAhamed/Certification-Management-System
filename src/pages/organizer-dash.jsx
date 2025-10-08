import React, { useState, useEffect } from "react";
import { LogOut, UploadCloud, CalendarPlus } from "lucide-react";

const OrganizerDashboard = ({ currentUser, handleLogout }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  // Fetch organizer events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/events?organizer_id=${currentUser.organizer_id}`
        );
        const data = await res.json();
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [currentUser.organizer_id]);

  // Handle PDF upload
  const handleFileUpload = async (e) => {
  const files = e.target.files;
  if (!files.length || !selectedEventId) {
    setUploadMessage("Select files and an event first.");
    return;
  }

  const formData = new FormData();
  let allValid = true;

  // Loop through files and validate filename
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = file.name.split(".")[0];
    const parts = filename.split("_");
    if (parts.length < 2) {
      setUploadMessage(
        `Filename "${file.name}" must be in format: studentId_classId_anything.pdf`
      );
      allValid = false;
      break;
    }
    formData.append("files", file); // append each file
  }

  if (!allValid) return;

  formData.append("event_id", selectedEventId);
  formData.append("organizer_id", currentUser.organizer_id);

  setUploadMessage(`Uploading ${files.length} file(s)...`);

  try {
    const res = await fetch(
      "http://localhost:5000/api/upload-certificate",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();

    if (res.ok && result.success) {
      setUploadMessage(
        `✅ Successfully uploaded ${result.files.length} file(s).`
      );
      setSelectedEventId(null);
    } else {
      setUploadMessage(`❌ Error uploading certificates: ${result.message}`);
    }
  } catch (err) {
    console.error(err);
    setUploadMessage("❌ Server error during upload.");
  }

  
};

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700 flex items-center">
          <CalendarPlus className="w-6 h-6 mr-2" />
          Organizer Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Event Table */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Managed Events
          </h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr
                  key={event.event_id}
                  className="hover:bg-indigo-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.event_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.event_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => setSelectedEventId(event.event_id)}
                      className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      <UploadCloud className="w-4 h-4 mr-1" /> Upload Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* File Upload Section */}
        {/* File Upload Section */}
{selectedEventId && (
  <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
    <h3 className="text-xl font-bold mb-2">
      Upload Certificates for Event ID: {selectedEventId}
    </h3>
    <input
      type="file"
      accept=".pdf"
      multiple // <-- allow multiple selection
      onChange={handleFileUpload}
      className="mb-4"
    />
    {uploadMessage && <p>{uploadMessage}</p>}
  </div>
)}

      </main>
    </div>
  );
};

export default OrganizerDashboard; 