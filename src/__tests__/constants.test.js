import { MOBILE_BREAKPOINT, MODAL_DEBOUNCE_MS } from '../constants';

describe('constants', () => {
  it('MOBILE_BREAKPOINT equals 768', () => {
    expect(MOBILE_BREAKPOINT).toBe(768);
  });

  it('MODAL_DEBOUNCE_MS equals 400', () => {
    expect(MODAL_DEBOUNCE_MS).toBe(400);
  });

  it('both constants are numbers', () => {
    expect(typeof MOBILE_BREAKPOINT).toBe('number');
    expect(typeof MODAL_DEBOUNCE_MS).toBe('number');
  });
});
