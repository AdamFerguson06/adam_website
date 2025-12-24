import { create } from 'zustand';

const useMapStore = create((set) => ({
  // Pan state
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
  
  // Zoom state
  scale: 1,
  zoomIn: () => set((state) => ({ scale: Math.min(state.scale * 1.2, 3) })),
  zoomOut: () => set((state) => ({ scale: Math.max(state.scale / 1.2, 0.5) })),
  setScale: (scale) => set({ scale }),
  
  // Modal state
  isModalOpen: false,
  activeProject: null,
  openModal: (project) => set({ isModalOpen: true, activeProject: project }),
  closeModal: () => set({ isModalOpen: false, activeProject: null }),
}));

export default useMapStore;

