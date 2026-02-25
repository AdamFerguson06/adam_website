import { sectionContent } from '../../data/modalContent';

describe('modalContent data', () => {
  it('sectionContent has all expected keys', () => {
    const expectedKeys = ['about', 'projects', 'contact', 'misc', 'xg'];
    expectedKeys.forEach((key) => {
      expect(sectionContent).toHaveProperty(key);
    });
  });

  it('every section has title and description strings', () => {
    Object.values(sectionContent).forEach((section) => {
      expect(typeof section.title).toBe('string');
      expect(section.title.length).toBeGreaterThan(0);
      expect(typeof section.description).toBe('string');
      expect(section.description.length).toBeGreaterThan(0);
    });
  });

  it('about section has a longDescription string', () => {
    expect(typeof sectionContent.about.longDescription).toBe('string');
    expect(sectionContent.about.longDescription.length).toBeGreaterThan(0);
  });

  it('projects section has companies array with required fields', () => {
    const { companies } = sectionContent.projects;
    expect(Array.isArray(companies)).toBe(true);
    expect(companies.length).toBeGreaterThan(0);

    companies.forEach((company) => {
      expect(typeof company.name).toBe('string');
      expect(typeof company.role).toBe('string');
      expect(typeof company.period).toBe('string');
      expect(Array.isArray(company.projects)).toBe(true);
      expect(company.projects.length).toBeGreaterThan(0);
    });
  });

  it('every project within companies has title and description', () => {
    sectionContent.projects.companies.forEach((company) => {
      company.projects.forEach((project) => {
        expect(typeof project.title).toBe('string');
        expect(project.title.length).toBeGreaterThan(0);
        expect(typeof project.description).toBe('string');
        expect(project.description.length).toBeGreaterThan(0);
      });
    });
  });

  it('every project with skills has a non-empty array', () => {
    sectionContent.projects.companies.forEach((company) => {
      company.projects.forEach((project) => {
        if (project.skills !== undefined) {
          expect(Array.isArray(project.skills)).toBe(true);
          expect(project.skills.length).toBeGreaterThan(0);
          project.skills.forEach((skill) => {
            expect(typeof skill).toBe('string');
          });
        }
      });
    });
  });

  it('contact section has contactInfo with required fields', () => {
    const { contactInfo } = sectionContent.contact;
    expect(contactInfo).toBeDefined();
    expect(typeof contactInfo.businessEmail).toBe('string');
    expect(typeof contactInfo.personalEmail).toBe('string');
    expect(typeof contactInfo.calendar).toBe('string');
  });

  it('misc section has miscProjects array with name and description', () => {
    const { miscProjects } = sectionContent.misc;
    expect(Array.isArray(miscProjects)).toBe(true);
    expect(miscProjects.length).toBeGreaterThan(0);

    miscProjects.forEach((project) => {
      expect(typeof project.name).toBe('string');
      expect(project.name.length).toBeGreaterThan(0);
      expect(typeof project.description).toBe('string');
      expect(project.description.length).toBeGreaterThan(0);
    });
  });

  it('links in miscProjects are valid URLs when present', () => {
    sectionContent.misc.miscProjects.forEach((project) => {
      if (project.siteUrl) {
        expect(project.siteUrl).toMatch(/^https?:\/\//);
      }
      if (project.repoUrl) {
        expect(project.repoUrl).toMatch(/^https?:\/\//);
      }
    });
  });

  it('every company project links (when present) has label and url', () => {
    sectionContent.projects.companies.forEach((company) => {
      company.projects.forEach((project) => {
        if (project.links !== undefined) {
          expect(Array.isArray(project.links)).toBe(true);
          project.links.forEach((link) => {
            expect(typeof link.label).toBe('string');
            expect(link.label.length).toBeGreaterThan(0);
            expect(typeof link.url).toBe('string');
            expect(link.url).toMatch(/^https?:\/\//);
          });
        }
      });
    });
  });
});
