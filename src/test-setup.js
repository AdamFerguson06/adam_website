import '@testing-library/jest-dom';
import React from 'react';

// Mock window.matchMedia (jsdom lacks it)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (framer-motion may reference it)
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock framer-motion to avoid animation issues in jsdom.
// Without this, AnimatePresence exit animations keep closed components in the DOM.
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy({}, {
      get: (_, tag) => {
        // eslint-disable-next-line no-unused-vars
        const Component = React.forwardRef(({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }, ref) => {
          const Tag = typeof tag === 'string' ? tag : 'div';
          return React.createElement(Tag, { ...props, ref }, children);
        });
        Component.displayName = `motion.${String(tag)}`;
        return Component;
      },
    }),
  };
});
