import { useState } from 'react';
import useMapStore from '../../store/useMapStore';
import './Landmark.css';

const Landmark = ({ landmark, scale = 1 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal, hoveredNavTarget, highlightAllLandmarks } = useMapStore();

  const handleClick = (e) => {
    e.stopPropagation();
    openModal(landmark);
  };

  // Check if device supports hover (desktop)
  const isMobile = () => window.innerWidth <= 768;

  const handleMouseEnter = () => {
    if (!isMobile()) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile()) {
      setIsHovered(false);
    }
  };

  // Scale the position and dimensions based on the rendered map size
  const scaledStyle = {
    left: `${landmark.left * scale}px`,
    top: `${landmark.top * scale}px`,
    width: `${landmark.width * scale}px`,
    height: `${landmark.height * scale}px`,
  };

  // Highlight if directly hovered, nav item with matching navTarget is hovered, or all landmarks are highlighted
  const isHighlighted = isHovered || (hoveredNavTarget && hoveredNavTarget === landmark.navTarget) || highlightAllLandmarks;

  return (
    <button
      className={`landmark ${isHighlighted ? 'hovered' : ''}`}
      style={scaledStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={`View ${landmark.title}`}
    >
      <img 
        src={landmark.image} 
        alt={landmark.title}
        className="landmark-image"
        draggable={false}
      />
      <div className="landmark-tooltip">
        <span className="landmark-tooltip-text">{landmark.tooltipLabel || landmark.title}</span>
        <div className="landmark-tooltip-arrow" />
      </div>
    </button>
  );
};

export default Landmark;
