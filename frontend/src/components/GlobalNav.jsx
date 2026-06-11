import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './GlobalNav.css';
import logoImg from '../assets/logo.png';

const GlobalNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
    setIsProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'doctor') return '/doctor-dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/patient-portal';
  };

  return (
    <nav className={`global-nav ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="global-nav-content">
        <div className="nav-logo" onClick={handleLogoClick}>
          <img src={logoImg} alt="KashDoc Logo" className="logo-image" />
          <span className="logo-text">KashDoc</span>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/doctors" className="nav-link" onClick={closeMenu}>Doctors</Link>
          <Link to="/chat" className="nav-link" onClick={closeMenu}>AI Assistant</Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
          
          <div className="mobile-only-actions">
            {user ? (
              <>
                <div className="mobile-user-info">
                  <span className="user-name-label">{user.name}</span>
                </div>
                <Link to={getDashboardLink()} className="nav-link" onClick={closeMenu}>Dashboard</Link>
                <button className="button-dark-utility" style={{ width: '100%', marginTop: '8px' }} onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <button className="button-dark-utility" style={{ width: '100%' }} onClick={() => { navigate('/login'); closeMenu(); }}>Sign In</button>
            )}
          </div>
        </div>

        <div className="nav-actions desktop-only">
          {user ? (
            <div className="profile-dropdown-container" ref={profileRef}>
              <button 
                className="profile-trigger" 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="user-name">{user.name}</span>
                <span className={`chevron ${isProfileOpen ? 'up' : 'down'}`}></span>
              </button>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    Dashboard
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="button-dark-utility" onClick={() => navigate('/login')}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default React.memo(GlobalNav);
