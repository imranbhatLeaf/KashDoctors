import React from 'react';
import './DoctorCard.css';

// Dynamically import all doctor images from the assets folder
const doctorImages = Object.values(import.meta.glob('../assets/DoctorsPics/doc*.png', { eager: true, import: 'default' }));

const DoctorCard = ({ doctor, onBook }) => {
  // Use a simple hash of the doctor's ID or name to consistently pick an image
  const getImageIndex = (id) => {
    if (!id) return 0;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % doctorImages.length;
  };

  const imageIndex = getImageIndex(doctor._id || doctor.name);
  const fallbackPic = doctorImages[imageIndex];
  const doctorPic = doctor.image || fallbackPic;

  return (
    <div className={`doctor-card ${doctor.isPopular ? 'popular-highlight' : ''}`}>
      <div className="doctor-image-container">
        {doctorPic ? (
          <img
            src={doctorPic}
            alt={doctor.name}
            className="doctor-image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="doctor-image-placeholder">
            <span>{doctor.name.charAt(0)}</span>
          </div>
        )}
        <div className="experience-badge">{doctor.experience}Y EXP</div>
      </div>
      
      <div className="doctor-info">
        <div className="doctor-header">
          <h3 className="doctor-name">{doctor.name}</h3>
          <span className="doctor-rating">★ 4.9</span>
        </div>
        <p className="doctor-specialty">{doctor.specialization}</p>
        
        <div className="doctor-details">
          <div className="detail-item">
            <span className="detail-label">Consultation Fee</span>
            <span className="detail-value">${doctor.fees}</span>
          </div>
        </div>

        <button className="book-button" onClick={() => onBook(doctor._id)}>
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
