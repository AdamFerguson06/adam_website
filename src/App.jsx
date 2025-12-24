import { useState, useRef, useEffect } from 'react';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapRef = useRef(null);
  const imageRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Check if we're on mobile
  const isMobile = () => window.innerWidth <= 768;

  // Calculate drag boundaries
  const getBoundaries = () => {
    if (!mapRef.current || !imageRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    const container = mapRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    
    // How much the image extends beyond the container
    const overflowX = Math.max(0, (image.width - container.width) / 2);
    const overflowY = Math.max(0, (image.height - container.height) / 2);
    
    return {
      minX: -overflowX,
      maxX: overflowX,
      minY: -overflowY,
      maxY: overflowY
    };
  };

  // Clamp position within boundaries
  const clampPosition = (x, y) => {
    const bounds = getBoundaries();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y))
    };
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (!isMobile()) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile()) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.current.x;
    const newY = touch.clientY - dragStart.current.y;
    
    const clampedPos = clampPosition(newX, newY);
    setPosition(clampedPos);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Reset position on window resize (desktop/mobile switch)
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile()) {
        setPosition({ x: 0, y: 0 });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app">
      <div 
        ref={mapRef}
        className={`map-container ${isDragging ? 'dragging' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          ref={imageRef}
          src="/map.png" 
          alt="Manhattan Map" 
          className="map-image" 
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`
          }}
          draggable={false}
        />
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
