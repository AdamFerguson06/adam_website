import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useMapStore from '../../store/useMapStore';
import { landmarks } from '../../data/projects';
import './Modal.css';

// Section content based on navTarget
const sectionContent = {
  about: {
    label: 'About',
    title: 'About Me',
    description: 'I\'m a full-stack analytics leader turned entrepreneur, currently running Falcon Media, a digital marketing agency I co-founded. I\'ve built data warehouses from scratch at multiple startups, led initiatives from $0 to $20k in daily profit, and now handle everything from sales to SEM as a founder. I thrive when the work requires wearing many hats.',
    longDescription: `I started my career at EverQuote as a Quantitative Analyst, where I spent 2.5 years growing into a Senior Quantitative Analyst. I led data analytics for a new business unit that grew to 30% of the company's total revenue within a year.

From there, I moved through a series of progressively senior analytics roles: building star schema and data vault models at Koalafi, establishing the original data warehouse architecture at Unstoppable Domains, and engineering the analytics infrastructure at O Positiv, where I developed LTV prediction models that improved forecast precision by 75%.

In late 2024, I returned to EverQuote as a consultant to lead data engineering, analytics, and product management for a new initiative. I built the data architecture from scratch, set up all data reporting, developed SEM campaigns, and helped grow the initiative from $0 to $20k in daily profit.

That experience pushed me to build something of my own. In 2025, I co-founded Falcon Media, a full-stack digital marketing agency. As Co-Founder, I handle: legal, contracts, sales, account management, finances, landing pages, SEM, and analytics.

What defines me is a willingness to do whatever a project requires, even when it's outside my "scope." I've leaned into AI tools to accelerate this approach, using them to quickly get up to speed on unfamiliar domains. If something needs to get done, I figure it out.`,
    linkText: 'LinkedIn',
    linkHref: 'https://www.linkedin.com/in/adam-g-ferguson/',
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
    description: 'I\'m always happy to connect. Whether it\'s about a role, a consulting opportunity, or a Falcon Media partnership, feel free to reach out.',
    contactInfo: {
      calendar: 'https://calendly.com/adam-falconmedia/30min',
      businessEmail: 'adam@falconmedia.group',
      personalEmail: 'adam.ferguson06@gmail.com',
    },
    linkText: 'Schedule a Meeting with Me',
    linkHref: 'https://calendly.com/adam-falconmedia/30min',
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
  const { isModalOpen, activeProject, closeModal, openModal } = useMapStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get the projects landmark for navigation
  const projectsLandmark = landmarks.find(l => l.navTarget === 'projects');

  const handleNavigateToProjects = () => {
    if (projectsLandmark) {
      openModal(projectsLandmark);
      setIsExpanded(false);
    }
  };

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

  // Reset expanded state when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setIsExpanded(false);
    }
  }, [isModalOpen]);

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
              <a
                href={activeProject.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-label"
              >
                {activeProject.title}
              </a>
              <h2 className="modal-title">{content.title}</h2>
              <p className="modal-description">{content.description}</p>
              {content.longDescription && (
                <div className="modal-expand-section">
                  <div className="modal-expand-row">
                    <button
                      className={`modal-expand-toggle ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => setIsExpanded(!isExpanded)}
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="expand-icon"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <span className="modal-expand-divider">|</span>
                    <button
                      className="modal-nav-link"
                      onClick={handleNavigateToProjects}
                    >
                      <span>See My Work</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </button>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="modal-long-description"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="modal-long-description-inner">
                          {content.longDescription.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {content.contactInfo ? (
                <div className="modal-contact-section">
                  <a
                    href={content.linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-text-link"
                  >
                    <span>{content.linkText}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                  <div className="modal-contact-info">
                    <div className="contact-item">
                      <span className="contact-label">Business:</span>
                      <a href={`mailto:${content.contactInfo.businessEmail}`} className="contact-link">
                        {content.contactInfo.businessEmail}
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Personal:</span>
                      <a href={`mailto:${content.contactInfo.personalEmail}`} className="contact-link">
                        {content.contactInfo.personalEmail}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  href={content.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link"
                >
                  {content.linkText}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
