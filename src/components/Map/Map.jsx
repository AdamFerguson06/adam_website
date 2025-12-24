import { useState, useRef, useEffect } from 'react';
import useMapStore from '../../store/useMapStore';
import { projects } from '../../data/projects';
import Hotspot from './Hotspot';
import './Map.css';

const Map = () => {
  const { position, setPosition, scale, setScale } = useMapStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.hotspot')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(Math.max(0.5, Math.min(3, scale * delta)));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [scale]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div 
      ref={containerRef}
      className={`map-container ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="map-content"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <img src="/map.png" alt="Manhattan Map" className="map-image" />
        <div className="hotspots-container">
          {projects.map((project) => (
            <Hotspot key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;

