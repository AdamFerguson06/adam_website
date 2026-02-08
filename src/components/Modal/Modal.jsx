import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useMapStore from '../../store/useMapStore';
import { landmarks } from '../../data/projects';
import './Modal.css';

// Section content based on navTarget
const sectionContent = {
  about: {
    label: 'About',
    title: 'About Me',
    description: 'I\'m a full-stack analytics leader turned entrepreneur, currently running Falcon Media, a digital marketing agency I co-founded. I\'ve built data warehouses from scratch at multiple startups, led initiatives from $0 to $50k in daily profit, and now handle everything from sales to SEM as a founder. I thrive when the work requires wearing many hats.',
    longDescription: `I started my career at EverQuote as a Quantitative Analyst, where I spent 2.5 years growing into a Senior Quantitative Analyst. I led data analytics for a new business unit that grew to 30% of the company's total revenue within a year.

From there, I moved through a series of progressively senior analytics roles: building star schema and data vault models at Koalafi, establishing the original data warehouse architecture at Unstoppable Domains, and engineering the analytics infrastructure at O Positiv, where I developed LTV prediction models that improved forecast precision by 75%.

In late 2024, I returned to EverQuote as a consultant to lead data engineering, analytics, and product management for a new initiative. I built the data architecture from scratch, set up all data reporting, developed SEM campaigns, and helped grow the initiative from $0 to $50k in daily profit.

That experience pushed me to build something of my own. In 2025, I co-founded Falcon Media, a full-stack digital marketing agency. As Co-Founder, I handle: legal, contracts, sales, account management, finances, landing pages, SEM, and analytics.

What defines me is a willingness to do whatever a project requires, even when it's outside my "scope." I've leaned into AI tools to accelerate this approach, using them to quickly get up to speed on unfamiliar domains. If something needs to get done, I figure it out.`,
    linkText: 'LinkedIn',
    linkHref: 'https://www.linkedin.com/in/adam-g-ferguson/',
  },
  projects: {
    label: 'Projects',
    title: 'My Projects',
    description: 'Projects I\'ve built and shipped across data infrastructure, web products, and growth.',
    companies: [
      {
        name: 'Falcon Media',
        role: 'Co-Founder, CEO',
        period: '2025 - Present',
        projects: [
          {
            title: 'Lead Gen Website Portfolio',
            description: 'Five revenue-generating websites across insurance, personal loans, and banking verticals. Actively driving lead volume with full FTC compliance baked in from day one.',
            skills: ['React', 'AI-Assisted Development', 'Web Development', 'Compliance'],
            links: [
              { label: 'quotefii.com', url: 'https://quotefii.com' },
              { label: 'loanmatchpartners.com', url: 'https://loanmatchpartners.com' },
              { label: 'loancomparisongroup.com', url: 'https://loancomparisongroup.com' },
              { label: 'brightpointpartners.com', url: 'https://brightpointpartners.com' },
              { label: 'checking.brightpointpartners.com', url: 'https://checking.brightpointpartners.com' },
            ],
          },
          {
            title: 'Data Pipeline & Warehouse',
            description: 'Full-stack attribution system tracking every lead from click to revenue. AWS Lambda event capture, PostgreSQL storage, and reverse ETL to Google Ads for offline conversion optimization.',
            skills: ['Python', 'SQL', 'AWS Lambda', 'ETL/ELT', 'Data Warehousing'],
          },
          {
            title: 'Automated P&L Reporting',
            description: 'Daily profit reports delivered to Slack each morning with charts and brand-level breakdowns. Zero manual work required.',
            skills: ['Python', 'SQL', 'Data Visualization', 'Automation', 'Slack API'],
          },
          {
            title: 'Google Ads Campaigns',
            description: 'Profitably managing five-figure monthly ad spend across auto insurance, personal loans, and healthcare. One of few agencies certified for pharmaceutical advertising on Google.',
            skills: ['Google Ads', 'SEM', 'Campaign Optimization', 'Analytics'],
          },
          {
            title: 'Partnership & Sales',
            description: '5+ revenue-share partnerships sourced through cold outreach. All contract negotiations handled directly.',
            skills: ['Business Development', 'Sales', 'Contract Negotiation'],
          },
        ],
      },
      {
        name: 'EverQuote',
        role: 'Consultant',
        period: '2024 - 2025',
        projects: [
          {
            title: 'Data Architecture',
            description: 'Designed the data architecture from scratch for a new business initiative, including warehousing, reporting pipelines, and analytics infrastructure that supported scaling to $50k/day in profit.',
            skills: ['SQL', 'Data Warehousing', 'ETL/ELT', 'Data Analytics'],
          },
          {
            title: 'Growth Initiative',
            description: 'Owned the full analytics-to-optimization loop for a new initiative that scaled from $0 to $50k in daily profit: data engineering, reporting, SEM campaigns, and product decisions.',
            skills: ['SEM', 'Google Ads', 'Analytics', 'Product Management'],
          },
        ],
      },
      {
        name: 'O Positiv',
        role: 'Senior Manager, Data & Analytics',
        period: '2023 - 2024',
        projects: [
          {
            title: 'Analytics Data Warehouse',
            description: 'Designed and built O Positiv\'s first data warehouse from scratch. Star schema architecture on Snowflake with Fivetran ingestion, Airflow orchestration, and DBT transformations.',
            skills: ['SQL', 'DBT', 'Snowflake', 'Data Warehousing', 'ETL/ELT'],
          },
          {
            title: 'LTV Prediction Models',
            description: 'Built customer lifetime value prediction models across multiple methodologies. Improved 12- and 24-month forecast precision by 75%, directly informing acquisition spend decisions.',
            skills: ['Python', 'Data Science', 'Forecasting', 'Analytics'],
          },
          {
            title: 'Marketing Acquisition Dashboards',
            description: 'Built the company\'s first unified CAC and CPA dashboards, giving marketing real-time visibility into acquisition costs. Reduced weekly ad performance analysis by 8 hours.',
            skills: ['Data Visualization', 'SQL', 'Marketing Analytics', 'Business Intelligence'],
          },
          {
            title: 'A/B Testing Framework',
            description: 'Built a reusable statistical testing framework for the marketing team, automating significance calculations and result reporting. Cut per-test analysis time by 4 hours.',
            skills: ['Python', 'A/B Testing', 'Data Science', 'Automation'],
          },
        ],
      },
      {
        name: 'Koalafi',
        role: 'Manager of Sales Analytics',
        period: '2021 - 2022',
        projects: [
          {
            title: 'Star Schema & Data Vault Models',
            description: 'Designed star schema and data vault models in partnership with data engineering, built on Snowflake with DBT transformations and GitLab version control.',
            skills: ['SQL', 'DBT', 'Snowflake', 'Data Warehousing'],
          },
          {
            title: 'C-Suite Sales Analytics',
            description: 'Owned weekly sales analytics for C-suite leadership, covering pipeline velocity, conversion rates, and revenue forecasts that informed go-to-market strategy.',
            skills: ['Data Visualization', 'Business Intelligence', 'Analytics'],
          },
          {
            title: 'Automated Reporting Dashboards',
            description: 'Automated the weekly sales reporting workflow with Python pipelines feeding into Tableau dashboards. Saved 4 hours per week of manual reporting.',
            skills: ['Python', 'Tableau', 'Automation', 'Data Visualization'],
          },
          {
            title: 'Revenue Forecasting',
            description: 'Built the 2022 annual revenue forecast and monthly commission payout models, used for financial planning and sales compensation across the organization.',
            skills: ['SQL', 'Excel', 'Forecasting', 'Financial Modeling'],
          },
        ],
      },
      {
        name: 'EverQuote',
        role: 'Sr. Quantitative Analyst',
        period: '2018 - 2020',
        projects: [
          {
            title: 'New Business Unit Analytics',
            description: 'Built the analytics infrastructure and drove data-informed decisions for a new business unit from launch. The unit grew to 30% of EverQuote\'s total revenue within its first 12 months.',
            skills: ['SQL', 'Data Analytics', 'Business Intelligence'],
          },
          {
            title: 'Multi-Arm Bandit A/B Testing',
            description: 'Implemented data science model to automate A/B testing. Improved daily profit by 20% and reduced manual test monitoring by 5 hours per week.',
            skills: ['Python', 'Data Science', 'A/B Testing', 'Automation'],
          },
        ],
      },
    ],
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
    description: 'A collection of experiments, side projects, and other creative endeavors that don\'t fit neatly into other categories.',
    miscProjects: [
      {
        name: 'Catan Board Setup',
        description: 'Built on Christmas Eve because I got tired of arguing over whether the board was set up fairly. 50 pre-generated, rules-compliant layouts. Just hit shuffle and start playing.',
        siteUrl: 'https://catanboardsetup.com/',
        siteLabel: 'CatanBoardSetup.com',
        repoUrl: 'https://github.com/AdamFerguson06/catan-board-setup',
      },
    ],
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
  const [expandedProjects, setExpandedProjects] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const skillDropdownRef = useRef(null);

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
    if (selectedSkills.length === 0) return;

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

    setExpandedProjects(prev => ({ ...prev, ...newExpandedProjects }));
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
              {content.companies ? (
                <div className="modal-title-row">
                  <h2 className="modal-title">{content.title}</h2>
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
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="dropdown-icon"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
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
                              {getAllSkills(content.companies)
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
                <h2 className="modal-title">{content.title}</h2>
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
                          return (
                            <div key={projectKey} className="project-accordion-item">
                              <button
                                className={`project-accordion-header ${expandedProjects[projectKey] ? 'expanded' : ''}`}
                                onClick={() => toggleProject(projectKey)}
                                aria-expanded={expandedProjects[projectKey]}
                              >
                                <span className="project-accordion-title">{project.title}</span>
                                <svg
                                  width="14"
                                  height="14"
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
                              <AnimatePresence>
                                {expandedProjects[projectKey] && (
                                  <motion.div
                                    className="project-details"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                  >
                                    <div className="project-details-inner">
                                      <p className="project-description">{project.description}</p>
                                      <div className="project-skills">
                                        {project.skills.map((skill) => (
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
                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                              </svg>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
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
              ) : content.linkHref && (
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
