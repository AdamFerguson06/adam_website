import { useState, useRef, useEffect } from 'react';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import Landmark from './components/Map/Landmark';
import Modal from './components/Modal/Modal';
import { landmarks } from './data/projects';
import './App.css';

// Original Figma design dimensions for the map
const DESIGN_WIDTH = 1000;
const DESIGN_HEIGHT = 1019;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapRef = useRef(null);
  const mapContentRef = useRef(null);
  const mapImageRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Check if we're on mobile
  const isMobile = () => window.innerWidth <= 768;

  // Calculate scale factor based on rendered map size vs design size
  const updateScale = () => {
    if (mapImageRef.current) {
      const renderedHeight = mapImageRef.current.offsetHeight;
      setScale(renderedHeight / DESIGN_HEIGHT);
    }
  };

  // Calculate drag boundaries
  const getBoundaries = () => {
    if (!mapRef.current || !mapContentRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    const container = mapRef.current.getBoundingClientRect();
    const content = mapContentRef.current.getBoundingClientRect();
    
    // How much the content extends beyond the container
    const overflowX = Math.max(0, (content.width - container.width) / 2);
    const overflowY = Math.max(0, (content.height - container.height) / 2);
    
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
    // Don't start dragging if touching a landmark
    if (e.target.closest('.landmark')) return;
    
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

  // Update scale on mount and resize
  useEffect(() => {
    updateScale();
    
    const handleResize = () => {
      updateScale();
      if (!isMobile()) {
        setPosition({ x: 0, y: 0 });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update scale when image loads
  const handleImageLoad = () => {
    updateScale();
  };

  return (
    <div className="app">
      <div 
        ref={mapRef}
        className={`map-container ${isDragging ? 'dragging' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          ref={mapContentRef}
          className="map-content"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`
          }}
        >
          <div className="map-image-wrapper">
            <img 
              ref={mapImageRef}
              src="/map_images/Background-Map-Of-Manhattan.png" 
              alt="Manhattan Map" 
              className="map-image" 
              draggable={false}
              onLoad={handleImageLoad}
            />
            <div className="landmarks-container">
              {landmarks.map((landmark) => (
                <Landmark key={landmark.id} landmark={landmark} scale={scale} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <LeftPanel />
      <RightPanel isOpen={menuOpen} onClose={closeMenu} />
      <Modal />
      
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
