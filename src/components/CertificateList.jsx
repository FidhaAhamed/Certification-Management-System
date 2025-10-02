export default function CertificateList({ certificates }) {
  return (
    <div>
      <h2 className="text-xl mb-2">Your Certificates</h2>
      <ul>
        {certificates.map(cert => (
          <li key={cert.id} className="mb-2 border p-2 flex justify-between">
            <span>Event: {cert.event_id}</span>
            <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}