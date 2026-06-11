import React from 'react';
import GlobalNav from './GlobalNav';
import SubNavFrosted from './SubNavFrosted';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, title, actionLabel, onAction, showSubNav = true, showFooter = true }) => {
  return (
    <div className="page-layout">
      <GlobalNav />
      {showSubNav && title && (
        <SubNavFrosted 
          title={title} 
          actionLabel={actionLabel} 
          onAction={onAction} 
        />
      )}
      <main className="main-content">
        <div className="animate-page">
          {children}
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
