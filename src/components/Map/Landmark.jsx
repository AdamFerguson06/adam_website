import { useState } from 'react';
import useMapStore from '../../store/useMapStore';
import './Landmark.css';

const Landmark = ({ landmark, scale = 1 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useMapStore();

  const handleClick = (e) => {
    e.stopPropagation();
    openModal(landmark);
  };

  // Scale the position and dimensions based on the rendered map size
  const scaledStyle = {
    left: `${landmark.left * scale}px`,
    top: `${landmark.top * scale}px`,
    width: `${landmark.width * scale}px`,
    height: `${landmark.height * scale}px`,
  };

  return (
    <button
      className={`landmark ${isHovered ? 'hovered' : ''}`}
      style={scaledStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <span className="landmark-tooltip-text">{landmark.title}</span>
        <div className="landmark-tooltip-arrow" />
      </div>
    </button>
  );
};

export default Landmark;
