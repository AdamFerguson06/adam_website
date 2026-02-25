import { useRef, useEffect, useState } from 'react';
import './LeftPanel.css';
import { MODAL_DEBOUNCE_MS } from '../../constants';

const LeftPanel = ({ sidebarOpen = false, onCloseSidebar, portraitModalOpen, setPortraitModalOpen }) => {
  const portraitRef = useRef(null);
  const prevSidebarOpenRef = useRef(sidebarOpen);
  const justClosedSidebarRef = useRef(false);
  const justHandledRef = useRef(false);
  const justHandledTimerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const [portraitNoHover, setPortraitNoHover] = useState(false);

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

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      if (justHandledTimerRef.current) clearTimeout(justHandledTimerRef.current);
    };
  }, []);

  const handlePortraitInteraction = (e) => {
    if (justHandledRef.current) return;
    justHandledRef.current = true;
    justHandledTimerRef.current = setTimeout(() => { justHandledRef.current = false; }, 100);

    e.stopPropagation();

    if (justClosedSidebarRef.current) {
      return;
    }

    // If sidebar is open, close it
    if (sidebarOpen && onCloseSidebar) {
      justClosedSidebarRef.current = true;
      setPortraitNoHover(true);
      onCloseSidebar();
      debounceTimeoutRef.current = setTimeout(() => {
        setPortraitNoHover(false);
        justClosedSidebarRef.current = false;
      }, MODAL_DEBOUNCE_MS);
      return;
    }

    // Otherwise, toggle profile menu
    setPortraitModalOpen(!portraitModalOpen);
  };

  const closeMobileMenu = () => {
    setPortraitModalOpen(false);
  };

  return (
    <>
      <div className="left-panel">
        <div className="profile-section">
          <button
            type="button"
            ref={portraitRef}
            className={`portrait-button profile-image ${sidebarOpen ? 'sidebar-open' : ''} ${portraitNoHover ? 'no-hover' : ''}`}
            onTouchStart={(e) => {
              if (sidebarOpen) {
                e.preventDefault();
              }
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handlePortraitInteraction(e);
            }}
            onClick={handlePortraitInteraction}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePortraitInteraction(e);
              }
            }}
            aria-label={sidebarOpen ? "Close sidebar" : "Open profile menu"}
          >
            <img src="/Ghibli Adam PFP.webp" alt="Adam Ferguson, Ghibli-style portrait" />
          </button>
          <div className="name-and-links">
            <span className="profile-name">Adam</span>
            <div className="socials-section">
              <span className="socials-label">Socials</span>
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
      {portraitModalOpen && (
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
                <img src="/Ghibli Adam PFP.webp" alt="Adam Ferguson, Ghibli-style portrait" />
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
