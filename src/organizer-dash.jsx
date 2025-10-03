import React, { useState } from 'react';
import { LogOut, CalendarPlus, UploadCloud, FolderOpen } from 'lucide-react';

// --- MOCK DATA SIMULATION (Mirroring DB schema: Events Table) ---
const MOCK_ORGANIZERS = [
  { id: 'ORG001', name: 'Alumni Association' },
];

const initialMockEvents = [
  { event_id: 101, event_name: 'Annual Tech Fest 2025', organizer: 'Alumni Association', date: '2025-10-25', status: 'Certificates Pending', certs_uploaded: 0 },
  { event_id: 102, event_name: 'Placement Training Drive', organizer: 'Training Cell', date: '2025-09-01', status: 'Certificates Distributed', certs_uploaded: 150 },
  { event_id: 103, event_name: 'Python Workshop Series', organizer: 'Coding Society', date: '2025-08-15', status: 'Certificates Distributed', certs_uploaded: 85 },
];

// --- OrganizerDashboard Component ---
/**
 * Allows the Event Organizer to create new events and manage certificate distribution.
 * * @param {object} currentUser - Contains {id: string} of the organizer (e.g., 'ORG001').
 * @param {function} handleLogout - Callback function for logging out.
 */
const OrganizerDashboard = ({ currentUser = { id: 'ORG001' }, handleLogout = () => console.log('Mock Logout') }) => {
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'create'
  const [events, setEvents] = useState(initialMockEvents);
  const [newEvent, setNewEvent] = useState({ event_name: '', organizer: MOCK_ORGANIZERS.find(o => o.id === currentUser.id)?.name || '', date: '' });
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const organizer = MOCK_ORGANIZERS.find(o => o.id === currentUser.id);

  if (!organizer) return <div className="text-center p-8 text-red-600">Error: Organizer data not found for ID: {currentUser.id}.</div>;

  // --- Event Creation Logic ---
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.event_name || !newEvent.date) return;

    // Mock API call to create event
    const newId = Math.max(...events.map(e => e.event_id)) + 1;
    const event = {
      ...newEvent,
      event_id: newId,
      status: 'Certificates Pending',
      certs_uploaded: 0,
      organizer: organizer.name,
    };

    setEvents(prev => [...prev, event]);
    setSelectedEventId(newId); // Immediately select the new event for upload
    setActiveTab('create'); // Stay on the create tab to prompt upload
    setNewEvent({ event_name: '', organizer: organizer.name, date: '' });
  };

  // --- Certificate Upload Logic ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedEventId) {
      // Mock processing and distribution
      setUploadMessage(`Processing and distributing certificates from file: "${file.name}"...`);
      
      setTimeout(() => {
        // Mock success with 50 certificates distributed
        setUploadMessage(`✅ Successfully uploaded and distributed 50 certificates for Event ID ${selectedEventId}!`);
        
        // Update the event status in the mock array
        setEvents(prev => prev.map(evt => 
          evt.event_id === selectedEventId 
            ? { ...evt, status: 'Certificates Distributed', certs_uploaded: 50 }
            : evt
        ));
        
        setSelectedEventId(null); // Clear selection
      }, 2500); // Simulate processing time
    } else {
      setUploadMessage('Please select a file to upload.');
    }
  };

  // --- UI RENDER FUNCTIONS ---

  const renderManageEvents = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
        <FolderOpen className="w-5 h-5 mr-2" /> ALL MANAGED EVENTS
      </h3>
      <div className="bg-white overflow-hidden shadow-lg rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Certs</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.event_id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.event_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.event_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status.includes('Distributed') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{event.certs_uploaded}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => { setSelectedEventId(event.event_id); setActiveTab('create'); setUploadMessage(''); }}
                      disabled={event.status.includes('Distributed')}
                      className={`inline-flex items-center px-3 py-1 text-sm rounded-md shadow-sm transition duration-150 ${
                        event.status.includes('Distributed')
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                      title={event.status.includes('Distributed') ? 'Certificates already distributed' : 'Upload Certificates'}
                    >
                      <UploadCloud className="w-4 h-4 mr-1" />
                      {event.status.includes('Distributed') ? 'Completed' : 'Upload'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCreateAndUpload = () => {
    const eventToUpload = events.find(e => e.event_id === selectedEventId);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- 1. Create New Event Form --- */}
        <div className="bg-white p-8 shadow-lg rounded-xl h-fit">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center mb-6 border-b pb-3">
            <CalendarPlus className="w-5 h-5 mr-2" /> CREATE NEW EVENT
          </h3>
          <form className="space-y-6" onSubmit={handleCreateEvent}>
            
            <div>
              <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                id="event_name"
                type="text"
                required
                value={newEvent.event_name}
                onChange={(e) => setNewEvent({...newEvent, event_name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                placeholder="e.g., Annual Sports Day 2026"
              />
            </div>

            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer (Read-only)</label>
              <input
                id="organizer"
                type="text"
                readOnly
                value={organizer.name}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm p-2 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                id="date"
                type="date"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              CREATE EVENT
            </button>
          </form>
        </div>

        {/* --- 2. Certificate Upload/Distribution Area --- */}
        <div className="bg-white p-8 shadow-lg rounded-xl h-fit">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center mb-6 border-b pb-3">
            <UploadCloud className="w-5 h-5 mr-2" /> UPLOAD  CERTIFICATES
          </h3>

          {/* Conditional Upload Box */}
          {eventToUpload ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg text-sm text-indigo-700">
                <p>Ready to upload certificates for:</p>
                <p className="font-bold">{eventToUpload.event_name} (ID: {eventToUpload.event_id})</p>
                <p className="text-xs mt-1">Files should be named according to student IDs (e.g., STU001.pdf)</p>
              </div>

              {/* File Input */}
              <label className="block">
                <span className="sr-only">Choose certificate file</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".zip,.pdf,.csv"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-indigo-700 hover:file:bg-violet-100"
                />
              </label>

              {/* Processing Message */}
              {uploadMessage && (
                <div className={`p-3 text-sm rounded-lg ${
                  uploadMessage.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {uploadMessage}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 bg-gray-50 rounded-xl shadow-inner text-gray-600">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-center font-medium">
                Select an event from the **Manage Events** tab, or create a new event to begin the certificate distribution process.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header Bar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center">
            <CalendarPlus className="w-6 h-6 mr-2" />
            ORGANIZER DASHBOARD
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
        {/* Organizer Info (Removed Welcome section) */}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-2 px-1 text-sm font-medium transition duration-150 border-b-2 ${
                activeTab === 'manage'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Events
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 text-sm font-medium transition duration-150 border-b-2 ${
                activeTab === 'create'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Event & Upload
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'manage' && renderManageEvents()}
        {activeTab === 'create' && renderCreateAndUpload()}

      </main>
    </div>
  );
};

export default OrganizerDashboard;