import { useState } from 'react';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      <div className="map-container">
        <img src="/map.png" alt="Manhattan Map" className="map-image" />
      </div>
      
      <LeftPanel />
      <RightPanel isOpen={menuOpen} onClose={closeMenu} />
      
      {/* Mobile menu button (shooting star) */}
      <button className={`mobile-menu-btn ${menuOpen ? 'hidden' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
        <img src="/Shooting Start.png" alt="Menu" />
      </button>
      
      {/* Mobile overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
    </div>
  );
}

export default App;
