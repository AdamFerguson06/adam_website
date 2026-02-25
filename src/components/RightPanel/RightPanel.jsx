import { useRef } from 'react';
import useMapStore from '../../store/useMapStore';
import { landmarks } from '../../data/projects';
import { useIsMobile } from '../../hooks/useIsMobile';
import './RightPanel.css';

const navItems = [
  { label: 'About', navTarget: 'about' },
  { label: 'Projects', navTarget: 'projects' },
  { label: 'Contact', navTarget: 'contact' },
  { label: 'Misc.', navTarget: 'misc' },
];

const RightPanel = ({ isOpen, onClose }) => {
  const openModal = useMapStore((state) => state.openModal);
  const setHoveredNavTarget = useMapStore((state) => state.setHoveredNavTarget);
  const highlightAllLandmarks = useMapStore((state) => state.highlightAllLandmarks);
  const setHighlightAllLandmarks = useMapStore((state) => state.setHighlightAllLandmarks);
  const highlightTimeoutRef = useRef(null);
  const isMobile = useIsMobile();

  const handleStarClick = () => {
    // On mobile, close the menu when star is clicked
    if (isMobile && isOpen) {
      onClose();
      return;
    }

    // On desktop, highlight all landmarks for 2 seconds
    if (!isMobile) {
      // Clear any existing timeout
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      // Toggle highlight - if already highlighting, turn off; otherwise turn on for 2 seconds
      if (highlightAllLandmarks) {
        setHighlightAllLandmarks(false);
      } else {
        setHighlightAllLandmarks(true);
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightAllLandmarks(false);
        }, 2000);
      }
    }
  };

  const handleNavClick = (e, navTarget) => {
    e.preventDefault();
    // Close the mobile menu if open
    if (isOpen) {
      onClose();
    }
    // Find the landmark that corresponds to this navTarget
    const landmark = landmarks.find(l => l.navTarget === navTarget);
    // Open the modal with the full landmark data (or fallback to just navTarget)
    openModal(landmark || { navTarget });
  };

  const handleNavMouseEnter = (navTarget) => {
    if (!isMobile) {
      setHoveredNavTarget(navTarget);
    }
  };

  const handleNavMouseLeave = () => {
    if (!isMobile) {
      setHoveredNavTarget(null);
    }
  };

  return (
    <div className={`right-panel ${isOpen ? 'open' : ''}`}>
      <button type="button" className="star-icon" onClick={handleStarClick} aria-label="Highlight all landmarks">
        <img src="/Shooting Start.webp" alt="Shooting Star" />
      </button>

      <nav className="nav-links">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={`#${item.navTarget}`}
            className="nav-link"
            onClick={(e) => handleNavClick(e, item.navTarget)}
            onMouseEnter={() => handleNavMouseEnter(item.navTarget)}
            onMouseLeave={handleNavMouseLeave}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default RightPanel;
