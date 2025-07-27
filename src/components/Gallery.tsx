import React, { useState } from 'react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  location: string;
  category: string;
}

interface GalleryProps {
  darkMode: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Sample gallery images - you can replace these with your actual photos
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Mountain landscape",
      title: "Majestic Mountain Peak",
      location: "Swiss Alps",
      category: "mountains"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Beautiful beach",
      title: "Crystal Clear Waters",
      location: "Maldives",
      category: "beaches"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "City skyline",
      title: "Urban Exploration",
      location: "New York City",
      category: "cities"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Forest path",
      title: "Enchanted Forest",
      location: "Black Forest, Germany",
      category: "nature"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Tropical beach sunset",
      title: "Sunset Paradise",
      location: "Bali, Indonesia",
      category: "beaches"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1464822759844-d150baec013a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Snow-capped mountains",
      title: "Winter Wonderland",
      location: "Canadian Rockies",
      category: "mountains"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Ancient architecture",
      title: "Historic Wonders",
      location: "Rome, Italy",
      category: "cities"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Wildlife safari",
      title: "Safari Adventure",
      location: "Serengeti, Tanzania",
      category: "nature"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Desert landscape",
      title: "Golden Dunes",
      location: "Sahara Desert",
      category: "nature"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos', icon: '📸' },
    { id: 'beaches', name: 'Beaches', icon: '🏖️' },
    { id: 'mountains', name: 'Mountains', icon: '🏔️' },
    { id: 'cities', name: 'Cities', icon: '🏙️' },
    { id: 'nature', name: 'Nature', icon: '🌿' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
      const nextIndex = (currentIndex + 1) % filteredImages.length;
      setSelectedImage(filteredImages[nextIndex]);
    }
  };

  const prevImage = () => {
    if (selectedImage) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
      const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
      setSelectedImage(filteredImages[prevIndex]);
    }
  };

  return (
    <>
      <section id="gallery" className={`py-5 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: darkMode ? '#00d4aa' : '#007bff' }}>
              Travel Gallery
            </h2>
            <p className="lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Capturing memories from around the world - a visual journey through my adventures
            </p>
          </div>

          {/* Category Filter */}
          <div className="row mb-4">
            <div className="col-12">
              <div className={`card filter-card border-0 ${darkMode ? 'bg-darker border-secondary' : 'bg-white'}`}>
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`btn ${selectedCategory === category.id 
                          ? (darkMode ? 'btn-outline-light' : 'btn-primary')
                          : (darkMode ? 'btn-outline-secondary' : 'btn-outline-primary')
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                        style={{ borderRadius: '25px', minWidth: '120px' }}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="row g-3">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className={`col-lg-4 col-md-6 col-sm-6 ${index % 3 === 1 ? 'col-lg-4' : 'col-lg-4'}`}
              >
                <div 
                  className="gallery-item position-relative overflow-hidden rounded-3 shadow-sm"
                  style={{ 
                    height: index % 5 === 0 ? '300px' : '250px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onClick={() => openLightbox(image)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="img-fluid w-100 h-100"
                    style={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-3" 
                       style={{ 
                         background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                         color: 'white'
                       }}>
                    <h6 className="mb-1 fw-bold">{image.title}</h6>
                    <small className="text-light">📍 {image.location}</small>
                  </div>
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className={`badge ${darkMode ? 'bg-dark' : 'bg-white text-dark'} bg-opacity-75`}>
                      {categories.find(cat => cat.id === image.category)?.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No images message */}
          {filteredImages.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="modal show d-block" 
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1055 }}
          onClick={closeLightbox}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body p-0 text-center position-relative">
                <button 
                  type="button" 
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  style={{ zIndex: 1056 }}
                  onClick={closeLightbox}
                ></button>
                
                {/* Navigation arrows */}
                <button 
                  className="btn btn-outline-light position-absolute top-50 start-0 translate-middle-y ms-3"
                  style={{ zIndex: 1056, borderRadius: '50%', width: '50px', height: '50px' }}
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                >
                  ‹
                </button>
                <button 
                  className="btn btn-outline-light position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ zIndex: 1056, borderRadius: '50%', width: '50px', height: '50px' }}
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                >
                  ›
                </button>

                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.alt}
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '80vh', maxWidth: '100%' }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="text-white mt-3" onClick={(e) => e.stopPropagation()}>
                  <h4 className="mb-2">{selectedImage.title}</h4>
                  <p className="mb-0">📍 {selectedImage.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
