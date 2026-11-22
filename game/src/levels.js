export const LEVELS = [
  {
    id: 1,
    name: "The Vestibule",
    playerStart: { x: 100, y: 360 },
    exit: { x: 830, y: 340, width: 40, height: 80 }, // clear of right wall (starts at 900) by 70px
    relics: [
      { x: 420, y: 160, collected: false, name: "Jade Amulet" },
      { x: 680, y: 560, collected: false, name: "Golden Chalice" },
      { x: 800, y: 200, collected: false, name: "Obsidian Mask" }
    ],
    walls: [
      { x: 40, y: 44, w: 860, h: 30 },
      { x: 40, y: 650, w: 860, h: 30 },
      { x: 40, y: 44, w: 30, h: 636 },
      { x: 900, y: 44, w: 30, h: 636 },
      { x: 300, y: 74, w: 30, h: 220 },
      { x: 300, y: 430, w: 30, h: 220 },
      { x: 580, y: 180, w: 30, h: 320 }
    ],
    cover: [
      { x: 160, y: 180, w: 70, h: 70, type: 'crate' },
      { x: 160, y: 450, w: 70, h: 70, type: 'crate' },
      { x: 400, y: 100, w: 100, h: 50, type: 'bookshelf' },
      { x: 400, y: 530, w: 100, h: 50, type: 'bookshelf' },
      { x: 700, y: 320, w: 50, h: 100, type: 'pillar' },
      { x: 470, y: 470, w: 100, h: 50, type: 'display' },
      { x: 90, y: 540, w: 70, h: 70, type: 'crate' },
      { x: 90, y: 90, w: 100, h: 50, type: 'bookshelf' }
    ],
    shadows: [
      { x: 120, y: 74, w: 150, h: 240 },
      { x: 440, y: 74, w: 120, h: 180 },
      { x: 630, y: 420, w: 180, h: 230 }
    ],
    lamps: [
      { x: 180, y: 360, radius: 150, intensity: 0.9 },
      { x: 480, y: 360, radius: 180, intensity: 1.0 },
      { x: 780, y: 360, radius: 150, intensity: 0.8 }
    ],
    rugs: [
      { x: 350, y: 300, w: 180, h: 120 },
      { x: 620, y: 300, w: 180, h: 40 }
    ],
    decor: [
      { x: 740, y: 560, w: 90, h: 60 }
    ],
    guards: [
      {
        name: "G-1 ALDO",
        x: 350, y: 140,
        waypoints: [{x: 350, y: 140}, {x: 350, y: 580}],
        currentWaypoint: 0,
        speed: 65
      },
      {
        name: "G-2 NERIS",
        x: 650, y: 580,
        waypoints: [{x: 650, y: 580}, {x: 650, y: 140}],
        currentWaypoint: 0,
        speed: 65
      },
      {
        name: "G-3 CAEL",
        x: 620, y: 120,
        waypoints: [{x: 620, y: 120}, {x: 860, y: 120}],
        currentWaypoint: 0,
        speed: 65
      }
    ]
  },
  {
    id: 2,
    name: "The Gilt Gallery",
    playerStart: { x: 100, y: 610 },
    exit: { x: 830, y: 80, width: 40, height: 80 }, // clear of right wall (starts at 900) by 70px
    relics: [
      { x: 260, y: 110, collected: false, name: "Sun Medallion" },
      { x: 540, y: 360, collected: false, name: "Star Compass" },
      { x: 800, y: 580, collected: false, name: "Royal Crown" }
    ],
    walls: [
      { x: 40, y: 44, w: 860, h: 30 },
      { x: 40, y: 650, w: 860, h: 30 },
      { x: 40, y: 44, w: 30, h: 636 },
      { x: 900, y: 44, w: 30, h: 636 },
      { x: 200, y: 140, w: 30, h: 380 },
      { x: 450, y: 140, w: 30, h: 380 },
      { x: 700, y: 140, w: 30, h: 380 }
    ],
    cover: [
      { x: 100, y: 280, w: 50, h: 100, type: 'bookshelf' },
      { x: 280, y: 100, w: 80, h: 50, type: 'crate' },
      { x: 280, y: 530, w: 80, h: 50, type: 'crate' },
      { x: 540, y: 100, w: 80, h: 50, type: 'bookshelf' },
      { x: 540, y: 530, w: 80, h: 50, type: 'bookshelf' },
      { x: 760, y: 280, w: 50, h: 100, type: 'pillar' }
    ],
    shadows: [
      { x: 70, y: 74, w: 120, h: 180 },
      { x: 240, y: 380, w: 180, h: 260 },
      { x: 740, y: 74, w: 130, h: 200 }
    ],
    lamps: [
      { x: 130, y: 360, radius: 140, intensity: 0.8 },
      { x: 360, y: 360, radius: 160, intensity: 0.9 },
      { x: 610, y: 360, radius: 160, intensity: 0.9 },
      { x: 800, y: 360, radius: 140, intensity: 0.8 }
    ],
    rugs: [
      { x: 230, y: 280, w: 200, h: 100 },
      { x: 480, y: 280, w: 200, h: 100 }
    ],
    guards: [
      {
        name: "G-1 ALDO",
        x: 130, y: 180,
        waypoints: [{x: 130, y: 180}, {x: 130, y: 520}],
        currentWaypoint: 0,
        speed: 75
      },
      {
        name: "G-2 NERIS",
        x: 490, y: 520,
        waypoints: [{x: 490, y: 520}, {x: 490, y: 180}],
        currentWaypoint: 0,
        speed: 75
      },
      {
        name: "G-3 CAEL",
        x: 760, y: 180,
        waypoints: [{x: 760, y: 180}, {x: 760, y: 520}],
        currentWaypoint: 0,
        speed: 80
      }
    ]
  },
  {
    id: 3,
    name: "The Vault Annex",
    playerStart: { x: 470, y: 610 },
    exit: { x: 450, y: 60, width: 40, height: 75 }, // fully open central top corridor, clear of walls
    relics: [
      { x: 140, y: 110, collected: false, name: "Ancient Scepter" },
      { x: 820, y: 110, collected: false, name: "Ruby Skull" },
      { x: 470, y: 340, collected: false, name: "Heart of the Vault" }
    ],
    walls: [
      { x: 40, y: 44, w: 860, h: 30 },
      { x: 40, y: 650, w: 860, h: 30 },
      { x: 40, y: 44, w: 30, h: 636 },
      { x: 900, y: 44, w: 30, h: 636 },
      { x: 220, y: 220, w: 140, h: 30 },
      { x: 580, y: 220, w: 140, h: 30 },
      { x: 330, y: 460, w: 280, h: 30 }
    ],
    cover: [
      { x: 130, y: 300, w: 70, h: 70, type: 'crate' },
      { x: 760, y: 300, w: 70, h: 70, type: 'crate' },
      { x: 410, y: 140, w: 120, h: 40, type: 'bookshelf' },
      { x: 410, y: 530, w: 120, h: 50, type: 'bookshelf' },
      { x: 250, y: 530, w: 50, h: 50, type: 'pillar' },
      { x: 640, y: 530, w: 50, h: 50, type: 'pillar' }
    ],
    shadows: [
      { x: 70, y: 74, w: 150, h: 160 },
      { x: 710, y: 74, w: 150, h: 160 },
      { x: 70, y: 500, w: 150, h: 150 },
      { x: 710, y: 500, w: 150, h: 150 },
      { x: 390, y: 260, w: 160, h: 160 }
    ],
    lamps: [
      { x: 280, y: 130, radius: 150, intensity: 0.9 },
      { x: 660, y: 130, radius: 150, intensity: 0.9 },
      { x: 170, y: 550, radius: 140, intensity: 0.8 },
      { x: 790, y: 550, radius: 140, intensity: 0.8 },
      { x: 470, y: 360, radius: 200, intensity: 1.0 }
    ],
    rugs: [
      { x: 370, y: 300, w: 200, h: 120 }
    ],
    guards: [
      {
        name: "G-1 ALDO",
        x: 160, y: 150,
        waypoints: [{x: 160, y: 150}, {x: 780, y: 150}],
        currentWaypoint: 0,
        speed: 80
      },
      {
        name: "G-2 NERIS",
        x: 780, y: 550,
        waypoints: [{x: 780, y: 550}, {x: 160, y: 550}],
        currentWaypoint: 0,
        speed: 80
      },
      {
        name: "G-3 CAEL",
        x: 470, y: 180,
        waypoints: [{x: 470, y: 180}, {x: 470, y: 440}],
        currentWaypoint: 0,
        speed: 85
      },
      {
        name: "G-4 VESS",
        x: 300, y: 360,
        waypoints: [{x: 300, y: 360}, {x: 640, y: 360}],
        currentWaypoint: 0,
        speed: 85
      }
    ]
  }
];
