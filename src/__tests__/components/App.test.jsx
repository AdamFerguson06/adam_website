import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import App from '../../App';
import useMapStore from '../../store/useMapStore';
import { landmarks } from '../../data/projects';

// Mock agentation to prevent dynamic import errors in test
vi.mock('agentation', () => ({ Agentation: () => null }));

describe('App', () => {
  beforeEach(() => {
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

  it('renders without crashing (smoke test)', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders the map container', () => {
    render(<App />);
    const mapImage = screen.getByAltText('Manhattan Map');
    expect(mapImage).toBeInTheDocument();
  });

  it('renders all 5 landmarks from the data', () => {
    render(<App />);
    landmarks.forEach((landmark) => {
      const button = screen.getByLabelText(`View ${landmark.title}`);
      expect(button).toBeInTheDocument();
    });
    // Verify we have exactly 5
    const landmarkButtons = screen.getAllByRole('button', { name: /^View / });
    expect(landmarkButtons).toHaveLength(5);
  });

  it('renders the LeftPanel', () => {
    render(<App />);
    // LeftPanel contains the profile name "Adam"
    expect(screen.getByText('Adam')).toBeInTheDocument();
  });

  it('renders the RightPanel navigation', () => {
    render(<App />);
    // RightPanel nav links are <a> elements with class "nav-link"
    const navLinks = screen.getAllByRole('link').filter(el => el.classList.contains('nav-link'));
    const navLabels = navLinks.map(el => el.textContent);
    expect(navLabels).toEqual(expect.arrayContaining(['About', 'Projects', 'Contact', 'Misc.']));
    expect(navLinks).toHaveLength(4);
  });

  it('renders the mobile star button', () => {
    render(<App />);
    // The mobile star button has aria-label "Toggle menu" when modal is closed
    const starButton = screen.getByLabelText('Toggle menu');
    expect(starButton).toBeInTheDocument();
  });

  it('clicking a landmark opens the modal (integration test)', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click the "About" landmark (Empire State Building)
    const aboutButton = screen.getByLabelText(`View ${landmarks[0].title}`);
    await user.click(aboutButton);

    // Modal should open — verify dialog appears with the about section title
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // "About Me" also appears in the landmark tooltip, so scope the query to the dialog
    expect(within(dialog).getByText('About Me')).toBeInTheDocument();
  });
});
