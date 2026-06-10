import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SpecialtyGrid.css';

const SpecialtyGrid = () => {
  const navigate = useNavigate();

  const specialties = [
    { name: 'General Physician', icon: '🩺' },
    { name: 'Gynecologist', icon: '🤰' },
    { name: 'Dermatologist', icon: '✨' },
    { name: 'Pediatricians', icon: '👶' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Gastroenterologist', icon: '🍕' }
  ];

  const handleSpecialtyClick = (specialty) => {
    navigate('/doctors', { state: { specialty } });
  };

  return (
    <section className="section-padding speciality-section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="display-lg">Find by Speciality</h2>
          <p className="lead" style={{ maxWidth: '600px', margin: '16px auto 0' }}>
            Simply browse through our extensive list of trusted doctors, scheduled your appointment hassle-free.
          </p>
        </div>
        
        <div className="speciality-grid">
          {specialties.map(spec => (
            <div 
              key={spec.name}
              onClick={() => handleSpecialtyClick(spec.name)}
              className="speciality-card"
            >
              <div className="speciality-icon">{spec.icon}</div>
              <p className="caption-strong">{spec.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtyGrid;
