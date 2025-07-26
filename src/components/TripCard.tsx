import React from 'react';

export interface Trip {
    id: string;
    title: string;
    image: string;
    date: string;
    duration: string;
    description: string;
    details: string;
    price: number;
    is_past?: boolean;
}


interface TripCardProps {
    trip: Trip;
    onClick: (trip: Trip) => void;
    darkMode?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClick, darkMode }) => (
    <div className="h-100">
        <div
            className={`card h-100 trip-card ${darkMode ? 'bg-dark text-light border-secondary' : 'border-0'}`}
            style={{ 
                cursor: 'pointer',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: darkMode ? '0 4px 15px rgba(255, 255, 255, 0.1)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => onClick(trip)}
        >
            <div className="position-relative image-container">
                <img 
                    src={trip.image} 
                    className="card-img-top" 
                    alt={trip.title} 
                    style={{ height: 220, objectFit: 'cover' }} 
                />
                <div className="image-overlay"></div>
                <div className="position-absolute top-0 end-0 m-2 m-md-3">
                    <span className={`badge ${darkMode ? 'bg-secondary' : 'bg-light text-dark'} bg-opacity-90`} style={{ fontSize: '0.8rem' }}>
                        {trip.duration}
                    </span>
                </div>
            </div>
            <div className="card-body p-4">
                <h5 className="card-title mb-3" style={{ 
                    fontWeight: '600',
                    color: darkMode ? '#00d4aa' : '#007bff'
                }}>
                    {trip.title}
                </h5>
                <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    📅 {trip.date}
                </p>
                <p className="card-text" style={{ 
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {trip.description}
                </p>
            </div>
            <div className="card-footer bg-transparent border-0 p-4 pt-0">
                <small className={`text-muted ${darkMode ? 'text-light-emphasis' : ''}`}>
                    Click to view details →
                </small>
            </div>
        </div>
    </div>
);

export default TripCard;
