import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="container">
        <p className="fine-print">© {currentYear} KashDoc Inc. Srinagar, J&K. All rights reserved.</p>
      </div>
    </footer>
  );
};

<<<<<<< HEAD
export default React.memo(Footer);
=======
export default Footer;
>>>>>>> origin/main
