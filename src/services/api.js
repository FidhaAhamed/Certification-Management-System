const API = "http://localhost:5000/api";

export async function loginAPI(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
  return await res.json();
}

export async function getCertificatesAPI(userId) {
  const res = await fetch(`${API}/certificates/${userId}`);
  return await res.json();
}

export async function uploadCertificateAPI(data) {
  const res = await fetch(`${API}/certificates/upload`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function registerAPI(data) {
  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}