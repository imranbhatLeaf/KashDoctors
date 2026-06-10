import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/heroimg.jpeg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">Healthcare for Srinagar</div>
          <h1 className="hero-title">
            Your Health, <span className="text-gradient">Simplified.</span>
          </h1>
          <p className="hero-lead">
            Connect with the best doctors in Srinagar in seconds. Experience healthcare that's modern, accessible, and designed for your life.
          </p>
          <div className="hero-actions">
            <Link to="/doctors" className="button-primary-elevated">Find a Doctor</Link>
            <Link to="/register" className="button-secondary-outline">Learn More</Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-background-glow"></div>
          <div className="image-wrapper">
            <img 
              src={heroImg} 
              alt="Medical Professional" 
              className="hero-main-image"
            />
            <div className="floating-card-top">
              <div className="pulse-dot"></div>
              <span>In Srinagar</span>
            </div>
            <div className="floating-card-bottom">
              <div className="card-avatar">👨‍⚕️</div>
              <div className="card-text">
                <strong>Dr. Anthony</strong>
                <span>Available Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
