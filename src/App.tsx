import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import TripCard, { Trip } from './components/TripCard';
import Chatbot from './components/Chatbot';
import EnquiryForm from './components/EnquiryForm';
import Gallery from './components/Gallery';
import { listTrips } from './api';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const App: React.FC = () => {
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [pastTrips, setPastTrips] = useState<Trip[]>([]);
    const [futureTrips, setFutureTrips] = useState<Trip[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const pastTripsRef = useRef<HTMLDivElement>(null);
    const futureTripsRef = useRef<HTMLDivElement>(null);
    const [showPastArrows, setShowPastArrows] = useState(false);
    const [showFutureArrows, setShowFutureArrows] = useState(false);

    // Fetch trips from backend
    useEffect(() => {
        async function fetchTrips() {
            try {
                const trips = await listTrips();
                setPastTrips(trips.filter((t: any) => t.is_past));
                setFutureTrips(trips.filter((t: any) => !t.is_past));
            } catch (err) {
                setPastTrips([]);
                setFutureTrips([]);
            }
        }
        fetchTrips();
    }, []);

    useEffect(() => {
        const checkScroll = (ref: React.RefObject<HTMLDivElement>, setShow: React.Dispatch<React.SetStateAction<boolean>>) => {
            if (ref.current) {
                setShow(ref.current.scrollWidth > ref.current.clientWidth);
            }
        };
        checkScroll(pastTripsRef, setShowPastArrows);
        checkScroll(futureTripsRef, setShowFutureArrows);
        window.addEventListener('resize', () => {
            checkScroll(pastTripsRef, setShowPastArrows);
            checkScroll(futureTripsRef, setShowFutureArrows);
        });
        return () => {
            window.removeEventListener('resize', () => {
                checkScroll(pastTripsRef, setShowPastArrows);
                checkScroll(futureTripsRef, setShowFutureArrows);
            });
        };
    }, [pastTrips.length, futureTrips.length, searchTerm]);

    const scrollList = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = ref.current.clientWidth * 0.8;
            ref.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const handleTripClick = (trip: Trip) => setSelectedTrip(trip);
    const handleCloseModal = () => setSelectedTrip(null);
    const handleDownloadPDF = () => {
        alert('Download PDF for ' + selectedTrip?.title);
    };
    const handleToggleTheme = () => setDarkMode((prev) => !prev);

    // Filter trips based on search term only
    const filterTrips = (trips: Trip[]) => {
        return trips.filter(trip => {
            const matchesSearch = !searchTerm || 
                trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (trip.details && trip.details.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesSearch;
        });
    };

    const filteredPastTrips = filterTrips(pastTrips);
    const filteredFutureTrips = filterTrips(futureTrips);

    const clearFilters = () => {
        setSearchTerm('');
    };

    return (
        <Router>
            <div className={`min-vh-100 d-flex flex-column ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
                {/* Modern Navbar */}
                <nav className={`navbar navbar-expand-lg sticky-top ${darkMode ? 'navbar-dark' : 'navbar-light'}`} 
                     style={{ backgroundColor: darkMode ? '#1a1a1a' : '#ffffff', borderBottom: `1px solid ${darkMode ? '#333' : '#e0e0e0'}` }}> 
                    <div className="container">
                        <Link className="navbar-brand fw-bold fs-3" to="/" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
                            TravelMate
                        </Link>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                            aria-controls="navbarNav" 
                            aria-expanded={isNavbarOpen}
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarNav">
                            <ul className="navbar-nav ms-auto align-items-center">
                                <li className="nav-item">
                                    <a 
                                        className="nav-link" 
                                        href="#trips" 
                                        style={{ fontWeight: '500' }}
                                        onClick={() => setIsNavbarOpen(false)}
                                    >
                                        Trips
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a 
                                        className="nav-link" 
                                        href="#gallery" 
                                        style={{ fontWeight: '500' }}
                                        onClick={() => setIsNavbarOpen(false)}
                                    >
                                        Gallery
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a 
                                        className="nav-link" 
                                        href="#contact" 
                                        style={{ fontWeight: '500' }}
                                        onClick={() => setIsNavbarOpen(false)}
                                    >
                                        Contact
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link" 
                                        style={{ fontWeight: '500', background: 'none', border: 'none' }}
                                        onClick={() => {
                                            setIsNavbarOpen(false);
                                            setShowAuthModal(true);
                                        }}
                                    >
                                        Login
                                    </button>
                                </li>
                                <li className="nav-item ms-3">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="themeSwitch" checked={darkMode} onChange={handleToggleTheme} />
                                        <label className="form-check-label" htmlFor="themeSwitch" style={{ fontSize: '0.9rem' }}>
                                            {darkMode ? '🌙' : '☀️'}
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={
                        <>
                            {/* Hero Section */}
                            <section className={`text-center py-5 ${darkMode ? 'bg-dark' : 'bg-light'}`} style={{ minHeight: '100vh', position: 'relative' }}>
                                <div className="container">
                                    <div className="row align-items-center" style={{ minHeight: '80vh' }}>
                                        <div className="col-lg-6 mb-4 mb-lg-0">
                                            <div className="mb-4">
                                                <img 
                                                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                                                    alt="Travel Expert" 
                                                    className="rounded-circle mb-4" 
                                                    style={{ width: '200px', height: '200px', objectFit: 'cover', border: `4px solid ${darkMode ? '#00d4aa' : '#007bff'}` }}
                                                />
                                            </div>
                                            <h1 className="display-4 fw-bold mb-3" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
                                                Your Travel Expert
                                            </h1>
                                            <p className="lead mb-4" style={{ fontSize: '1.3rem', lineHeight: '1.6' }}>
                                                Discover amazing destinations, plan unforgettable journeys, and create memories that last a lifetime. 
                                                Let us help you explore the world.
                                            </p>
                                            <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
                                                <span className={`badge fs-6 px-3 py-2 ${darkMode ? 'bg-secondary' : 'bg-primary'}`}>
                                                    ✈️ Adventure Travel
                                                </span>
                                                <span className={`badge fs-6 px-3 py-2 ${darkMode ? 'bg-secondary' : 'bg-primary'}`}>
                                                    🏖️ Beach Holidays
                                                </span>
                                                <span className={`badge fs-6 px-3 py-2 ${darkMode ? 'bg-secondary' : 'bg-primary'}`}>
                                                    🏔️ Mountain Treks
                                                </span>
                                                <span className={`badge fs-6 px-3 py-2 ${darkMode ? 'bg-secondary' : 'bg-primary'}`}>
                                                    🏛️ Cultural Tours
                                                </span>
                                            </div>
                                            <div className="d-flex gap-3 justify-content-center flex-column flex-sm-row mb-4">
                                                <a href="#trips" className={`btn btn-lg px-4 ${darkMode ? 'btn-outline-light' : 'btn-primary'}`}>
                                                    Explore Trips
                                                </a>
                                                <a href="#contact" className={`btn btn-lg px-4 ${darkMode ? 'btn-light text-dark' : 'btn-outline-primary'}`}>
                                                    Get in Touch
                                                </a>
                                            </div>

                                            {/* Chat Feature Card */}
                                            <div className={`card border-0 shadow-lg mt-4 ${darkMode ? 'bg-dark border-secondary' : 'bg-white'}`} 
                                                 style={{ background: darkMode ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
                                                <div className="card-body p-4">
                                                    <div className="row align-items-center">
                                                        <div className="col-auto">
                                                            <div className="chat-preview-icon" 
                                                                 style={{ 
                                                                     fontSize: '2.5rem', 
                                                                     width: '70px', 
                                                                     height: '70px', 
                                                                     borderRadius: '50%', 
                                                                     background: darkMode ? 'linear-gradient(135deg, #00d4aa 0%, #0056b3 100%)' : 'linear-gradient(135deg, #007bff 0%, #00d4aa 100%)',
                                                                     display: 'flex', 
                                                                     alignItems: 'center', 
                                                                     justifyContent: 'center',
                                                                     color: 'white'
                                                                 }}>
                                                                🤖
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <h5 className="mb-2" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
                                                                AI Travel Assistant
                                                            </h5>
                                                            <p className="mb-2 text-muted">
                                                                Get instant travel advice, recommendations, and personalized itineraries
                                                            </p>
                                                            <button 
                                                                className={`btn ${darkMode ? 'btn-outline-light' : 'btn-primary'} btn-sm`}
                                                                onClick={() => {
                                                                    const chatbot = document.querySelector('.chatbot-button') as HTMLElement;
                                                                    if (chatbot) {
                                                                        chatbot.click();
                                                                    }
                                                                }}
                                                            >
                                                                Start Chatting
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="position-relative">
                                                <img 
                                                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                                                    alt="Beautiful Travel Destination" 
                                                    className="img-fluid rounded-4 shadow-lg"
                                                    style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                                                />
                                                <div className={`position-absolute bottom-0 start-0 p-4 m-3 rounded-3 ${darkMode ? 'bg-dark bg-opacity-75' : 'bg-light bg-opacity-75'}`}>
                                                    <h5 className="mb-1">📍 Discover New Places</h5>
                                                    <p className="mb-0 small">Over 100+ destinations worldwide</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Trips Section */}
                            <section id="trips" className={`py-5 ${darkMode ? 'bg-darker' : 'bg-white'}`}>
                                <div className="container">
                                    {/* Section Header */}
                                    <div className="text-center mb-5">
                                        <h2 className="display-5 fw-bold mb-3" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
                                            Featured Trips
                                        </h2>
                                        <p className="lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                            Explore our curated collection of amazing travel experiences
                                        </p>
                                    </div>

                                    {/* Search Filter */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className={`card filter-card border-0 ${darkMode ? 'bg-dark border-secondary' : 'bg-light'}`}>
                                                <div className="card-body">
                                                    <div className="row g-3">
                                                        <div className="col-12">
                                                            <label className="form-label">Search Trips</label>
                                                            <input 
                                                                className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                                                                type="text" 
                                                                placeholder="Search destinations..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters Display */}
                                    {searchTerm && (
                                        <div className="mb-4">
                                            <div className={`alert ${darkMode ? 'alert-secondary' : 'alert-light'} d-flex flex-wrap align-items-center gap-2`}>
                                                <span className="fw-bold me-2">Active Filters:</span>
                                                <span className="badge bg-primary">Search: {searchTerm}</span>
                                                <span className="badge bg-secondary">
                                                    {filteredPastTrips.length + filteredFutureTrips.length} trips found
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Trip Cards Grid */}
                                    <div className="row">
                                        {/* Past Trips */}
                                        <div className="col-12 mb-5">
                                            <h3 className="mb-4">Past Adventures</h3>
                                            <div className="row">
                                                {filteredPastTrips.map(trip => (
                                                    <div className="col-lg-4 col-md-6 mb-4" key={trip.id}>
                                                        <TripCard trip={trip} onClick={handleTripClick} darkMode={darkMode} />
                                                    </div>
                                                ))}
                                                {filteredPastTrips.length === 0 && (
                                                    <div className="col-12 text-center py-4">
                                                        <p className="text-muted">No past trips found matching your criteria.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Future Trips */}
                                        <div className="col-12 mb-5">
                                            <h3 className="mb-4">Upcoming Journeys</h3>
                                            <div className="row">
                                                {filteredFutureTrips.map(trip => (
                                                    <div className="col-lg-4 col-md-6 mb-4" key={trip.id}>
                                                        <TripCard trip={trip} onClick={handleTripClick} darkMode={darkMode} />
                                                    </div>
                                                ))}
                                                {filteredFutureTrips.length === 0 && (
                                                    <div className="col-12 text-center py-4">
                                                        <p className="text-muted">No future trips found matching your criteria.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Gallery Section */}
                            <Gallery darkMode={darkMode} />

                            {/* Contact Section */}
                            <section id="contact" className={`py-5 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
                                <div className="container">
                                    <div className="text-center mb-5">
                                        <h2 className="display-5 fw-bold mb-3" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
                                            Get In Touch
                                        </h2>
                                        <p className="lead">Ready to plan your next adventure? Let's make it happen!</p>
                                    </div>

                                    {/* Smart Trip Planning CTA */}
                                    <div className="row mb-5">
                                        <div className="col-12">
                                            <div className={`ai-planning-prompt p-4 rounded-4 ${darkMode ? 'bg-dark border-secondary' : 'bg-light border-light'}`} 
                                                 style={{ border: '2px solid', background: darkMode ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                                <div className="row align-items-center">
                                                    <div className="col-auto">
                                                        <div className="chat-icon-large text-center" 
                                                             style={{ fontSize: '3rem', width: '80px', height: '80px', 
                                                                      borderRadius: '50%', 
                                                                      background: darkMode ? 'linear-gradient(135deg, #00d4aa 0%, #0056b3 100%)' : 'linear-gradient(135deg, #007bff 0%, #00d4aa 100%)',
                                                                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            🧳
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <h4 className="mb-2" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
                                                            Need a Custom Itinerary?
                                                        </h4>
                                                        <p className="mb-0 text-muted">
                                                            Our AI can create personalized travel plans in seconds. 
                                                            Get recommendations for destinations, activities, budget planning, and more!
                                                        </p>
                                                    </div>
                                                    <div className="col-auto">
                                                        <button 
                                                            className={`btn btn-lg px-4 ${darkMode ? 'btn-outline-light' : 'btn-primary'}`}
                                                            onClick={() => {
                                                                const chatbot = document.querySelector('.chatbot-button') as HTMLElement;
                                                                if (chatbot) {
                                                                    chatbot.click();
                                                                } else {
                                                                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                                                }
                                                            }}
                                                            style={{ borderRadius: '50px', minWidth: '140px' }}
                                                        >
                                                            🤖 Chat Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <EnquiryForm darkMode={darkMode} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Chatbot and Trip Modal */}
                            <Chatbot darkMode={darkMode} />

                            {/* Floating Chat Preview */}
                            <div className={`floating-chat-preview position-fixed ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
                                 style={{
                                     bottom: '100px',
                                     right: '20px',
                                     width: '300px',
                                     borderRadius: '15px',
                                     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                                     zIndex: 1030,
                                     border: `1px solid ${darkMode ? '#4a5568' : '#e9ecef'}`,
                                     opacity: 0.9,
                                     transition: 'all 0.3s ease'
                                 }}
                                 onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                 onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}>
                                <div className="p-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="me-2" style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: darkMode ? 'linear-gradient(135deg, #00d4aa 0%, #0056b3 100%)' : 'linear-gradient(135deg, #007bff 0%, #00d4aa 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem'
                                        }}>
                                            🤖
                                        </div>
                                        <div>
                                            <h6 className="mb-0" style={{ fontSize: '0.9rem' }}>Travel Assistant</h6>
                                            <small className="text-success d-flex align-items-center">
                                                <span className="me-1" style={{ 
                                                    width: '8px', 
                                                    height: '8px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: '#28a745',
                                                    display: 'inline-block',
                                                    animation: 'pulse 2s infinite'
                                                }}></span>
                                                Online
                                            </small>
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded ${darkMode ? 'bg-secondary' : 'bg-light'}`} style={{ fontSize: '0.85rem' }}>
                                        "Hi! I'm here to help you plan your perfect trip. Ask me about destinations, budgets, or anything travel-related! 🌍"
                                    </div>
                                    <button 
                                        className={`btn btn-sm w-100 mt-2 ${darkMode ? 'btn-outline-light' : 'btn-primary'}`}
                                        onClick={() => {
                                            const chatbot = document.querySelector('.chatbot-button') as HTMLElement;
                                            if (chatbot) {
                                                chatbot.click();
                                            }
                                        }}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Start Conversation
                                    </button>
                                </div>
                            </div>
                            
                            {selectedTrip && (
                                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <div className="modal-dialog modal-lg">
                                        <div className={`modal-content ${darkMode ? 'bg-dark text-light' : ''}`}>
                                            <div className="modal-header">
                                                <h5 className="modal-title">{selectedTrip.title}</h5>
                                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                            </div>
                                            <div className="modal-body">
                                                <img src={selectedTrip.image} alt={selectedTrip.title} className="img-fluid rounded mb-3" />
                                                <p><strong>Description:</strong> {selectedTrip.description}</p>
                                                <p><strong>Date:</strong> {selectedTrip.date}</p>
                                                <p><strong>Duration:</strong> {selectedTrip.duration}</p>
                                                {selectedTrip.details && <p><strong>Details:</strong> {selectedTrip.details}</p>}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                                <button type="button" className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
