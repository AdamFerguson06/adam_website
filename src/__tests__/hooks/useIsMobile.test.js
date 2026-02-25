import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../../hooks/useIsMobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;

  function setWindowWidth(width) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  }

  afterEach(() => {
    setWindowWidth(originalInnerWidth);
  });

  it('returns true when window.innerWidth equals the breakpoint (768)', () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns true when window.innerWidth is below the breakpoint (500)', () => {
    setWindowWidth(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false when window.innerWidth is above the breakpoint (1024)', () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('responds to resize from desktop to mobile', () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      setWindowWidth(500);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);
  });

  it('responds to resize from mobile to desktop', () => {
    setWindowWidth(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    act(() => {
      setWindowWidth(1024);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(false);
  });

  it('cleans up event listener on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    setWindowWidth(1024);
    const { unmount } = renderHook(() => useIsMobile());

    const resizeHandler = addSpy.mock.calls.find(
      (call) => call[0] === 'resize'
    )?.[1];
    expect(resizeHandler).toBeDefined();

    unmount();

    const removeCall = removeSpy.mock.calls.find(
      (call) => call[0] === 'resize' && call[1] === resizeHandler
    );
    expect(removeCall).toBeDefined();

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
