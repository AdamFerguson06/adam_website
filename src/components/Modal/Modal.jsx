import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useMapStore from '../../store/useMapStore';
import { landmarks } from '../../data/projects';
import { sectionContent } from '../../data/modalContent';
import ChevronIcon from '../icons/ChevronIcon';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import CloseIcon from '../icons/CloseIcon';
import './Modal.css';

const Modal = () => {
  const isModalOpen = useMapStore((s) => s.isModalOpen);
  const activeProject = useMapStore((s) => s.activeProject);
  const closeModal = useMapStore((s) => s.closeModal);
  const openModal = useMapStore((s) => s.openModal);
  const triggerElement = useMapStore((s) => s.triggerElement);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const skillDropdownRef = useRef(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close skill dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setSkillDropdownOpen(false);
      }
    };

    if (skillDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [skillDropdownOpen]);

  // Extract all unique skills from projects
  const getAllSkills = (companies) => {
    if (!companies) return [];
    const skillSet = new Set();
    companies.forEach(company => {
      company.projects.forEach(project => {
        project.skills?.forEach(skill => skillSet.add(skill));
      });
    });
    return Array.from(skillSet).sort();
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearSkillFilter = () => {
    setSelectedSkills([]);
  };

  // Check if any projects are expanded
  const isAnyExpanded = () => {
    return Object.values(expandedProjects).some(Boolean);
  };

  // Expand or collapse all
  const toggleExpandAll = (companies) => {
    if (!companies) return;

    const shouldExpand = !isAnyExpanded();

    if (shouldExpand) {
      const newExpandedProjects = {};
      companies.forEach(company => {
        company.projects.forEach((_, idx) => {
          newExpandedProjects[`${company.name}-${idx}`] = true;
        });
      });
      setExpandedProjects(newExpandedProjects);
    } else {
      setExpandedProjects({});
    }
  };

  // Auto-expand projects that match selected skills
  useEffect(() => {
    if (selectedSkills.length === 0) {
      setExpandedProjects({});
      return;
    }

    const content = sectionContent.projects;
    if (!content?.companies) return;

    const newExpandedProjects = {};

    content.companies.forEach(company => {
      company.projects.forEach((project, idx) => {
        const hasMatchingSkill = project.skills?.some(skill =>
          selectedSkills.includes(skill)
        );
        if (hasMatchingSkill) {
          newExpandedProjects[`${company.name}-${idx}`] = true;
        }
      });
    });

    setExpandedProjects(newExpandedProjects);
  }, [selectedSkills]);

  const toggleProject = (projectKey) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectKey]: !prev[projectKey]
    }));
  };

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

  // Focus trap
  useEffect(() => {
    if (!isModalOpen) return;

    const modalEl = modalRef.current;
    if (!modalEl) return;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const focusableEls = modalEl.querySelectorAll(focusableSelector);
      if (focusableEls.length === 0) return;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus close button on open
    if (closeButtonRef.current) closeButtonRef.current.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Return focus to trigger element when modal closes
  useEffect(() => {
    if (!isModalOpen && triggerElement) {
      triggerElement.focus();
    }
  }, [isModalOpen, triggerElement]);

  // Reset expanded state when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setIsExpanded(false);
      setExpandedProjects({});
      setSelectedSkills([]);
      setSkillDropdownOpen(false);
      setSkillSearchQuery('');
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
  const allSkills = getAllSkills(content?.companies);

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
            ref={modalRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <button ref={closeButtonRef} className="modal-close" onClick={closeModal}>
              <CloseIcon />
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
              {content.companies ? (
                <div className="modal-title-row">
                  <h2 id="modal-title" className="modal-title">{content.title}</h2>
                  <div className="skill-filter">
                    <div className="skill-filter-dropdown" ref={skillDropdownRef}>
                      <button
                        className={`skill-filter-toggle ${skillDropdownOpen ? 'open' : ''}`}
                        onClick={() => setSkillDropdownOpen(!skillDropdownOpen)}
                      >
                        <span>
                          {selectedSkills.length === 0
                            ? 'Filter by skill'
                            : `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''} selected`}
                        </span>
                        <ChevronIcon className="dropdown-icon" />
                      </button>
                      <AnimatePresence>
                        {skillDropdownOpen && (
                          <motion.div
                            className="skill-filter-menu"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <div className="skill-search-wrapper">
                              <input
                                type="text"
                                className="skill-search-input"
                                placeholder="Search skills..."
                                value={skillSearchQuery}
                                onChange={(e) => setSkillSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="skill-options-list">
                              {allSkills
                                .filter(skill => skill.toLowerCase().includes(skillSearchQuery.toLowerCase()))
                                .map(skill => (
                                  <label key={skill} className="skill-filter-option">
                                    <input
                                      type="checkbox"
                                      checked={selectedSkills.includes(skill)}
                                      onChange={() => toggleSkill(skill)}
                                    />
                                    <span className="skill-checkbox"></span>
                                    <span className="skill-label">{skill}</span>
                                  </label>
                                ))}
                            </div>
                            {selectedSkills.length > 0 && (
                              <button
                                className="skill-filter-menu-clear"
                                onClick={clearSkillFilter}
                              >
                                Clear Selected
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {selectedSkills.length > 0 && (
                      <button className="skill-filter-clear" onClick={clearSkillFilter}>
                        Clear
                      </button>
                    )}
                    <button
                      className="expand-collapse-all"
                      onClick={() => toggleExpandAll(content.companies)}
                    >
                      {isAnyExpanded() ? 'Collapse All' : 'Expand All'}
                    </button>
                  </div>
                  {/* Mobile-only filter actions row */}
                  <div className="mobile-filter-actions">
                    <button
                      className="expand-collapse-all"
                      onClick={() => toggleExpandAll(content.companies)}
                    >
                      {isAnyExpanded() ? 'Collapse All' : 'Expand All'}
                    </button>
                    {selectedSkills.length > 0 && (
                      <button className="skill-filter-clear" onClick={clearSkillFilter}>
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <h2 id="modal-title" className="modal-title">{content.title}</h2>
              )}
              <p className="modal-description">{content.description}</p>
              {content.companies && (
                <div className="modal-companies">
                  {content.companies.map((company) => (
                    <div key={company.name} className="company-card">
                      <div className="company-card-left">
                        <h3 className="company-card-name">{company.name}</h3>
                        <span className="company-card-role">{company.role}</span>
                        <span className="company-card-period">{company.period}</span>
                      </div>
                      <div className="company-card-right">
                        {company.projects.map((project, idx) => {
                          const projectKey = `${company.name}-${idx}`;
                          const panelId = `project-panel-${company.name}-${idx}`.replace(/\s+/g, '-');
                          return (
                            <div key={projectKey} className="project-accordion-item">
                              <button
                                className={`project-accordion-header ${expandedProjects[projectKey] ? 'expanded' : ''}`}
                                onClick={() => toggleProject(projectKey)}
                                aria-expanded={expandedProjects[projectKey] || false}
                                aria-controls={panelId}
                              >
                                <span className="project-accordion-title">{project.title}</span>
                                <ChevronIcon className="expand-icon" />
                              </button>
                              <AnimatePresence>
                                {expandedProjects[projectKey] && (
                                  <motion.div
                                    id={panelId}
                                    className="project-details"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                  >
                                    <div className="project-details-inner">
                                      <p className="project-description">{project.description}</p>
                                      <div className="project-skills">
                                        {project.skills?.map((skill) => (
                                          <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                      </div>
                                      {project.links && (
                                        <div className="project-links">
                                          {project.links.map((link) => (
                                            <a
                                              key={link.url}
                                              href={link.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="project-link"
                                            >
                                              {link.label}
                                              <ExternalLinkIcon size={12} />
                                            </a>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {content.miscProjects && (
                <div className="misc-projects">
                  {content.miscProjects.map((project, idx) => (
                    <div className="misc-project-card" key={idx}>
                      <h3 className="misc-project-name">{project.name}</h3>
                      <p className="misc-project-description">{project.description}</p>
                      {project.siteUrl && (
                        <a
                          href={project.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="misc-project-site-link"
                        >
                          {project.siteLabel || project.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          <ExternalLinkIcon size={14} />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="misc-project-repo-link"
                        >
                          GitHub Repo
                          <ExternalLinkIcon size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {content.longDescription && (
                <div className="modal-expand-section">
                  <div className="modal-expand-row">
                    <button
                      className={`modal-expand-toggle ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => setIsExpanded(!isExpanded)}
                      aria-expanded={isExpanded}
                      aria-controls="modal-long-description"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                      <ChevronIcon className="expand-icon" />
                    </button>
                    <span className="modal-expand-divider">|</span>
                    <button
                      className="modal-nav-link"
                      onClick={handleNavigateToProjects}
                    >
                      <span>See My Work</span>
                      <ExternalLinkIcon size={16} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id="modal-long-description"
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
                    <ExternalLinkIcon size={16} />
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
              ) : content.linkHref && (
                <a
                  href={content.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link"
                >
                  {content.linkText}
                  <ExternalLinkIcon size={16} />
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
