export const landmarks = [
  {
    id: 'empire-state',
    title: 'Empire State Building',
    navTarget: 'about',
    image: '/map_images/Empire State Building.png',
    // Position and dimensions from Figma
    left: 630,
    top: 127,
    width: 98,
    height: 266,
  },
  {
    id: 'one-wtc',
    title: 'One World Trade Center',
    navTarget: 'misc',
    image: '/map_images/One World Trade.png',
    left: 283.11,
    top: 564.94,
    width: 100.29,
    height: 313.57,
  },
  {
    id: 'statue-liberty',
    title: 'Statue of Liberty',
    navTarget: 'xg',
    image: '/map_images/Statue of Liberty.png',
    left: 24,
    top: 865,
    width: 115,
    height: 154,
  },
  {
    id: 'clock',
    title: 'Grand Central Clock',
    navTarget: 'projects',
    image: '/map_images/Grand Central Clock.png',
    left: 870.9,
    top: 266.6,
    width: 55.86,
    height: 97.75,
  },
  {
    id: 'walker-tower',
    title: 'Walker Tower',
    navTarget: 'contact',
    image: '/map_images/Walker Tower.png',
    left: 398.63,
    top: 276.76,
    width: 64.75,
    height: 139.65,
  },
];

// Keep backward compatibility with old name
export const projects = landmarks;
