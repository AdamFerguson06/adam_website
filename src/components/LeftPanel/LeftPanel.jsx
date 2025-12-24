import { useState } from 'react';
import './LeftPanel.css';

const LeftPanel = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="left-panel">
        <div className="profile-section">
          <div 
            className="profile-image" 
            onClick={toggleMobileMenu}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && toggleMobileMenu()}
            aria-label="Open profile menu"
          >
            <img src="/Adam Portrait.png" alt="Adam" />
          </div>
          <div className="name-and-links">
            <span className="profile-name">Adam</span>
            <div className="socials-section">
              <span className="socials-label">Socials:</span>
              <div className="social-link-item">
                <span>- </span>
                <a 
                  href="https://www.linkedin.com/in/adam-g-ferguson/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn Profile"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu modal */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-profile-overlay" onClick={closeMobileMenu}></div>
          <div className="mobile-profile-menu">
            <button 
              className="mobile-profile-close" 
              onClick={closeMobileMenu}
              aria-label="Close profile menu"
            >
              ×
            </button>
            <div className="mobile-profile-content">
              <div className="profile-image-large">
                <img src="/Adam Portrait.png" alt="Adam" />
              </div>
              <span className="profile-name-mobile">Adam</span>
              <div className="socials-section-mobile">
                <span className="socials-label-mobile">Socials:</span>
                <div className="social-link-item-mobile">
                  <span>- </span>
                  <a 
                    href="https://www.linkedin.com/in/adam-g-ferguson/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link-mobile"
                    aria-label="LinkedIn Profile"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LeftPanel;

