import { useState } from "react";
import { uploadCertificateAPI } from "../services/api";

export default function UploadForm() {
  const [eventId, setEventId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    await uploadCertificateAPI({ event_id: eventId, student_id: studentId, file_url: fileUrl });
    alert("Certificate uploaded!");
  };

  return (
    <form onSubmit={handleUpload} className="mb-4">
      <h2 className="text-lg font-bold mb-2">Upload Certificate</h2>
      <input className="border p-2 mb-2 mr-2" placeholder="Event ID" value={eventId} onChange={e => setEventId(e.target.value)} />
      <input className="border p-2 mb-2 mr-2" placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
      <input className="border p-2 mb-2 mr-2" placeholder="File URL" value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2 rounded">Upload</button>
    </form>
  );
}