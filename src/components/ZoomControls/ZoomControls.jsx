import useMapStore from '../../store/useMapStore';
import './ZoomControls.css';

const ZoomControls = () => {
  const { zoomIn, zoomOut, scale } = useMapStore();

  return (
    <div className="zoom-controls">
      <button 
        className="zoom-btn" 
        onClick={zoomIn}
        disabled={scale >= 3}
        aria-label="Zoom in"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <div className="zoom-divider" />
      <button 
        className="zoom-btn" 
        onClick={zoomOut}
        disabled={scale <= 0.5}
        aria-label="Zoom out"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default ZoomControls;

