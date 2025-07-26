const API_URL = "http://localhost:8000"; // Change to your FastAPI backend URL

// JWT token storage helpers
function getToken() {
  return localStorage.getItem('token');
}
function setToken(token: string) {
  localStorage.setItem('token', token);
}
function removeToken() {
  localStorage.removeItem('token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


// Auth
export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function register(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export function logout() {
  removeToken();
}

export async function getTrip(id: string) {
  const headers = authHeaders();
  const res = await fetch(`${API_URL}/trips/${id}`, headers ? { headers } : undefined);
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
}

export async function createTrip(trip: any) {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...authHeaders() };
  const res = await fetch(`${API_URL}/trips/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(trip)
  });
  if (!res.ok) throw new Error('Failed to create trip');
  return res.json();
}

export async function updateTrip(id: string, trip: any) {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...authHeaders() };
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(trip)
  });
  if (!res.ok) throw new Error('Failed to update trip');
  return res.json();
}

export async function deleteTrip(id: string) {
  const headers = authHeaders();
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: 'DELETE',
    headers: headers || undefined
  });
  if (!res.ok) throw new Error('Failed to delete trip');
  return res.json();
}

// Enquiries
export async function createEnquiry(enquiry: any) {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...authHeaders() };
  const res = await fetch(`${API_URL}/enquiries/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(enquiry)
  });
  if (!res.ok) throw new Error('Failed to submit enquiry');
  return res.json();
}

// Chatbot
export async function askChatbot(message: string) {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...authHeaders() };
  const res = await fetch(`${API_URL}/chatbot/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Chatbot error');
  return res.json();
}

// PDF Download
export async function downloadTripPDF(id: string) {
  const headers = authHeaders();
  const res = await fetch(`${API_URL}/trips/${id}/pdf`, headers ? { headers } : undefined);
  if (!res.ok) throw new Error('Failed to download PDF');
  const blob = await res.blob();
  // Download logic for browser
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trip_${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
