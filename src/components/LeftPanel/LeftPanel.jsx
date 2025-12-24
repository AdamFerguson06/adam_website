import { useState, useRef, useEffect } from 'react';
import './LeftPanel.css';

const LeftPanel = ({ sidebarOpen = false, onCloseSidebar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const portraitRef = useRef(null);
  const prevSidebarOpenRef = useRef(sidebarOpen);

  useEffect(() => {
    // When sidebar closes, force reset the opacity to clear any lingering :active state
    if (prevSidebarOpenRef.current && !sidebarOpen && portraitRef.current) {
      // Temporarily remove transition, set opacity, then re-enable transition
      const element = portraitRef.current;
      element.style.transition = 'none';
      element.style.opacity = '1';
      // Use requestAnimationFrame to ensure the style is applied before re-enabling transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.transition = '';
          element.style.opacity = '';
        });
      });
    }
    prevSidebarOpenRef.current = sidebarOpen;
  }, [sidebarOpen]);

  const handlePortraitClick = () => {
    // If sidebar is open, close it
    if (sidebarOpen && onCloseSidebar) {
      onCloseSidebar();
      return;
    }
    // Otherwise, toggle profile menu
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
            ref={portraitRef}
            className={`profile-image ${sidebarOpen ? 'sidebar-open' : ''}`}
            onClick={handlePortraitClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                if (sidebarOpen && onCloseSidebar) {
                  onCloseSidebar();
                } else {
                  handlePortraitClick();
                }
              }
            }}
            aria-label={sidebarOpen ? "Close sidebar" : "Open profile menu"}
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

