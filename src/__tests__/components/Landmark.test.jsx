import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Landmark from '../../components/Map/Landmark';
import useMapStore from '../../store/useMapStore';

vi.mock('../../hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => false),
}));

const mockLandmark = {
  id: 'test-landmark',
  title: 'Test Building',
  tooltipLabel: 'Test Tooltip',
  navTarget: 'test',
  wikiUrl: 'https://example.com',
  image: '/map_images/test.png',
  left: 100,
  top: 200,
  width: 50,
  height: 80,
};

describe('Landmark', () => {
  beforeEach(() => {
    useMapStore.setState({
      isModalOpen: false,
      activeProject: null,
      triggerElement: null,
      hoveredNavTarget: null,
      highlightAllLandmarks: false,
    });
  });

  it('renders a button with correct aria-label', () => {
    render(<Landmark landmark={mockLandmark} scale={1} />);
    const button = screen.getByRole('button', { name: `View ${mockLandmark.title}` });
    expect(button).toBeInTheDocument();
  });

  it('applies scaled positioning based on scale prop', () => {
    const scale = 2;
    render(<Landmark landmark={mockLandmark} scale={scale} />);
    const button = screen.getByRole('button');
    expect(button.style.left).toBe(`${mockLandmark.left * scale}px`);
    expect(button.style.top).toBe(`${mockLandmark.top * scale}px`);
    expect(button.style.width).toBe(`${mockLandmark.width * scale}px`);
    expect(button.style.height).toBe(`${mockLandmark.height * scale}px`);
  });

  it('renders landmark image with correct src', () => {
    render(<Landmark landmark={mockLandmark} scale={1} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockLandmark.image);
  });

  it('renders tooltip with tooltipLabel text', () => {
    render(<Landmark landmark={mockLandmark} scale={1} />);
    expect(screen.getByText(mockLandmark.tooltipLabel)).toBeInTheDocument();
  });

  it('clicking the landmark calls openModal with the landmark data', async () => {
    render(<Landmark landmark={mockLandmark} scale={1} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);

    const state = useMapStore.getState();
    expect(state.isModalOpen).toBe(true);
    expect(state.activeProject).toEqual(mockLandmark);
  });

  it('click event calls stopPropagation', () => {
    render(<Landmark landmark={mockLandmark} scale={1} />);
    const button = screen.getByRole('button');

    const clickEvent = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
    button.dispatchEvent(clickEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('on desktop, mouseenter/mouseleave adds and removes hovered class', () => {
    render(<Landmark landmark={mockLandmark} scale={1} />);
    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('hovered');

    fireEvent.mouseEnter(button);
    expect(button).toHaveClass('hovered');

    fireEvent.mouseLeave(button);
    expect(button).not.toHaveClass('hovered');
  });

  it('when hoveredNavTarget matches landmark.navTarget, hovered class appears', () => {
    render(<Landmark landmark={mockLandmark} scale={1} />);
    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('hovered');

    act(() => {
      useMapStore.setState({ hoveredNavTarget: mockLandmark.navTarget });
    });

    expect(button).toHaveClass('hovered');
  });

  it('when highlightAllLandmarks is true, hovered class appears', () => {
    useMapStore.setState({ highlightAllLandmarks: true });
    render(<Landmark landmark={mockLandmark} scale={1} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hovered');
  });
});
