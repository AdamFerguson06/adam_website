import { create } from 'zustand';

const useMapStore = create((set) => ({
  // Modal state
  isModalOpen: false,
  activeProject: null,
  triggerElement: null,
  openModal: (project, triggerEl) => set({
    isModalOpen: true,
    activeProject: project,
    triggerElement: triggerEl || null
  }),
  closeModal: () => set({
    isModalOpen: false,
    activeProject: null,
    triggerElement: null
  }),

  // Hover state for nav-landmark sync (desktop only)
  hoveredNavTarget: null,
  setHoveredNavTarget: (navTarget) => set({ hoveredNavTarget: navTarget }),

  // Highlight all landmarks state (desktop star click)
  highlightAllLandmarks: false,
  setHighlightAllLandmarks: (highlight) => set({ highlightAllLandmarks: highlight }),
}));

export default useMapStore;
