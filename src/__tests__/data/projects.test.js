import { landmarks, projects } from '../../data/projects';
import { sectionContent } from '../../data/modalContent';

describe('projects data', () => {
  it('landmarks is a non-empty array', () => {
    expect(Array.isArray(landmarks)).toBe(true);
    expect(landmarks.length).toBeGreaterThan(0);
  });

  it('every landmark has all required fields', () => {
    const requiredFields = [
      'id', 'title', 'navTarget', 'wikiUrl', 'image',
      'left', 'top', 'width', 'height',
    ];

    landmarks.forEach((landmark) => {
      requiredFields.forEach((field) => {
        expect(landmark).toHaveProperty(field);
      });
    });
  });

  it('all id values are unique', () => {
    const ids = landmarks.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all navTarget values are unique', () => {
    const navTargets = landmarks.map((l) => l.navTarget);
    expect(new Set(navTargets).size).toBe(navTargets.length);
  });

  it('all wikiUrl values start with http', () => {
    landmarks.forEach((landmark) => {
      expect(landmark.wikiUrl).toMatch(/^https?:\/\//);
    });
  });

  it('all image paths start with /map_images/', () => {
    landmarks.forEach((landmark) => {
      expect(landmark.image).toMatch(/^\/map_images\//);
    });
  });

  it('all position and dimension values are positive numbers', () => {
    landmarks.forEach((landmark) => {
      ['left', 'top', 'width', 'height'].forEach((prop) => {
        expect(typeof landmark[prop]).toBe('number');
        expect(landmark[prop]).toBeGreaterThan(0);
      });
    });
  });

  it('landmarks and projects are the same reference', () => {
    expect(landmarks).toBe(projects);
  });

  it('every landmark navTarget has a matching key in sectionContent', () => {
    landmarks.forEach((landmark) => {
      expect(sectionContent).toHaveProperty(landmark.navTarget);
    });
  });
});
