import React from 'react';

export interface Trip {
    id: string;
    title: string;
    image: string;
    date: string;
    duration: string;
    description: string;
    details: string;
}


interface TripCardProps {
    trip: Trip;
    onClick: (trip: Trip) => void;
    darkMode?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClick, darkMode }) => (
    <div className="col">
        <div
            className={`card h-100 ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onClick(trip)}
        >
            <img src={trip.image} className="card-img-top" alt={trip.title} style={{ height: 180, objectFit: 'cover' }} />
            <div className="card-body">
                <h5 className="card-title">{trip.title}</h5>
                <p className="card-text">{trip.date} - {trip.duration}</p>
            </div>
        </div>
    </div>
);

export default TripCard;
