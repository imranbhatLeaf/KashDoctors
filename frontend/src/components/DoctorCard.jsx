import React from 'react';
import './DoctorCard.css';

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className={`doctor-card ${doctor.isPopular ? 'popular-highlight' : ''}`}>
      <div className="doctor-image-container">
        <div className="doctor-image-placeholder">
          <span>{doctor.name.charAt(0)}</span>
        </div>
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
