import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeftPanel from '../../components/LeftPanel/LeftPanel';

vi.mock('../../hooks/useIsMobile', () => ({ useIsMobile: vi.fn(() => false) }));

describe('LeftPanel', () => {
  const defaultProps = {
    sidebarOpen: false,
    onCloseSidebar: vi.fn(),
    portraitModalOpen: false,
    setPortraitModalOpen: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile image', () => {
    render(<LeftPanel {...defaultProps} />);
    const img = screen.getByAltText('Adam Ferguson, Ghibli-style portrait');
    expect(img).toBeInTheDocument();
  });

  it('renders profile name "Adam"', () => {
    render(<LeftPanel {...defaultProps} />);
    expect(screen.getByText('Adam')).toBeInTheDocument();
  });

  it('renders LinkedIn link', () => {
    render(<LeftPanel {...defaultProps} />);
    const link = screen.getByRole('link', { name: /linkedin/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/adam-g-ferguson/');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('portrait button exists with correct aria-label', () => {
    render(<LeftPanel {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Open profile menu' });
    expect(button).toBeInTheDocument();
  });

  it('clicking portrait when sidebar closed calls setPortraitModalOpen', async () => {
    const user = userEvent.setup();
    render(<LeftPanel {...defaultProps} sidebarOpen={false} />);
    const button = screen.getByRole('button', { name: 'Open profile menu' });
    await user.click(button);
    expect(defaultProps.setPortraitModalOpen).toHaveBeenCalledWith(true);
  });

  it('clicking portrait when sidebar open calls onCloseSidebar', async () => {
    const user = userEvent.setup();
    render(<LeftPanel {...defaultProps} sidebarOpen={true} />);
    const button = screen.getByRole('button', { name: 'Close sidebar' });
    await user.click(button);
    expect(defaultProps.onCloseSidebar).toHaveBeenCalled();
  });

  it('when portraitModalOpen=true, mobile profile menu renders', () => {
    render(<LeftPanel {...defaultProps} portraitModalOpen={true} />);
    expect(screen.getByText('Adam', { selector: '.profile-name-mobile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close profile menu' })).toBeInTheDocument();
  });

  it('clicking close in mobile profile menu sets portraitModalOpen to false', async () => {
    const user = userEvent.setup();
    render(<LeftPanel {...defaultProps} portraitModalOpen={true} />);
    const closeButton = screen.getByRole('button', { name: 'Close profile menu' });
    await user.click(closeButton);
    expect(defaultProps.setPortraitModalOpen).toHaveBeenCalledWith(false);
  });
});
