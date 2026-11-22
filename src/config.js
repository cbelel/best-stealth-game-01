export const CONFIG = {
  TILE_SIZE: 40,
  WIDTH: 1280,
  HEIGHT: 720,
  PLAYER_SPEED_NORMAL: 140,
  PLAYER_SPEED_SNEAK: 70,
  GUARD_SPEED_PATROL: 75,
  GUARD_SPEED_ALERT: 150,
  CONE_RANGE: 240,
  CONE_ANGLE: Math.PI * 0.35, // ~63 degrees
  DETECTION_FILL_RATE: 0.85, // fills in ~1.2s in light + cone + LOS
  DETECTION_DRAIN_RATE: 0.6, // drains when hidden
  COLORS: {
    bg: '#05070c',
    floor: '#0e1628',
    floorShadow: '#080c16',
    wall: '#1e293b',
    wallTop: '#334155',
    crate: '#475569',
    bookshelf: '#3b2f2f',
    pillar: '#22303c',
    lamp: '#fbbf24',
    lampGlow: 'rgba(251, 191, 36, 0.15)',
    player: '#38bdf8',
    playerSneak: '#0284c7',
    guard: '#f87171',
    guardAlert: '#ef4444',
    guardCone: 'rgba(251, 191, 36, 0.18)',
    guardConeAlert: 'rgba(239, 68, 68, 0.28)',
    relic: '#facc15',
    exit: '#4ade80',
    exitLocked: '#64748b',
    uiBg: 'rgba(15, 23, 42, 0.85)',
    uiBorder: '#334155',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    danger: '#ef4444',
    success: '#4ade80'
  }
};
