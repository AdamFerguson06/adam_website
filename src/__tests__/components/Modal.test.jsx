import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import Modal from '../../components/Modal/Modal';
import useMapStore from '../../store/useMapStore';
import { landmarks } from '../../data/projects';
import { sectionContent } from '../../data/modalContent';

// Helpers to find landmarks by navTarget
const aboutLandmark = landmarks.find(l => l.navTarget === 'about');
const projectsLandmark = landmarks.find(l => l.navTarget === 'projects');
const contactLandmark = landmarks.find(l => l.navTarget === 'contact');
const miscLandmark = landmarks.find(l => l.navTarget === 'misc');

/** Render Modal and open it with a given landmark in one step. */
const renderAndOpen = (landmark) => {
  const result = render(<Modal />);
  act(() => {
    useMapStore.getState().openModal(landmark);
  });
  return result;
};

describe('Modal', () => {
  beforeEach(() => {
    // Reset the Zustand store to initial state
    act(() => {
      useMapStore.setState({
        isModalOpen: false,
        activeProject: null,
        triggerElement: null,
        hoveredNavTarget: null,
        highlightAllLandmarks: false,
      });
    });
  });

  // --- Rendering ---

  describe('Rendering', () => {
    it('is not rendered when isModalOpen is false', () => {
      render(<Modal />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows about section title and description when opened with about landmark', async () => {
      render(<Modal />);
      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      expect(await screen.findByText('About Me')).toBeInTheDocument();
      expect(screen.getByText(sectionContent.about.description)).toBeInTheDocument();
    });

    it('shows company cards when opened with projects landmark', async () => {
      renderAndOpen(projectsLandmark);

      expect(await screen.findByText('My Projects')).toBeInTheDocument();
      // Check that company names appear
      expect(screen.getByText('Falcon Media')).toBeInTheDocument();
      // EverQuote appears twice (two different roles), so use getAllByText
      expect(screen.getAllByText('EverQuote')).toHaveLength(2);
      expect(screen.getByText('O Positiv')).toBeInTheDocument();
      expect(screen.getByText('Koalafi')).toBeInTheDocument();
    });

    it('shows contact info when opened with contact landmark', async () => {
      render(<Modal />);
      act(() => {
        useMapStore.getState().openModal(contactLandmark);
      });

      expect(await screen.findByText('Get in Touch')).toBeInTheDocument();
      expect(screen.getByText('adam@falconmedia.group')).toBeInTheDocument();
      expect(screen.getByText('adam.ferguson06@gmail.com')).toBeInTheDocument();
    });

    it('shows misc projects when opened with misc landmark', async () => {
      render(<Modal />);
      act(() => {
        useMapStore.getState().openModal(miscLandmark);
      });

      expect(await screen.findByText('Miscellaneous')).toBeInTheDocument();
      expect(screen.getByText('Catan Board Setup')).toBeInTheDocument();
    });
  });

  // --- Accessibility ---

  describe('Accessibility', () => {
    it('has role="dialog" and aria-modal="true"', async () => {
      render(<Modal />);
      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      const dialog = await screen.findByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('closes the modal when Escape is pressed', async () => {
      const user = userEvent.setup();
      render(<Modal />);

      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(useMapStore.getState().isModalOpen).toBe(false);
      });
    });

    it('closes the modal when clicking the overlay', async () => {
      const user = userEvent.setup();
      render(<Modal />);

      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // The overlay is the modal-overlay div (the parent of the dialog)
      const overlay = screen.getByRole('dialog').parentElement;
      await user.click(overlay);

      await waitFor(() => {
        expect(useMapStore.getState().isModalOpen).toBe(false);
      });
    });

    it('does NOT close the modal when clicking inside it', async () => {
      const user = userEvent.setup();
      render(<Modal />);

      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      const dialog = await screen.findByRole('dialog');
      await user.click(dialog);

      // Modal should still be open
      expect(useMapStore.getState().isModalOpen).toBe(true);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // --- Projects Section ---

  describe('Projects Section', () => {
    it('Expand All button expands all project accordions', async () => {
      renderAndOpen(projectsLandmark);
      const user = userEvent.setup();

      // Wait for modal to be present
      await screen.findByText('My Projects');

      // Click Expand All (there may be multiple due to mobile-filter-actions)
      const expandButtons = screen.getAllByText('Expand All');
      await user.click(expandButtons[0]);

      // All project accordion headers should now be expanded
      await waitFor(() => {
        const expandedHeaders = screen.getAllByRole('button', { expanded: true })
          .filter(btn => btn.classList.contains('project-accordion-header'));
        // There should be expanded headers for all projects across all companies
        expect(expandedHeaders.length).toBeGreaterThan(0);
      });
    });

    it('Collapse All button collapses all project accordions', async () => {
      renderAndOpen(projectsLandmark);
      const user = userEvent.setup();

      await screen.findByText('My Projects');

      // First expand all
      const expandButtons = screen.getAllByText('Expand All');
      await user.click(expandButtons[0]);

      // Now we should see "Collapse All"
      const collapseButtons = await screen.findAllByText('Collapse All');
      await user.click(collapseButtons[0]);

      // All project accordion headers should now be collapsed
      await waitFor(() => {
        const expandedHeaders = screen.queryAllByRole('button', { expanded: true })
          .filter(btn => btn.classList.contains('project-accordion-header'));
        expect(expandedHeaders.length).toBe(0);
      });
    });

    it('individual project accordion toggle works', async () => {
      renderAndOpen(projectsLandmark);
      const user = userEvent.setup();

      await screen.findByText('My Projects');

      // Find the first project accordion header by its title
      const firstProjectTitle = sectionContent.projects.companies[0].projects[0].title;

      const getHeader = () => screen.getByText(firstProjectTitle).closest('button');

      // Should start collapsed
      expect(getHeader()).toHaveAttribute('aria-expanded', 'false');

      // Click to expand
      await user.click(getHeader());

      await waitFor(() => {
        expect(getHeader()).toHaveAttribute('aria-expanded', 'true');
      });

      // Click to collapse
      await user.click(getHeader());

      await waitFor(() => {
        expect(getHeader()).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  // --- Skill Filtering ---

  describe('Skill Filtering', () => {
    it('skill filter dropdown opens on click', async () => {
      renderAndOpen(projectsLandmark);
      const user = userEvent.setup();

      await screen.findByText('My Projects');

      const filterToggle = screen.getByText('Filter by skill');
      await user.click(filterToggle);

      // The dropdown menu should appear with skill options
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search skills...')).toBeInTheDocument();
      });
    });

    it('selecting a skill auto-expands matching projects', async () => {
      renderAndOpen(projectsLandmark);
      const user = userEvent.setup();

      await screen.findByText('My Projects');

      // Open the skill filter dropdown
      const filterToggle = screen.getByText('Filter by skill');
      await user.click(filterToggle);

      // Wait for dropdown to appear
      await screen.findByPlaceholderText('Search skills...');

      // Find a skill checkbox — "React" is used in Falcon Media projects
      const reactLabel = screen.getByText('React');
      await user.click(reactLabel);

      // Projects with "React" skill should be auto-expanded
      await waitFor(() => {
        const expandedHeaders = screen.getAllByRole('button', { expanded: true })
          .filter(btn => btn.classList.contains('project-accordion-header'));
        expect(expandedHeaders.length).toBeGreaterThan(0);
      });
    });

    it('Clear button removes all selected skills', async () => {
      renderAndOpen(projectsLandmark);
      const user = userEvent.setup();

      await screen.findByText('My Projects');

      // Open the skill filter dropdown and select a skill
      const filterToggle = screen.getByText('Filter by skill');
      await user.click(filterToggle);

      await screen.findByPlaceholderText('Search skills...');

      const reactLabel = screen.getByText('React');
      await user.click(reactLabel);

      // Wait for the skill to be selected (toggle text changes)
      await waitFor(() => {
        expect(screen.getByText(/1 skill selected/)).toBeInTheDocument();
      });

      // Close the dropdown first by clicking the toggle again, so the Clear
      // button click doesn't interact with the dropdown's outside-click handler
      await user.click(screen.getByText(/1 skill selected/).closest('button'));

      // "Clear" button should appear outside the dropdown (class="skill-filter-clear")
      const clearButtons = screen.getAllByRole('button').filter(
        btn => btn.classList.contains('skill-filter-clear') && btn.textContent === 'Clear'
      );
      expect(clearButtons.length).toBeGreaterThan(0);
      await user.click(clearButtons[0]);

      // Skills should be cleared — filter toggle should show "Filter by skill" again
      await waitFor(() => {
        expect(screen.getByText('Filter by skill')).toBeInTheDocument();
      });

      // Expanded projects should collapse
      await waitFor(() => {
        const expandedHeaders = screen.queryAllByRole('button', { expanded: true })
          .filter(btn => btn.classList.contains('project-accordion-header'));
        expect(expandedHeaders.length).toBe(0);
      });
    });
  });

  // --- About Section ---

  describe('About Section', () => {
    it('"Read More" button expands long description', async () => {
      const user = userEvent.setup();
      render(<Modal />);

      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      await screen.findByText('About Me');

      const readMoreButton = screen.getByText('Read More');
      await user.click(readMoreButton);

      // The long description should now be visible
      await waitFor(() => {
        // Check for a paragraph from the long description
        expect(screen.getByText(/I started my career at EverQuote/)).toBeInTheDocument();
      });
    });

    it('"Show Less" button collapses long description', async () => {
      const user = userEvent.setup();
      render(<Modal />);

      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      await screen.findByText('About Me');

      // First expand
      const readMoreButton = screen.getByText('Read More');
      await user.click(readMoreButton);

      // Then collapse
      const showLessButton = await screen.findByText('Show Less');
      await user.click(showLessButton);

      await waitFor(() => {
        expect(screen.queryByText(/I started my career at EverQuote/)).not.toBeInTheDocument();
      });
    });
  });

  // --- Contact Section ---

  describe('Contact Section', () => {
    it('business and personal email links render with mailto: hrefs', async () => {
      render(<Modal />);

      act(() => {
        useMapStore.getState().openModal(contactLandmark);
      });

      await screen.findByText('Get in Touch');

      const businessLink = screen.getByText('adam@falconmedia.group');
      expect(businessLink.closest('a')).toHaveAttribute('href', 'mailto:adam@falconmedia.group');

      const personalLink = screen.getByText('adam.ferguson06@gmail.com');
      expect(personalLink.closest('a')).toHaveAttribute('href', 'mailto:adam.ferguson06@gmail.com');
    });
  });

  // --- State Reset ---

  describe('State Reset', () => {
    it('closing modal resets expanded state', async () => {
      const user = userEvent.setup();
      render(<Modal />);

      // Open with about and expand long description
      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      await screen.findByText('About Me');
      const readMoreButton = screen.getByText('Read More');
      await user.click(readMoreButton);

      // Verify it's expanded
      await waitFor(() => {
        expect(screen.getByText(/I started my career at EverQuote/)).toBeInTheDocument();
      });

      // Close the modal
      act(() => {
        useMapStore.getState().closeModal();
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Re-open the modal — expanded state should be reset
      act(() => {
        useMapStore.getState().openModal(aboutLandmark);
      });

      await screen.findByText('About Me');

      // "Read More" should show (not "Show Less"), meaning it was reset
      expect(screen.getByText('Read More')).toBeInTheDocument();
      expect(screen.queryByText(/I started my career at EverQuote/)).not.toBeInTheDocument();
    });
  });
});
