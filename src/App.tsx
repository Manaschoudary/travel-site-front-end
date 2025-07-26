

import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TripCard, { Trip } from './components/TripCard';
import Chatbot from './components/Chatbot';
import EnquiryForm from './components/EnquiryForm';
import Login from './components/Login';
import { listTrips } from './api';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';



// Trips state will be loaded from backend

const App: React.FC = () => {

    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [pastTrips, setPastTrips] = useState<Trip[]>([]);
    const [futureTrips, setFutureTrips] = useState<Trip[]>([]);
    const pastTripsRef = useRef<HTMLDivElement>(null);
    const futureTripsRef = useRef<HTMLDivElement>(null);
    const [showPastArrows, setShowPastArrows] = useState(false);
    const [showFutureArrows, setShowFutureArrows] = useState(false);
    // Fetch trips from backend
    useEffect(() => {
        async function fetchTrips() {
            try {
                const trips = await listTrips();
                // Assuming backend returns trips with a field like { ...trip, is_past: true/false }
                setPastTrips(trips.filter((t: any) => t.is_past));
                setFutureTrips(trips.filter((t: any) => !t.is_past));
            } catch (err) {
                // fallback: keep empty or show error
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
    }, [pastTrips.length, futureTrips.length]);

    const scrollList = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = ref.current.clientWidth * 0.8;
            ref.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const handleTripClick = (trip: Trip) => setSelectedTrip(trip);
    const handleCloseModal = () => setSelectedTrip(null);
    const handleDownloadPDF = () => {
        // Placeholder for PDF download logic
        alert('Download PDF for ' + selectedTrip?.title);
    };
    const handleToggleTheme = () => setDarkMode((prev) => !prev);

    return (
      <Router>
        <div className={`container-fluid min-vh-100 d-flex flex-column ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
          {/* Navbar */}
          <nav className={`navbar navbar-expand-lg mb-3 ${darkMode ? 'navbar-dark bg-dark' : 'navbar-dark bg-primary'}`}> 
            <Link className="navbar-brand" to="/">TravelMate</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#">Past Trips</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Future Trips</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Chatbot</a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item d-flex align-items-center ms-3">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="themeSwitch" checked={darkMode} onChange={handleToggleTheme} />
                    <label className="form-check-label" htmlFor="themeSwitch" style={{ color: 'white' }}>
                      {darkMode ? 'Dark' : 'Light'} Mode
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <>
                {/* Hero Section with Images */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className={`card border-0 ${darkMode ? 'bg-secondary text-light' : 'bg-dark text-white'}` }>
                      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" className="card-img" alt="Travel Hero" style={{maxHeight: 350, objectFit: 'cover', opacity: 0.8}} />
                      <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center">
                        <h1 className="display-4 fw-bold">Explore the World with TravelMate</h1>
                        <p className="lead">Plan, book, and experience unforgettable journeys.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="row flex-grow-1">
                  {/* Sidebar (hidden on mobile) */}
                  <aside className="col-lg-3 d-none d-lg-block">
                    <div>
                      <div className={`card mb-3 ${darkMode ? 'bg-dark text-light' : ''}`}>
                          <div className={`card-header ${darkMode ? 'bg-secondary text-light' : 'bg-secondary text-white'}`}>Trip Filters</div>
                          <div className="card-body">
                              <button className="btn btn-outline-primary w-100 mb-2">Past Trips</button>
                              <button className="btn btn-outline-success w-100 mb-2">Future Trips</button>
                              <input className="form-control mb-2" type="text" placeholder="Search Trips" />
                              <button className="btn btn-outline-dark w-100">Download PDF</button>
                          </div>
                      </div>
                      {/* Testimonials */}
                      <div className={`card mb-3 ${darkMode ? 'bg-dark text-light' : ''}`}>
                          <div className={`card-header ${darkMode ? 'bg-warning text-dark' : 'bg-warning text-dark'}`}>Testimonials</div>
                          <div className="card-body">
                              <blockquote className="blockquote mb-2">
                                  <p>"TravelMate made my dream vacation a reality!"</p>
                                  <footer className="blockquote-footer">Alex, USA</footer>
                              </blockquote>
                              <blockquote className="blockquote mb-2">
                                  <p>"The AI chatbot is a game changer for planning trips."</p>
                                  <footer className="blockquote-footer">Priya, India</footer>
                              </blockquote>
                              <blockquote className="blockquote mb-0">
                                  <p>"Easy, fast, and reliable. Highly recommended."</p>
                                  <footer className="blockquote-footer">Liam, UK</footer>
                              </blockquote>
                          </div>
                      </div>
                    </div>
                  </aside>

                  {/* Main Section */}
                  <main className={`col-12 col-lg-9 ${darkMode ? 'text-light' : ''}`}>
                    <div className="mb-3">
                        <h2>Past Trips</h2>
                        <div className="position-relative">
                            {showPastArrows && (
                                <>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 start-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(pastTripsRef, 'left')}
                                        aria-label="Scroll left"
                                    >&lt;</button>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 end-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(pastTripsRef, 'right')}
                                        aria-label="Scroll right"
                                    >&gt;</button>
                                </>
                            )}
                            <div
                                ref={pastTripsRef}
                                className="d-flex flex-row overflow-auto g-3"
                                style={{ scrollBehavior: 'smooth', gap: '1rem', paddingBottom: 8 }}
                            >
                                {pastTrips.map(trip => (
                                    <div style={{ minWidth: 320, flex: '0 0 auto' }} key={trip.id}>
                                        <TripCard trip={trip} onClick={handleTripClick} darkMode={darkMode} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <h2>Future Trips</h2>
                        <div className="position-relative">
                            {showFutureArrows && (
                                <>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 start-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(futureTripsRef, 'left')}
                                        aria-label="Scroll left"
                                    >&lt;</button>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 end-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(futureTripsRef, 'right')}
                                        aria-label="Scroll right"
                                    >&gt;</button>
                                </>
                            )}
                            <div
                                ref={futureTripsRef}
                                className="d-flex flex-row overflow-auto g-3"
                                style={{ scrollBehavior: 'smooth', gap: '1rem', paddingBottom: 8 }}
                            >
                                {futureTrips.map(trip => (
                                    <div style={{ minWidth: 320, flex: '0 0 auto' }} key={trip.id}>
                                        <TripCard trip={trip} onClick={handleTripClick} darkMode={darkMode} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="mb-3">
                        <h2>Gallery</h2>
                        <div className="row row-cols-2 row-cols-md-4 g-3">
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="Paris Gallery" />
                            </div>
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="Tokyo Gallery" />
                            </div>
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="Sydney Gallery" />
                            </div>
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="New York Gallery" />
                            </div>
                        </div>
                    </div>

                    {/* Enquiry/Suggestion Form */}
                    <EnquiryForm darkMode={darkMode} />
                  </main>
                </div>

                {/* Trip Modal */}
                {selectedTrip && (
                    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className={`modal-content ${darkMode ? 'bg-dark text-light' : ''}`}>...
                        </div>
                    </div>
                )}

                {/* Chatbot Panel (sticky at bottom on mobile, right on desktop) */}
                <Chatbot darkMode={darkMode} />

                {/* Footer */}
                <footer className={`mt-auto py-3 text-center ${darkMode ? 'bg-dark text-light' : 'bg-dark text-white'}`}>
                  <small>© 2025 TravelMate. All rights reserved.</small>
                </footer>
              </>
            } />
          </Routes>
        </div>
      </Router>
    );
                        <div className={`card-header ${darkMode ? 'bg-secondary text-light' : 'bg-secondary text-white'}`}>Trip Filters</div>
                        <div className="card-body">
                            <button className="btn btn-outline-primary w-100 mb-2">Past Trips</button>
                            <button className="btn btn-outline-success w-100 mb-2">Future Trips</button>
                            <input className="form-control mb-2" type="text" placeholder="Search Trips" />
                            <button className="btn btn-outline-dark w-100">Download PDF</button>
                        </div>
                    </div>
                    {/* Testimonials */}
                    <div className={`card mb-3 ${darkMode ? 'bg-dark text-light' : ''}`}>
                        <div className={`card-header ${darkMode ? 'bg-warning text-dark' : 'bg-warning text-dark'}`}>Testimonials</div>
                        <div className="card-body">
                            <blockquote className="blockquote mb-2">
                                <p>"TravelMate made my dream vacation a reality!"</p>
                                <footer className="blockquote-footer">Alex, USA</footer>
                            </blockquote>
                            <blockquote className="blockquote mb-2">
                                <p>"The AI chatbot is a game changer for planning trips."</p>
                                <footer className="blockquote-footer">Priya, India</footer>
                            </blockquote>
                            <blockquote className="blockquote mb-0">
                                <p>"Easy, fast, and reliable. Highly recommended."</p>
                                <footer className="blockquote-footer">Liam, UK</footer>
                            </blockquote>
                        </div>
                    </div>
                </aside>

                {/* Main Section */}
                <main className={`col-12 col-lg-9 ${darkMode ? 'text-light' : ''}`}>
                    <div className="mb-3">
                        <h2>Past Trips</h2>
                        <div className="position-relative">
                            {showPastArrows && (
                                <>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 start-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(pastTripsRef, 'left')}
                                        aria-label="Scroll left"
                                    >&lt;</button>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 end-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(pastTripsRef, 'right')}
                                        aria-label="Scroll right"
                                    >&gt;</button>
                                </>
                            )}
                            <div
                                ref={pastTripsRef}
                                className="d-flex flex-row overflow-auto g-3"
                                style={{ scrollBehavior: 'smooth', gap: '1rem', paddingBottom: 8 }}
                            >
                                {pastTrips.map(trip => (
                                    <div style={{ minWidth: 320, flex: '0 0 auto' }} key={trip.id}>
                                        <TripCard trip={trip} onClick={handleTripClick} darkMode={darkMode} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <h2>Future Trips</h2>
                        <div className="position-relative">
                            {showFutureArrows && (
                                <>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 start-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(futureTripsRef, 'left')}
                                        aria-label="Scroll left"
                                    >&lt;</button>
                                    <button
                                        className="btn btn-secondary position-absolute top-50 end-0 translate-middle-y"
                                        style={{ zIndex: 2 }}
                                        onClick={() => scrollList(futureTripsRef, 'right')}
                                        aria-label="Scroll right"
                                    >&gt;</button>
                                </>
                            )}
                            <div
                                ref={futureTripsRef}
                                className="d-flex flex-row overflow-auto g-3"
                                style={{ scrollBehavior: 'smooth', gap: '1rem', paddingBottom: 8 }}
                            >
                                {futureTrips.map(trip => (
                                    <div style={{ minWidth: 320, flex: '0 0 auto' }} key={trip.id}>
                                        <TripCard trip={trip} onClick={handleTripClick} darkMode={darkMode} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="mb-3">
                        <h2>Gallery</h2>
                        <div className="row row-cols-2 row-cols-md-4 g-3">
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="Paris Gallery" />
                            </div>
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="Tokyo Gallery" />
                            </div>
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="Sydney Gallery" />
                            </div>
                            <div className="col">
                                <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80" className="img-fluid rounded shadow-sm" alt="New York Gallery" />
                            </div>
                            {/* Add more images as needed */}
                        </div>
                    </div>

                    {/* Enquiry/Suggestion Form */}
                    <EnquiryForm darkMode={darkMode} />
                </main>
            </div>

            {/* Trip Modal */}
            {selectedTrip && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className={`modal-content ${darkMode ? 'bg-dark text-light' : ''}`}>
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedTrip.title}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <img src={selectedTrip.image} alt={selectedTrip.title} className="img-fluid mb-3" style={{ maxHeight: 300, objectFit: 'cover' }} />
                                <p><strong>Date:</strong> {selectedTrip.date}</p>
                                <p><strong>Duration:</strong> {selectedTrip.duration}</p>
                                <p><strong>Description:</strong> {selectedTrip.description}</p>
                                <p><strong>Details:</strong> {selectedTrip.details}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                <button className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chatbot Panel (sticky at bottom on mobile, right on desktop) */}
            <Chatbot darkMode={darkMode} />

            {/* Footer */}
            <footer className={`mt-auto py-3 text-center ${darkMode ? 'bg-dark text-light' : 'bg-dark text-white'}`}>
                <small>© 2025 TravelMate. All rights reserved.</small>
            </footer>
        </div>
    );
};

export default App;