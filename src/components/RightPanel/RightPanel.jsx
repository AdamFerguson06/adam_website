import useMapStore from '../../store/useMapStore';
import './RightPanel.css';

const RightPanel = ({ isOpen, onClose }) => {
  const openModal = useMapStore((state) => state.openModal);
  
  const navItems = [
    { label: 'About', navTarget: 'about' },
    { label: 'Projects', navTarget: 'projects' },
    { label: 'Contact', navTarget: 'contact' },
    { label: 'Misc.', navTarget: 'misc' },
  ];

  const handleStarClick = (e) => {
    // On mobile, close the menu when star is clicked
    if (window.innerWidth <= 768 && isOpen) {
      e.preventDefault();
      onClose();
    }
  };

  const handleNavClick = (e, navTarget) => {
    e.preventDefault();
    // Close the mobile menu if open
    if (isOpen) {
      onClose();
    }
    // Open the modal with the appropriate navTarget
    openModal({ navTarget });
  };

  return (
    <div className={`right-panel ${isOpen ? 'open' : ''}`}>
      <a href="#star" className="star-icon" onClick={handleStarClick}>
        <img src="/Shooting Start.png" alt="Shooting Star" />
      </a>
      
      <nav className="nav-links">
        {navItems.map((item) => (
          <a 
            key={item.label} 
            href={`#${item.navTarget}`} 
            className="nav-link"
            onClick={(e) => handleNavClick(e, item.navTarget)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default RightPanel;

