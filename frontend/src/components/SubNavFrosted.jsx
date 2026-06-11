import React from 'react';
import './SubNavFrosted.css';

const SubNavFrosted = ({ title, actionLabel, onAction }) => {
  return (
    <div className="sub-nav-frosted">
      <div className="sub-nav-content">
        <div className="sub-nav-title tagline">{title}</div>
        <div className="sub-nav-actions">
          {actionLabel && (
            <button className="button-primary" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SubNavFrosted);
