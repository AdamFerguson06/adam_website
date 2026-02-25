import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import Landmark from './components/Map/Landmark';
import useMapStore from './store/useMapStore';
import { landmarks } from './data/projects';
import { useIsMobile } from './hooks/useIsMobile';
import { MODAL_DEBOUNCE_MS } from './constants';
import './App.css';

const Agentation = lazy(() => import('agentation').then(m => ({ default: m.Agentation })));
const Modal = lazy(() => import('./components/Modal/Modal'));

// Original Figma design dimensions for the map
const DESIGN_WIDTH = 1000;
const DESIGN_HEIGHT = 1019;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portraitModalOpen, setPortraitModalOpen] = useState(false);
  const [starNoHover, setStarNoHover] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapRef = useRef(null);
  const mapContentRef = useRef(null);
  const mapImageRef = useRef(null);
  const landmarksContainerRef = useRef(null);
  const justClosedModalRef = useRef(false);
  const hasScrolledRef = useRef(false);
  const starDebounceRef = useRef(null);
  const justHandledRef = useRef(false);
  const isModalOpen = useMapStore((state) => state.isModalOpen);
  const closeModal = useMapStore((state) => state.closeModal);

  const isMobile = useIsMobile();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const closePortraitModal = () => setPortraitModalOpen(false);

  // Clean up star debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (starDebounceRef.current) clearTimeout(starDebounceRef.current);
    };
  }, []);

  // Calculate scale factor based on rendered map size vs design size
  const updateScale = () => {
    if (mapImageRef.current && landmarksContainerRef.current) {
      const renderedHeight = mapImageRef.current.offsetHeight;
      const renderedWidth = mapImageRef.current.offsetWidth;
      setScale(renderedHeight / DESIGN_HEIGHT);

      // Ensure landmarks container matches image dimensions exactly
      if (landmarksContainerRef.current && renderedWidth > 0 && renderedHeight > 0) {
        landmarksContainerRef.current.style.width = `${renderedWidth}px`;
        landmarksContainerRef.current.style.height = `${renderedHeight}px`;
      }
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
    if (!isMobile) return;
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
    if (!isDragging || !isMobile) return;

    // Hide scroll hint on first scroll
    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      setShowScrollHint(false);
    }

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
      if (!isMobile) {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Update scale when image loads
  const handleImageLoad = () => {
    updateScale();
  };

  // Consolidated handler for mobile star button (handles both touch and click)
  const handleStarInteraction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent double-firing on touch devices (touchend + click)
    if (justHandledRef.current) {
      return;
    }
    justHandledRef.current = true;
    starDebounceRef.current = setTimeout(() => {
      justHandledRef.current = false;
    }, MODAL_DEBOUNCE_MS);

    if (justClosedModalRef.current) {
      return;
    }

    if (isModalOpen) {
      justClosedModalRef.current = true;
      setStarNoHover(true);
      closeModal();
      starDebounceRef.current = setTimeout(() => {
        setStarNoHover(false);
        justClosedModalRef.current = false;
      }, MODAL_DEBOUNCE_MS);
      return;
    }

    if (portraitModalOpen) {
      justClosedModalRef.current = true;
      setStarNoHover(true);
      closePortraitModal();
      starDebounceRef.current = setTimeout(() => {
        setStarNoHover(false);
        justClosedModalRef.current = false;
      }, MODAL_DEBOUNCE_MS);
      return;
    }

    toggleMenu();
  };

  return (
    <div className="app">
      <main
        ref={mapRef}
        className={`map-container ${isDragging ? 'dragging' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={mapContentRef}
          className={`map-content ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`
          }}
        >
          <div className="map-image-wrapper">
            <img
              ref={mapImageRef}
              src="/map_images/Background-Map-Of-Manhattan.webp"
              alt="Manhattan Map"
              className="map-image"
              draggable={false}
              onLoad={handleImageLoad}
            />
            <div ref={landmarksContainerRef} className="landmarks-container">
              {landmarks.map((landmark) => (
                <Landmark key={landmark.id} landmark={landmark} scale={scale} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <LeftPanel
        sidebarOpen={menuOpen}
        onCloseSidebar={closeMenu}
        portraitModalOpen={portraitModalOpen}
        setPortraitModalOpen={setPortraitModalOpen}
      />
      <RightPanel isOpen={menuOpen} onClose={closeMenu} />
      <Suspense fallback={null}>
        <Modal />
      </Suspense>

      {/* Mobile menu button (shooting star) */}
      <button
        className={`mobile-menu-btn ${menuOpen ? 'hidden' : ''} ${isModalOpen || portraitModalOpen ? 'modal-open' : ''} ${starNoHover ? 'no-hover' : ''}`}
        onTouchStart={(e) => {
          // Handle touch on mobile - prevent ghost clicks
          if (isModalOpen || portraitModalOpen) {
            e.preventDefault();
          }
        }}
        onTouchEnd={handleStarInteraction}
        onClick={handleStarInteraction}
        aria-label={isModalOpen || portraitModalOpen ? "Close modal" : "Toggle menu"}
      >
        <img src="/Shooting Start.webp" alt="Menu" />
      </button>

      {/* Mobile overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}

      {/* Mobile scroll hint */}
      {showScrollHint && (
        <div className="mobile-scroll-hint">
          <span className="scroll-hint-arrow">←</span>
          <span className="scroll-hint-text">Swipe to explore</span>
          <span className="scroll-hint-arrow">→</span>
        </div>
      )}

      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <Agentation />
        </Suspense>
      )}
    </div>
  );
}

export default App;
