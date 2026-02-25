import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RightPanel from '../../components/RightPanel/RightPanel';
import useMapStore from '../../store/useMapStore';
import { landmarks } from '../../data/projects';
import { useIsMobile } from '../../hooks/useIsMobile';

vi.mock('../../hooks/useIsMobile', () => ({ useIsMobile: vi.fn(() => false) }));

describe('RightPanel', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useIsMobile.mockReturnValue(false);
    useMapStore.setState({
      isModalOpen: false,
      activeProject: null,
      triggerElement: null,
      hoveredNavTarget: null,
      highlightAllLandmarks: false,
    });
  });

  it('renders all 4 nav items: About, Projects, Contact, Misc.', () => {
    render(<RightPanel {...defaultProps} />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Misc.')).toBeInTheDocument();
  });

  it('clicking a nav item calls openModal with matching landmark data', async () => {
    const user = userEvent.setup();
    render(<RightPanel {...defaultProps} />);
    await user.click(screen.getByText('About'));

    const state = useMapStore.getState();
    const expectedLandmark = landmarks.find(l => l.navTarget === 'about');
    expect(state.isModalOpen).toBe(true);
    expect(state.activeProject).toEqual(expectedLandmark);
  });

  it('clicking a nav item when isOpen calls onClose', async () => {
    const user = userEvent.setup();
    render(<RightPanel {...defaultProps} isOpen={true} />);
    await user.click(screen.getByText('Projects'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('star button exists', () => {
    render(<RightPanel {...defaultProps} />);
    const starButton = screen.getByRole('button', { name: 'Highlight all landmarks' });
    expect(starButton).toBeInTheDocument();
  });

  it('on desktop: star click calls setHighlightAllLandmarks(true)', async () => {
    useIsMobile.mockReturnValue(false);
    const user = userEvent.setup();
    render(<RightPanel {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Highlight all landmarks' }));

    expect(useMapStore.getState().highlightAllLandmarks).toBe(true);
  });

  it('on mobile when isOpen: star click calls onClose', async () => {
    useIsMobile.mockReturnValue(true);
    const user = userEvent.setup();
    render(<RightPanel {...defaultProps} isOpen={true} />);
    await user.click(screen.getByRole('button', { name: 'Highlight all landmarks' }));

    expect(defaultProps.onClose).toHaveBeenCalled();
    // Highlight should NOT have been set
    expect(useMapStore.getState().highlightAllLandmarks).toBe(false);
  });

  it('panel has open class when isOpen prop is true', () => {
    const { container } = render(<RightPanel {...defaultProps} isOpen={true} />);
    const panel = container.querySelector('.right-panel');
    expect(panel).toHaveClass('open');
  });

  it('nav hover on desktop: mouseenter sets hoveredNavTarget, mouseleave clears it', async () => {
    useIsMobile.mockReturnValue(false);
    const user = userEvent.setup();
    render(<RightPanel {...defaultProps} />);

    const aboutLink = screen.getByText('About');
    await user.hover(aboutLink);
    expect(useMapStore.getState().hoveredNavTarget).toBe('about');

    await user.unhover(aboutLink);
    expect(useMapStore.getState().hoveredNavTarget).toBeNull();
  });
});
