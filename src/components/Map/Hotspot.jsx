import { useState } from 'react';
import useMapStore from '../../store/useMapStore';
import './Hotspot.css';

const Hotspot = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useMapStore();

  const handleClick = (e) => {
    e.stopPropagation();
    openModal(project);
  };

  return (
    <button
      className={`hotspot ${isHovered ? 'hovered' : ''}`}
      style={{
        top: `${project.top}%`,
        left: `${project.left}%`,
        width: `${project.width}px`,
        height: `${project.height}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      aria-label={`View ${project.title} project`}
    >
      <div className="hotspot-highlight" />
      <div className="tooltip">
        <span className="tooltip-text">{project.title}</span>
        <div className="tooltip-arrow" />
      </div>
    </button>
  );
};

export default Hotspot;

