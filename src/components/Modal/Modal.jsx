import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useMapStore from '../../store/useMapStore';
import './Modal.css';

// Section content based on navTarget
const sectionContent = {
  about: {
    label: 'About',
    title: 'About Me',
    description: 'Welcome! I\'m Adam, a passionate developer and designer based in New York City. I love creating beautiful, functional digital experiences that make a difference.',
    linkText: 'Learn More',
    linkHref: '#about',
  },
  projects: {
    label: 'Projects',
    title: 'My Projects',
    description: 'Explore my portfolio of work spanning web development, design, and creative technology. Each project represents a unique challenge and creative solution.',
    linkText: 'View All Projects',
    linkHref: '#projects',
  },
  contact: {
    label: 'Contact',
    title: 'Get in Touch',
    description: 'Have a project in mind or just want to say hello? I\'d love to hear from you. Let\'s connect and create something amazing together.',
    linkText: 'Contact Me',
    linkHref: '#contact',
  },
  misc: {
    label: 'Misc',
    title: 'Miscellaneous',
    description: 'A collection of experiments, side projects, and other creative endeavors that don\'t fit neatly into other categories. Expect the unexpected!',
    linkText: 'Explore',
    linkHref: '#misc',
  },
  xg: {
    label: 'xG',
    title: 'xG Analytics',
    description: 'Dive into expected goals (xG) analysis and football statistics. Data-driven insights into the beautiful game.',
    linkText: 'View xG Stats',
    linkHref: '#xg',
  },
};

const Modal = () => {
  const { isModalOpen, activeProject, closeModal } = useMapStore();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, closeModal]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Get section content based on navTarget, fallback to project data
  const getContent = () => {
    if (!activeProject) return null;
    
    const navTarget = activeProject.navTarget;
    if (navTarget && sectionContent[navTarget]) {
      return sectionContent[navTarget];
    }
    
    // Fallback to project data if no navTarget
    return {
      label: 'Project',
      title: activeProject.title,
      description: activeProject.description,
      linkText: 'View Project',
      linkHref: activeProject.link,
    };
  };

  const content = getContent();

  return (
    <AnimatePresence>
      {isModalOpen && activeProject && content && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.34, 1.56, 0.64, 1] 
            }}
          >
            <button className="modal-close" onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-content">
              <span className="modal-label">{content.label}</span>
              <h2 className="modal-title">{content.title}</h2>
              <p className="modal-description">{content.description}</p>
              <a 
                href={content.linkHref} 
                className="modal-link"
                onClick={closeModal}
              >
                {content.linkText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
