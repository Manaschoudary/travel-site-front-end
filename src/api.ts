
// API Configuration
const API_URL = "http://127.0.0.1:8000";

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

// Check if user is authenticated
export function isAuthenticated(): boolean {
    return !!getToken();
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}


// Mock trip data
const mockTrips = [
    {
        id: '1',
        title: 'Paris Adventure',
        image: 'https://source.unsplash.com/800x600/?paris',
        date: 'Aug 15, 2025',
        duration: '7 days',
        description: 'Experience the magic of Paris with this week-long adventure. Visit iconic landmarks and enjoy authentic French cuisine.',
        details: 'Includes visits to the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. Luxury hotel accommodation included.',
        price: 2499,
        is_past: false
    },
    {
        id: '2',
        title: 'Tokyo Explorer',
        image: 'https://source.unsplash.com/800x600/?tokyo',
        date: 'Sep 1, 2025',
        duration: '10 days',
        description: 'Immerse yourself in Japanese culture with this comprehensive Tokyo tour. From traditional temples to modern technology.',
        details: 'Visit Senso-ji Temple, explore Akihabara, and experience a traditional tea ceremony.',
        price: 2999,
        is_past: false
    },
    {
        id: '3',
        title: 'Greek Islands Cruise',
        image: 'https://source.unsplash.com/800x600/?santorini',
        date: 'Jun 15, 2025',
        duration: '5 days',
        description: 'Sail through the beautiful Greek islands. Visit Santorini, Mykonos, and more.',
        details: 'All-inclusive cruise package with luxury accommodations and island excursions.',
        price: 1899,
        is_past: true
    }
];

// Auth
export async function login(username: string, password: string) {
    // Mock successful login
    const mockToken = 'mock_jwt_token';
    setToken(mockToken);
    return { access_token: mockToken, username };
}

interface UserDetails {
    firstName: string;
    lastName: string;
    country: string;
}

export async function register(username: string, password: string, userDetails: UserDetails) {
    // Mock successful registration
    const mockToken = 'mock_jwt_token';
    setToken(mockToken);
    return { access_token: mockToken, username, ...userDetails };
}

export function logout() {
  removeToken();
}

export async function listTrips() {
    // Use mock data for now
    return mockTrips;
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

// Chatbot with new API contract
export async function askChatbot(message: string, userId?: string) {
  const headers: HeadersInit = { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...authHeaders() 
  };
  
  try {
    const res = await fetch(`${API_URL}/chat/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        message,
        user_id: userId 
      }),
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Chatbot API error:', res.status, errorText);
      throw new Error(`Chatbot error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Chatbot request failed, using mock response:', error);
    
    // Enhanced mock response matching the API contract
    if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('itinerary') || message.toLowerCase().includes('trip')) {
      const destination = extractDestination(message) || 'Paris';
      const cities = [destination];
      
      return {
        summary: `A perfect 5-day cultural and adventure trip to ${destination}, combining iconic landmarks with authentic local experiences. This itinerary balances must-see attractions with hidden gems, offering both classic sightseeing and immersive cultural activities.`,
        itinerary: [
          {
            city: destination,
            activities: [
              "Morning: Arrival and hotel check-in",
              "Afternoon: Welcome walking tour of historic district", 
              "Evening: Traditional welcome dinner at local restaurant"
            ],
            accommodation: "City Center Boutique Hotel"
          },
          {
            city: destination,
            activities: [
              "Morning: Visit famous landmark with skip-the-line tickets",
              "Lunch: Authentic local cuisine at central market",
              "Afternoon: Guided museum tour with audio guide",
              "Evening: Sunset viewing from scenic overlook"
            ],
            accommodation: "City Center Boutique Hotel"
          },
          {
            city: destination,
            activities: [
              "Morning: Cultural district exploration and local neighborhood tour",
              "Afternoon: Traditional cooking class with local chef",
              "Evening: Artisan workshop visit and traditional performance"
            ],
            accommodation: "City Center Boutique Hotel"
          },
          {
            city: destination,
            activities: [
              "Morning: Day trip to nearby natural attraction or historic site",
              "Afternoon: Nature walk or historic exploration with scenic lunch",
              "Evening: Return to city and spa/wellness time"
            ],
            accommodation: "City Center Boutique Hotel"
          },
          {
            city: destination,
            activities: [
              "Morning: Last-minute shopping and souvenir hunting",
              "Afternoon: Farewell lunch at favorite discovered restaurant",
              "Evening: Departure preparations and airport transfer"
            ],
            accommodation: "Departure"
          }
        ],
        booking_links: {
          booking: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
          skyscanner: `https://www.skyscanner.com/flights-to/${destination.toLowerCase().replace(/\s+/g, '-')}`
        },
        cities: cities
      };
    }
    
    // Default travel advice response
    return {
      summary: "I'm here to help with your travel planning! I can create custom itineraries, provide travel tips, suggest accommodations, and help with booking recommendations for any destination worldwide.",
      itinerary: [],
      booking_links: {},
      cities: []
    };
  }
}

// Get chat history for a user
export async function getChatHistory(userId: string) {
  const headers: HeadersInit = { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...authHeaders() 
  };
  
  try {
    const res = await fetch(`${API_URL}/chat/history/${userId}`, {
      method: 'GET',
      headers,
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return []; // No history found
      }
      const errorText = await res.text();
      console.error('Chat history API error:', res.status, errorText);
      throw new Error(`Chat history error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Chat history request failed:', error);
    return []; // Return empty array on error
  }
}

// Helper function to extract destination from user message
function extractDestination(message: string): string | null {
  const destinations = [
    'Paris', 'London', 'Tokyo', 'New York', 'Barcelona', 'Rome', 'Amsterdam', 
    'Berlin', 'Vienna', 'Prague', 'Budapest', 'Istanbul', 'Athens', 'Lisbon',
    'Madrid', 'Venice', 'Florence', 'Milan', 'Zurich', 'Copenhagen', 'Stockholm',
    'Oslo', 'Helsinki', 'Reykjavik', 'Dublin', 'Edinburgh', 'Brussels', 'Luxembourg'
  ];
  
  const lowerMessage = message.toLowerCase();
  for (const dest of destinations) {
    if (lowerMessage.includes(dest.toLowerCase())) {
      return dest;
    }
  }
  return null;
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

// User Profile
export async function getCurrentUser() {
    // Mock user data
    return {
        username: 'demo_user',
        firstName: 'Demo',
        lastName: 'User',
        country: 'US'
    };
}

// Chat History
export async function getUserChatHistory() {
    // Mock empty chat history
    return [];
}

export async function getTopSearches() {
    // Mock top searches
    return ['Paris', 'Tokyo', 'Beach Vacation', 'Adventure'];
}

// Photo Gallery
const mockGallery = [
    {
        url: 'https://source.unsplash.com/800x600/?travel',
        title: 'Amazing Destinations'
    },
    {
        url: 'https://source.unsplash.com/800x600/?vacation',
        title: 'Vacation Memories'
    },
    {
        url: 'https://source.unsplash.com/800x600/?beach',
        title: 'Beach Paradise'
    }
];

export async function getPhotoGallery() {
    // Use mock data for now
    return mockGallery;
}
