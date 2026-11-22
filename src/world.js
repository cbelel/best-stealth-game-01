import { CONFIG } from './config.js';
import { LEVELS } from './levels.js';

export class World {
  constructor(levelIndex = 0, rng = null) {
    this.levelIndex = levelIndex;
    this.level = JSON.parse(JSON.stringify(LEVELS[levelIndex]));
    this.rng = rng;
    
    this.player = {
      x: this.level.playerStart.x,
      y: this.level.playerStart.y,
      radius: 12,
      angle: 0,
      speed: CONFIG.PLAYER_SPEED_NORMAL,
      sneaking: false,
      running: false,
      lives: 3
    };
    
    this.guards = this.level.guards.map(g => ({
      x: g.x,
      y: g.y,
      radius: 14,
      angle: 0,
      waypoints: g.waypoints,
      currentWaypoint: g.currentWaypoint,
      speed: g.speed,
      state: 'patrol', // patrol, suspicious, alert, search
      stateTimer: 0,
      lastKnownPlayerX: 0,
      lastKnownPlayerY: 0,
      coneRange: CONFIG.CONE_RANGE,
      coneAngle: CONFIG.CONE_ANGLE,
      alertness: 0 // 0 to 1
    }));
    
    this.detectionMeter = 0; // 0 to 1
    this.alarmTimer = 0;
    this.gameTimer = 0;
    this.state = 'title'; // title, play, paused, levelComplete, gameOver, victory
    this.score = { time: 0, detections: 0, relicsCollected: 0 };
    this.footstepTimer = 0;
  }
  
  loadLevel(index) {
    if (index >= LEVELS.length) {
      this.state = 'victory';
      return;
    }
    this.levelIndex = index;
    this.level = JSON.parse(JSON.stringify(LEVELS[index]));
    this.player.x = this.level.playerStart.x;
    this.player.y = this.level.playerStart.y;
    this.detectionMeter = 0;
    
    this.guards = this.level.guards.map(g => ({
      x: g.x,
      y: g.y,
      radius: 14,
      angle: 0,
      waypoints: g.waypoints,
      currentWaypoint: g.currentWaypoint,
      speed: g.speed,
      state: 'patrol',
      stateTimer: 0,
      lastKnownPlayerX: 0,
      lastKnownPlayerY: 0,
      coneRange: CONFIG.CONE_RANGE,
      coneAngle: CONFIG.CONE_ANGLE,
      alertness: 0
    }));
  }
  
  update(dt, input, audio) {
    if (this.state !== 'play') return;
    
    this.gameTimer += dt;
    
    // Player movement
    let dx = 0;
    let dy = 0;
    if (input.isDown('KeyW') || input.isDown('ArrowUp')) dy -= 1;
    if (input.isDown('KeyS') || input.isDown('ArrowDown')) dy += 1;
    if (input.isDown('KeyA') || input.isDown('ArrowLeft')) dx -= 1;
    if (input.isDown('KeyD') || input.isDown('ArrowRight')) dx += 1;
    
    this.player.sneaking = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
    this.player.running = (dx !== 0 || dy !== 0) && !this.player.sneaking;
    
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }
    
    const speed = this.player.sneaking ? CONFIG.PLAYER_SPEED_SNEAK : CONFIG.PLAYER_SPEED_NORMAL;
    
    if (dx !== 0 || dy !== 0) {
      this.player.angle = Math.atan2(dy, dx);
      
      const newX = this.player.x + dx * speed * dt;
      const newY = this.player.y + dy * speed * dt;
      
      if (!this.checkCollision(newX, this.player.y, this.player.radius)) {
        this.player.x = newX;
      }
      if (!this.checkCollision(this.player.x, newY, this.player.radius)) {
        this.player.y = newY;
      }
      
      // Footstep audio & noise
      this.footstepTimer += dt;
      const stepInterval = this.player.sneaking ? 0.5 : 0.3;
      if (this.footstepTimer >= stepInterval) {
        this.footstepTimer = 0;
        audio.playFootstep(this.player.sneaking);
        
        if (this.player.running) {
          // Emit noise that alerts nearby guards
          this.guards.forEach(g => {
            const dist = Math.hypot(g.x - this.player.x, g.y - this.player.y);
            if (dist < 220 && g.state === 'patrol') {
              g.state = 'suspicious';
              g.stateTimer = 3.0;
              g.lastKnownPlayerX = this.player.x;
              g.lastKnownPlayerY = this.player.y;
            }
          });
        }
      }
    }
    
    // Check relic collection (Press E or walk into)
    this.level.relics.forEach(r => {
      if (!r.collected && Math.hypot(r.x - this.player.x, r.y - this.player.y) < 30) {
        if (input.isDown('KeyE') || Math.hypot(r.x - this.player.x, r.y - this.player.y) < 20) {
          r.collected = true;
          this.score.relicsCollected++;
          audio.playPickup();
        }
      }
    });
    
    // Check exit
    const allRelics = this.level.relics.every(r => r.collected);
    const ex = this.level.exit;
    if (allRelics && this.player.x >= ex.x && this.player.x <= ex.x + ex.width &&
        this.player.y >= ex.y && this.player.y <= ex.y + ex.height) {
      audio.playExit();
      this.score.time += this.gameTimer;
      if (this.levelIndex + 1 < LEVELS.length) {
        this.state = 'levelComplete';
      } else {
        this.state = 'victory';
      }
      return;
    }
    
