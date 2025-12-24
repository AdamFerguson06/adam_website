import './RightPanel.css';

const RightPanel = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
    { label: 'Misc.', href: '#misc' },
    { label: 'xG', href: '#xg' },
  ];

  const handleStarClick = (e) => {
    // On mobile, close the menu when star is clicked
    if (window.innerWidth <= 768 && isOpen) {
      e.preventDefault();
      onClose();
    }
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
            href={item.href} 
            className="nav-link"
            onClick={onClose}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default RightPanel;

