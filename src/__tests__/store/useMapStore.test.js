import useMapStore from '../../store/useMapStore';

describe('useMapStore', () => {
  beforeEach(() => {
    useMapStore.setState({
      isModalOpen: false,
      activeProject: null,
      triggerElement: null,
      hoveredNavTarget: null,
      highlightAllLandmarks: false,
    });
  });

  it('has correct initial defaults', () => {
    const state = useMapStore.getState();
    expect(state.isModalOpen).toBe(false);
    expect(state.activeProject).toBeNull();
    expect(state.triggerElement).toBeNull();
    expect(state.hoveredNavTarget).toBeNull();
    expect(state.highlightAllLandmarks).toBe(false);
  });

  it('openModal sets isModalOpen, activeProject, and triggerElement', () => {
    const project = { id: 'test', title: 'Test Project' };
    const triggerEl = document.createElement('button');

    useMapStore.getState().openModal(project, triggerEl);

    const state = useMapStore.getState();
    expect(state.isModalOpen).toBe(true);
    expect(state.activeProject).toBe(project);
    expect(state.triggerElement).toBe(triggerEl);
  });

  it('openModal without triggerEl sets triggerElement to null', () => {
    const project = { id: 'test', title: 'Test Project' };

    useMapStore.getState().openModal(project);

    const state = useMapStore.getState();
    expect(state.isModalOpen).toBe(true);
    expect(state.activeProject).toBe(project);
    expect(state.triggerElement).toBeNull();
  });

  it('closeModal resets isModalOpen, activeProject, and triggerElement', () => {
    const project = { id: 'test', title: 'Test Project' };
    const triggerEl = document.createElement('button');
    useMapStore.getState().openModal(project, triggerEl);

    useMapStore.getState().closeModal();

    const state = useMapStore.getState();
    expect(state.isModalOpen).toBe(false);
    expect(state.activeProject).toBeNull();
    expect(state.triggerElement).toBeNull();
  });

  it('closeModal after openModal returns to initial state values', () => {
    const project = { id: 'test', title: 'Test Project' };
    useMapStore.getState().openModal(project, document.createElement('div'));
    useMapStore.getState().closeModal();

    const state = useMapStore.getState();
    expect(state.isModalOpen).toBe(false);
    expect(state.activeProject).toBeNull();
    expect(state.triggerElement).toBeNull();
    expect(state.hoveredNavTarget).toBeNull();
    expect(state.highlightAllLandmarks).toBe(false);
  });

  it('setHoveredNavTarget sets hoveredNavTarget', () => {
    useMapStore.getState().setHoveredNavTarget('projects');

    expect(useMapStore.getState().hoveredNavTarget).toBe('projects');
  });

  it('setHoveredNavTarget(null) clears hoveredNavTarget', () => {
    useMapStore.getState().setHoveredNavTarget('projects');
    useMapStore.getState().setHoveredNavTarget(null);

    expect(useMapStore.getState().hoveredNavTarget).toBeNull();
  });

  it('setHighlightAllLandmarks(true) enables highlight', () => {
    useMapStore.getState().setHighlightAllLandmarks(true);

    expect(useMapStore.getState().highlightAllLandmarks).toBe(true);
  });

  it('setHighlightAllLandmarks(false) disables highlight', () => {
    useMapStore.getState().setHighlightAllLandmarks(true);
    useMapStore.getState().setHighlightAllLandmarks(false);

    expect(useMapStore.getState().highlightAllLandmarks).toBe(false);
  });

  it('multiple rapid state changes maintain consistency', () => {
    const project1 = { id: 'p1', title: 'Project 1' };
    const project2 = { id: 'p2', title: 'Project 2' };

    useMapStore.getState().openModal(project1);
    useMapStore.getState().setHoveredNavTarget('about');
    useMapStore.getState().setHighlightAllLandmarks(true);
    useMapStore.getState().closeModal();
    useMapStore.getState().openModal(project2);
    useMapStore.getState().setHoveredNavTarget('contact');

    const state = useMapStore.getState();
    expect(state.isModalOpen).toBe(true);
    expect(state.activeProject).toBe(project2);
    expect(state.hoveredNavTarget).toBe('contact');
    expect(state.highlightAllLandmarks).toBe(true);
  });
});
