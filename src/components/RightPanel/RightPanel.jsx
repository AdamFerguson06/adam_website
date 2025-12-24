import './RightPanel.css';

const RightPanel = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
    { label: 'Misc.', href: '#misc' },
    { label: 'xG', href: '#xg' },
  ];

  return (
    <div className={`right-panel ${isOpen ? 'open' : ''}`}>
      <a href="#star" className="star-icon">
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

