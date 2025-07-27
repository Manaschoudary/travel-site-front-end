
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
export async function login(email: string, password: string) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await res.json();
    setToken(data.access_token);
    return data;
  } catch (error) {
    console.error('Login request failed, using mock response:', error);
    
    // Mock successful login for demo
    if (email === 'demo@example.com' && password === 'password') {
      const mockToken = `mock_jwt_token_${Date.now()}`;
      setToken(mockToken);
      return { 
        access_token: mockToken, 
        user: { 
          email, 
          firstName: 'Demo', 
          lastName: 'User' 
        } 
      };
    } else {
      throw new Error('Invalid email or password');
    }
  }
}

interface UserDetails {
    firstName: string;
    lastName: string;
    country?: string;
}

export async function register(email: string, password: string, userDetails: UserDetails) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        email, 
        password, 
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        country: userDetails.country 
      }),
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await res.json();
    setToken(data.access_token);
    return data;
  } catch (error) {
    console.error('Registration request failed, using mock response:', error);
    
    // Mock successful registration for demo
    const mockToken = `mock_jwt_token_${Date.now()}`;
    setToken(mockToken);
    return { 
      access_token: mockToken, 
      user: { 
        email, 
        firstName: userDetails.firstName, 
        lastName: userDetails.lastName,
        country: userDetails.country 
      } 
    };
  }
}

export function logout() {
  removeToken();
}

// Social Authentication
export async function loginWithGoogle() {
  try {
    // In a real implementation, this would redirect to Google OAuth
    console.log('Google OAuth login initiated');
    
    // Mock successful Google login
    const mockToken = `google_mock_token_${Date.now()}`;
    setToken(mockToken);
    return {
      access_token: mockToken,
      user: {
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        provider: 'google'
      }
    };
  } catch (error) {
    throw new Error('Google authentication failed');
  }
}

export async function loginWithFacebook() {
  try {
    // In a real implementation, this would use Facebook SDK
    console.log('Facebook OAuth login initiated');
    
    // Mock successful Facebook login
    const mockToken = `facebook_mock_token_${Date.now()}`;
    setToken(mockToken);
    return {
      access_token: mockToken,
      user: {
        email: 'user@facebook.com',
        firstName: 'Facebook',
        lastName: 'User',
        provider: 'facebook'
      }
    };
  } catch (error) {
    throw new Error('Facebook authentication failed');
  }
}

export async function loginWithApple() {
  try {
    // In a real implementation, this would use Apple Sign In
    console.log('Apple Sign In initiated');
    
    // Mock successful Apple login
    const mockToken = `apple_mock_token_${Date.now()}`;
    setToken(mockToken);
    return {
      access_token: mockToken,
      user: {
        email: 'user@privaterelay.appleid.com',
        firstName: 'Apple',
        lastName: 'User',
        provider: 'apple'
      }
    };
  } catch (error) {
    throw new Error('Apple authentication failed');
  }
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
    const res = await fetch(`${API_URL}/chatbot/`, {
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
    console.error('Chat history request failed, using mock data:', error);
    
    // Return mock chat history for demonstration
    return [
      {
        id: '1',
        user_id: userId,
        request: 'Plan a 5-day romantic trip to Paris for my honeymoon',
        response: {
          summary: 'A perfect 5-day romantic honeymoon trip to Paris, featuring iconic landmarks, intimate dining experiences, and romantic walks along the Seine.',
          itinerary: [
            {
              city: 'Paris',
              activities: [
                'Morning: Arrive at Charles de Gaulle Airport, check into luxury hotel',
                'Afternoon: Stroll through Montmartre and visit Sacré-Cœur',
                'Evening: Romantic dinner at a traditional French bistro'
              ],
              accommodation: 'Le Meurice Hotel'
            },
            {
              city: 'Paris',
              activities: [
                'Morning: Visit the Eiffel Tower with skip-the-line tickets',
                'Afternoon: Seine River cruise with champagne',
                'Evening: Dinner at Michelin-starred restaurant'
              ],
              accommodation: 'Le Meurice Hotel'
            },
            {
              city: 'Paris',
              activities: [
                'Morning: Explore the Louvre Museum',
                'Afternoon: Walk through Luxembourg Gardens',
                'Evening: Show at Moulin Rouge'
              ],
              accommodation: 'Le Meurice Hotel'
            }
          ],
          booking_links: {
            booking: 'https://www.booking.com/searchresults.html?ss=Paris',
            skyscanner: 'https://www.skyscanner.com/flights-to/paris'
          },
          cities: ['Paris']
        },
        created_at: '2025-07-20T10:30:00Z'
      },
      {
        id: '2',
        user_id: userId,
        request: 'I want to explore Japan for 7 days, especially Tokyo and traditional culture',
        response: {
          summary: 'An immersive 7-day Japan adventure combining modern Tokyo experiences with traditional cultural activities.',
          itinerary: [
            {
              city: 'Tokyo',
              activities: [
                'Morning: Arrival at Narita Airport, check-in to ryokan',
                'Afternoon: Explore Asakusa and Senso-ji Temple',
                'Evening: Traditional kaiseki dinner'
              ],
              accommodation: 'Traditional Ryokan'
            },
            {
              city: 'Tokyo',
              activities: [
                'Morning: Visit Tsukiji Outer Market for sushi breakfast',
                'Afternoon: Explore Shibuya and Harajuku districts',
                'Evening: Experience Tokyo nightlife in Shinjuku'
              ],
              accommodation: 'Traditional Ryokan'
            },
            {
              city: 'Kyoto',
              activities: [
                'Morning: Day trip to Kyoto via bullet train',
                'Afternoon: Visit Fushimi Inari Shrine and bamboo grove',
                'Evening: Tea ceremony experience'
              ],
              accommodation: 'Traditional Ryokan'
            }
          ],
          booking_links: {
            booking: 'https://www.booking.com/searchresults.html?ss=Tokyo',
            skyscanner: 'https://www.skyscanner.com/flights-to/tokyo'
          },
          cities: ['Tokyo', 'Kyoto']
        },
        created_at: '2025-07-18T14:15:00Z'
      },
      {
        id: '3',
        user_id: userId,
        request: 'Budget-friendly 4-day trip to Barcelona with focus on architecture and food',
        response: {
          summary: 'A budget-friendly 4-day Barcelona adventure focusing on Gaudí architecture and authentic Spanish cuisine.',
          itinerary: [
            {
              city: 'Barcelona',
              activities: [
                'Morning: Arrive and check into budget hotel',
                'Afternoon: Free walking tour of Gothic Quarter',
                'Evening: Tapas crawl in El Born district'
              ],
              accommodation: 'Budget Hotel in City Center'
            },
            {
              city: 'Barcelona',
              activities: [
                'Morning: Visit Sagrada Família with audio guide',
                'Afternoon: Explore Park Güell',
                'Evening: Sunset at Bunkers del Carmel (free viewpoint)'
              ],
              accommodation: 'Budget Hotel in City Center'
            }
          ],
          booking_links: {
            booking: 'https://www.booking.com/searchresults.html?ss=Barcelona',
            skyscanner: 'https://www.skyscanner.com/flights-to/barcelona'
          },
          cities: ['Barcelona']
        },
        created_at: '2025-07-15T09:45:00Z'
      }
    ];
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
