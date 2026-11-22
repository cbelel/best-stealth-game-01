export const LEVELS = [
  {
    id: 1,
    name: "Level 1: The Vestibule",
    playerStart: { x: 100, y: 360 },
    exit: { x: 1180, y: 360, width: 40, height: 80 },
    relics: [
      { x: 500, y: 160, collected: false },
      { x: 800, y: 560, collected: false },
      { x: 1000, y: 200, collected: false }
    ],
    walls: [
      // Outer boundaries
      { x: 0, y: 0, w: 1280, h: 40 },
      { x: 0, y: 680, w: 1280, h: 40 },
      { x: 0, y: 0, w: 40, h: 720 },
      { x: 1240, y: 0, w: 40, h: 720 },
      // Internal walls / partitions
      { x: 360, y: 40, w: 40, h: 260 },
      { x: 360, y: 460, w: 40, h: 220 },
      { x: 760, y: 200, w: 40, h: 320 }
    ],
    cover: [
      { x: 200, y: 200, w: 80, h: 80, type: 'crate' },
      { x: 200, y: 480, w: 80, h: 80, type: 'crate' },
      { x: 540, y: 120, w: 120, h: 60, type: 'bookshelf' },
      { x: 540, y: 540, w: 120, h: 60, type: 'bookshelf' },
      { x: 920, y: 340, w: 60, h: 120, type: 'pillar' }
    ],
    shadows: [
      { x: 160, y: 40, w: 160, h: 280 },
      { x: 600, y: 40, w: 160, h: 200 },
      { x: 800, y: 440, w: 200, h: 240 }
    ],
    lamps: [
      { x: 200, y: 360, radius: 180, intensity: 0.9 },
      { x: 640, y: 360, radius: 220, intensity: 1.0 },
      { x: 1100, y: 360, radius: 180, intensity: 0.8 }
    ],
    guards: [
      {
        x: 480, y: 160,
        waypoints: [{x: 480, y: 160}, {x: 480, y: 560}],
        currentWaypoint: 0,
        speed: 70
      },
      {
        x: 900, y: 560,
        waypoints: [{x: 900, y: 560}, {x: 900, y: 160}],
        currentWaypoint: 0,
        speed: 70
      }
    ]
  },
  {
    id: 2,
    name: "Level 2: The Gallery of Echoes",
    playerStart: { x: 80, y: 640 },
    exit: { x: 1180, y: 80, width: 40, height: 80 },
    relics: [
      { x: 300, y: 120, collected: false },
      { x: 700, y: 360, collected: false },
      { x: 1100, y: 600, collected: false }
    ],
    walls: [
      { x: 0, y: 0, w: 1280, h: 40 },
      { x: 0, y: 680, w: 1280, h: 40 },
      { x: 0, y: 0, w: 40, h: 720 },
      { x: 1240, y: 0, w: 40, h: 720 },
      { x: 240, y: 160, w: 40, h: 400 },
      { x: 560, y: 160, w: 40, h: 400 },
      { x: 880, y: 160, w: 40, h: 400 }
    ],
    cover: [
      { x: 120, y: 300, w: 60, h: 120, type: 'bookshelf' },
      { x: 380, y: 120, w: 100, h: 60, type: 'crate' },
      { x: 380, y: 540, w: 100, h: 60, type: 'crate' },
      { x: 700, y: 120, w: 100, h: 60, type: 'bookshelf' },
      { x: 700, y: 540, w: 100, h: 60, type: 'bookshelf' },
      { x: 1020, y: 300, w: 60, h: 120, type: 'pillar' }
    ],
    shadows: [
      { x: 40, y: 40, w: 200, h: 200 },
      { x: 280, y: 400, w: 280, h: 280 },
      { x: 920, y: 40, w: 320, h: 240 }
    ],
    lamps: [
      { x: 160, y: 360, radius: 160, intensity: 0.8 },
      { x: 480, y: 360, radius: 180, intensity: 0.9 },
      { x: 800, y: 360, radius: 180, intensity: 0.9 },
      { x: 1120, y: 360, radius: 160, intensity: 0.8 }
    ],
    guards: [
      {
        x: 160, y: 200,
        waypoints: [{x: 160, y: 200}, {x: 160, y: 520}],
        currentWaypoint: 0,
        speed: 80
      },
      {
        x: 640, y: 520,
        waypoints: [{x: 640, y: 520}, {x: 640, y: 200}],
        currentWaypoint: 0,
        speed: 80
      },
      {
        x: 1040, y: 200,
        waypoints: [{x: 1040, y: 200}, {x: 1040, y: 520}],
        currentWaypoint: 0,
        speed: 85
      }
    ]
  },
  {
    id: 3,
    name: "Level 3: The Vault of Ages",
    playerStart: { x: 640, y: 640 },
    exit: { x: 640, y: 60, width: 40, height: 80 },
    relics: [
      { x: 160, y: 120, collected: false },
      { x: 1120, y: 120, collected: false },
      { x: 640, y: 360, collected: false }
    ],
    walls: [
      { x: 0, y: 0, w: 1280, h: 40 },
      { x: 0, y: 680, w: 1280, h: 40 },
      { x: 0, y: 0, w: 40, h: 720 },
      { x: 1240, y: 0, w: 40, h: 720 },
      { x: 280, y: 240, w: 200, h: 40 },
      { x: 800, y: 240, w: 200, h: 40 },
      { x: 440, y: 480, w: 400, h: 40 }
    ],
    cover: [
      { x: 160, y: 320, w: 80, h: 80, type: 'crate' },
      { x: 1040, y: 320, w: 80, h: 80, type: 'crate' },
      { x: 560, y: 140, w: 160, h: 60, type: 'bookshelf' },
      { x: 560, y: 580, w: 160, h: 60, type: 'bookshelf' },
      { x: 320, y: 580, w: 60, h: 60, type: 'pillar' },
      { x: 900, y: 580, w: 60, h: 60, type: 'pillar' }
    ],
    shadows: [
      { x: 40, y: 40, w: 240, h: 200 },
      { x: 1000, y: 40, w: 240, h: 200 },
      { x: 40, y: 520, w: 240, h: 160 },
      { x: 1000, y: 520, w: 240, h: 160 },
      { x: 540, y: 280, w: 200, h: 160 }
    ],
    lamps: [
      { x: 360, y: 140, radius: 180, intensity: 0.9 },
      { x: 920, y: 140, radius: 180, intensity: 0.9 },
      { x: 200, y: 580, radius: 160, intensity: 0.8 },
      { x: 1080, y: 580, radius: 160, intensity: 0.8 },
      { x: 640, y: 360, radius: 240, intensity: 1.0 }
    ],
    guards: [
      {
        x: 200, y: 160,
        waypoints: [{x: 200, y: 160}, {x: 1080, y: 160}],
        currentWaypoint: 0,
        speed: 85
      },
      {
        x: 1080, y: 560,
        waypoints: [{x: 1080, y: 560}, {x: 200, y: 560}],
        currentWaypoint: 0,
        speed: 85
      },
      {
        x: 640, y: 200,
        waypoints: [{x: 640, y: 200}, {x: 640, y: 600}],
        currentWaypoint: 0,
        speed: 90
      },
      {
        x: 400, y: 360,
        waypoints: [{x: 400, y: 360}, {x: 880, y: 360}],
        currentWaypoint: 0,
        speed: 90
      }
    ]
  }
];