    // Update guards AI
    let playerDetectedThisFrame = false;
    
    this.guards.forEach(g => {
      // Light level at guard/player
      let inLight = true;
      this.level.shadows.forEach(s => {
        if (this.player.x >= s.x && this.player.x <= s.x + s.w &&
            this.player.y >= s.y && this.player.y <= s.y + s.h) {
          inLight = false;
        }
      });
      
      // Vision cone check
      const distToPlayer = Math.hypot(this.player.x - g.x, this.player.y - g.y);
      const angleToPlayer = Math.atan2(this.player.y - g.y, this.player.x - g.x);
      let angleDiff = Math.abs(angleToPlayer - g.angle);
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      angleDiff = Math.abs(angleDiff);
      
      const inCone = distToPlayer < g.coneRange && angleDiff < g.coneAngle / 2;
      const los = inCone && this.hasLineOfSight(g.x, g.y, this.player.x, this.player.y);
      
      if (los && inLight && !this.player.sneaking) {
        playerDetectedThisFrame = true;
        g.state = 'alert';
        g.lastKnownPlayerX = this.player.x;
        g.lastKnownPlayerY = this.player.y;
        g.stateTimer = 4.0;
      } else if (los && inLight && this.player.sneaking && distToPlayer < 120) {
        playerDetectedThisFrame = true;
        g.state = 'alert';
        g.lastKnownPlayerX = this.player.x;
        g.lastKnownPlayerY = this.player.y;
        g.stateTimer = 4.0;
      }
      
      // Guard State Machine
      if (g.state === 'patrol') {
        const wp = g.waypoints[g.currentWaypoint];
        const angleToWp = Math.atan2(wp.y - g.y, wp.x - g.x);
        g.angle = angleToWp;
        g.x += Math.cos(angleToWp) * g.speed * dt;
        g.y += Math.sin(angleToWp) * g.speed * dt;
        
        if (Math.hypot(wp.x - g.x, wp.y - g.y) < 10) {
          g.currentWaypoint = (g.currentWaypoint + 1) % g.waypoints.length;
        }
      } else if (g.state === 'suspicious') {
        g.stateTimer -= dt;
        const angleToLast = Math.atan2(g.lastKnownPlayerY - g.y, g.lastKnownPlayerX - g.x);
        g.angle = angleToLast;
        if (g.stateTimer <= 0) {
          g.state = 'patrol';
        }
      } else if (g.state === 'alert') {
        g.stateTimer -= dt;
        const angleToPlayer = Math.atan2(this.player.y - g.y, this.player.x - g.x);
        g.angle = angleToPlayer;
        g.x += Math.cos(angleToPlayer) * CONFIG.GUARD_SPEED_ALERT * dt;
        g.y += Math.sin(angleToPlayer) * CONFIG.GUARD_SPEED_ALERT * dt;
        
        if (g.stateTimer <= 0) {
          g.state = 'search';
          g.stateTimer = 5.0;
        }
      } else if (g.state === 'search') {
        g.stateTimer -= dt;
        g.angle += dt * 1.5;
        if (g.stateTimer <= 0) {
          g.state = 'patrol';
        }
      }
    });
    
    // Detection meter update
    if (playerDetectedThisFrame) {
      this.detectionMeter += CONFIG.DETECTION_FILL_RATE * dt;
      if (this.detectionMeter >= 1.0) {
        // Caught!
        this.detectionMeter = 1.0;
        this.score.detections++;
        audio.playAlert();
        this.player.lives--;
        if (this.player.lives <= 0) {
          this.state = 'gameOver';
        } else {
          // Restart level
          this.loadLevel(this.levelIndex);
        }
      }
    } else {
      this.detectionMeter = Math.max(0, this.detectionMeter - CONFIG.DETECTION_DRAIN_RATE * dt);
    }
  }
  
  checkCollision(x, y, r) {
    // Check map boundaries
    if (x - r < 0 || x + r > CONFIG.WIDTH || y - r < 0 || y + r > CONFIG.HEIGHT) return true;
    
    // Check walls
    for (const w of this.level.walls) {
      if (x + r > w.x && x - r < w.x + w.w && y + r > w.y && y - r < w.y + w.h) {
        return true;
      }
    }
    
    // Check cover
    for (const c of this.level.cover) {
      if (x + r > c.x && x - r < c.x + c.w && y + r > c.y && y - r < c.y + c.h) {
        return true;
      }
    }
    
    return false;
  }
  
  hasLineOfSight(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.floor(dist / 10);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const cx = x1 + (x2 - x1) * t;
      const cy = y1 + (y2 - y1) * t;
      
      // Check walls
      for (const w of this.level.walls) {
        if (cx >= w.x && cx <= w.x + w.w && cy >= w.y && cy <= w.y + w.h) return false;
      }
      // Check cover blocks line of sight
      for (const c of this.level.cover) {
        if (cx >= c.x && cx <= c.x + c.w && cy >= c.y && cy <= c.y + c.h) return false;
      }
    }
    return true;
  }
}
