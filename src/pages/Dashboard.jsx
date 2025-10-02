import { useEffect, useState } from "react";
import { getCertificatesAPI } from "../services/api";
import CertificateList from "../components/CertificateList";
import UploadForm from "../components/UploadForm";

export default function Dashboard({ user }) {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    getCertificatesAPI(user.id).then(setCertificates);
  }, [user.id]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} ({user.role})</h1>
      {user.role === "organizer" && <UploadForm />}
      <CertificateList certificates={certificates} />
    </div>
  );
}