import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ChevronIcon from '../../../components/icons/ChevronIcon';
import ExternalLinkIcon from '../../../components/icons/ExternalLinkIcon';
import CloseIcon from '../../../components/icons/CloseIcon';

describe('ChevronIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<ChevronIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('accepts className and style props', () => {
    const { container } = render(
      <ChevronIcon className="custom-class" style={{ color: 'red' }} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
    expect(svg).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});

describe('ExternalLinkIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<ExternalLinkIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('uses default size of 16', () => {
    const { container } = render(<ExternalLinkIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('accepts a custom size prop', () => {
    const { container } = render(<ExternalLinkIcon size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });
});

describe('CloseIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<CloseIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

describe('All icons', () => {
  it('render without crashing', () => {
    const { unmount: u1 } = render(<ChevronIcon />);
    const { unmount: u2 } = render(<ExternalLinkIcon />);
    const { unmount: u3 } = render(<CloseIcon />);
    // If we reach here without throwing, all icons rendered successfully
    u1();
    u2();
    u3();
  });
});
