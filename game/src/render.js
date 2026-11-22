import { CONFIG } from './config.js';

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }
  
  clear() {
    this.ctx.fillStyle = CONFIG.COLORS.bg;
    this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  }
  
  render(world) {
    this.clear();
    
    const lvl = world.level;
    
    // 1. Draw floor
    this.ctx.fillStyle = CONFIG.COLORS.floor;
    this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    
    // Grid lines / floor tiles decoration
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < CONFIG.WIDTH; x += CONFIG.TILE_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, CONFIG.HEIGHT);
      this.ctx.stroke();
    }
    for (let y = 0; y < CONFIG.HEIGHT; y += CONFIG.TILE_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(CONFIG.WIDTH, y);
      this.ctx.stroke();
    }
    
    // 2. Draw shadow zones
    this.ctx.fillStyle = CONFIG.COLORS.floorShadow;
    lvl.shadows.forEach(s => {
      this.ctx.fillRect(s.x, s.y, s.w, s.h);
      this.ctx.strokeStyle = 'rgba(2, 6, 23, 0.5)';
      this.ctx.strokeRect(s.x, s.y, s.w, s.h);
    });
    
    // 3. Draw lamps & glow
    lvl.lamps.forEach(l => {
      const grad = this.ctx.createRadialGradient(l.x, l.y, 10, l.x, l.y, l.radius);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
      grad.addColorStop(0.5, 'rgba(251, 191, 36, 0.1)');
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Lamp fixture
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // 4. Draw Relics
    lvl.relics.forEach(r => {
      if (!r.collected) {
        this.ctx.save();
        this.ctx.shadowColor = CONFIG.COLORS.relic;
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = CONFIG.COLORS.relic;
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner gem highlight
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(r.x - 3, r.y - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    });
    
    // 5. Draw Exit
    const allRelics = lvl.relics.every(r => r.collected);
    const ex = lvl.exit;
    this.ctx.save();
    this.ctx.shadowColor = allRelics ? CONFIG.COLORS.exit : CONFIG.COLORS.exitLocked;
    this.ctx.shadowBlur = allRelics ? 20 : 5;
    this.ctx.fillStyle = allRelics ? 'rgba(74, 222, 128, 0.3)' : 'rgba(100, 116, 139, 0.2)';
    this.ctx.fillRect(ex.x, ex.y, ex.width, ex.height);
    this.ctx.strokeStyle = allRelics ? CONFIG.COLORS.exit : CONFIG.COLORS.exitLocked;
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(ex.x, ex.y, ex.width, ex.height);
    
    this.ctx.fillStyle = allRelics ? CONFIG.COLORS.exit : CONFIG.COLORS.exitLocked;
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(allRelics ? 'EXIT' : 'LOCKED', ex.x + ex.width / 2, ex.y + ex.height / 2 + 4);
    this.ctx.restore();
    
    // 6. Draw Walls
    lvl.walls.forEach(w => {
      this.ctx.fillStyle = CONFIG.COLORS.wall;
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.fillStyle = CONFIG.COLORS.wallTop;
      this.ctx.fillRect(w.x, w.y, w.w, 6);
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });
    
    // 7. Draw Cover (crates, bookshelves, pillars)
    lvl.cover.forEach(c => {
      this.ctx.save();
      this.ctx.fillStyle = c.type === 'bookshelf' ? CONFIG.COLORS.bookshelf :
                           c.type === 'pillar' ? CONFIG.COLORS.pillar : CONFIG.COLORS.crate;
      this.ctx.fillRect(c.x, c.y, c.w, c.h);
      
      // Detail lines
      this.ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(c.x, c.y, c.w, c.h);
      
      if (c.type === 'crate') {
        this.ctx.beginPath();
        this.ctx.moveTo(c.x, c.y);
        this.ctx.lineTo(c.x + c.w, c.y + c.h);
        this.ctx.moveTo(c.x + c.w, c.y);
        this.ctx.lineTo(c.x, c.y + c.h);
        this.ctx.stroke();
      }
      this.ctx.restore();
    });
    
    // 8. Draw Guard vision cones & Guards
    world.guards.forEach(g => {
      this.ctx.save();
      const coneColor = g.state === 'alert' ? CONFIG.COLORS.guardConeAlert : CONFIG.COLORS.guardCone;
      this.ctx.fillStyle = coneColor;
      this.ctx.beginPath();
      this.ctx.moveTo(g.x, g.y);
      this.ctx.arc(g.x, g.y, g.coneRange, g.angle - g.coneAngle / 2, g.angle + g.coneAngle / 2);
      this.ctx.lineTo(g.x, g.y);
      this.ctx.fill();
      this.ctx.restore();
      
      // Guard body
      this.ctx.save();
      this.ctx.fillStyle = g.state === 'alert' ? CONFIG.COLORS.guardAlert : CONFIG.COLORS.guard;
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Direction tick / lantern
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(g.x, g.y);
      this.ctx.lineTo(g.x + Math.cos(g.angle) * (g.radius + 6), g.y + Math.sin(g.angle) * (g.radius + 6));
      this.ctx.stroke();
      this.ctx.restore();
    });
    
    // 9. Draw Player (Wren)
    const p = world.player;
    this.ctx.save();
    this.ctx.fillStyle = p.sneaking ? CONFIG.COLORS.playerSneak : CONFIG.COLORS.player;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Hood / direction
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.moveTo(p.x, p.y);
    this.ctx.lineTo(p.x + Math.cos(p.angle) * (p.radius + 5), p.y + Math.sin(p.angle) * (p.radius + 5));
    this.ctx.stroke();
    this.ctx.restore();
    
    // 10. Draw HUD
    this.drawHUD(world);
    
    // 11. Draw Overlay Screens if applicable
    if (world.state !== 'play') {
      this.drawScreen(world);
    }
  }
  
  drawHUD(world) {
    this.ctx.save();
    
    // Top HUD bar background
    this.ctx.fillStyle = CONFIG.COLORS.uiBg;
    this.ctx.fillRect(20, 20, 420, 50);
    this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, 20, 420, 50);
    
    // Level name & relics
    this.ctx.fillStyle = CONFIG.COLORS.text;
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.fillText(world.level.name, 35, 42);
    
    const collectedCount = world.level.relics.filter(r => r.collected).length;
    this.ctx.fillStyle = CONFIG.COLORS.relic;
    this.ctx.font = '13px sans-serif';
    this.ctx.fillText(`Relics: ${collectedCount}/3`, 35, 60);
    
    // Lives (Hearts / Icons)
    this.ctx.fillStyle = CONFIG.COLORS.danger;
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(`Lives: ${'♥ '.repeat(world.player.lives)}`, 220, 60);
    
    // Detection Meter Bar
    const barX = 840;
    const barY = 25;
    const barW = 420;
    const barH = 24;
    
    this.ctx.fillStyle = CONFIG.COLORS.uiBg;
    this.ctx.fillRect(barX, barY, barW, barH);
    this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
    this.ctx.strokeRect(barX, barY, barW, barH);
    
    const fillW = barW * world.detectionMeter;
    this.ctx.fillStyle = world.detectionMeter > 0.7 ? CONFIG.COLORS.danger : CONFIG.COLORS.lamp;
    this.ctx.fillRect(barX + 2, barY + 2, (barW - 4) * world.detectionMeter, barH - 4);
    
    this.ctx.fillStyle = CONFIG.COLORS.text;
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`DETECTION LEVEL`, barX + barW / 2, barY + 17);
    this.ctx.textAlign = 'left';
    
    this.ctx.restore();
  }
  
  drawScreen(world) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(3, 5, 9, 0.82)';
    this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    
    this.ctx.textAlign = 'center';
    
    if (world.state === 'title') {
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.fillText('THE LANTERN ARCHIVE', CONFIG.WIDTH / 2, 200);
      
      this.ctx.fillStyle = CONFIG.COLORS.textMuted;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('Steal 3 relics from the moonlit museum and escape through the glow unseen.', CONFIG.WIDTH / 2, 250);
      
      // Controls box
      this.ctx.fillStyle = CONFIG.COLORS.uiBg;
      this.ctx.fillRect(CONFIG.WIDTH / 2 - 250, 300, 500, 180);
      this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
      this.ctx.strokeRect(CONFIG.WIDTH / 2 - 250, 300, 500, 180);
      
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = 'bold 16px sans-serif';
      this.ctx.fillText('CONTROLS', CONFIG.WIDTH / 2, 330);
      
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText('WASD / Arrows: Move', CONFIG.WIDTH / 2, 365);
      this.ctx.fillText('Hold SHIFT: Sneak (quieter, slower, harder to spot)', CONFIG.WIDTH / 2, 395);
      this.ctx.fillText('E / Close: Pick up Relics', CONFIG.WIDTH / 2, 425);
      this.ctx.fillText('P / Esc: Pause | M: Mute | R: Restart', CONFIG.WIDTH / 2, 455);
      
      // Start button
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.fillRect(CONFIG.WIDTH / 2 - 100, 520, 200, 50);
      this.ctx.fillStyle = '#030509';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('START HEIST', CONFIG.WIDTH / 2, 552);
      
    } else if (world.state === 'paused') {
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = 'bold 40px sans-serif';
      this.ctx.fillText('GAME PAUSED', CONFIG.WIDTH / 2, 300);
      this.ctx.font = '18px sans-serif';
      this.ctx.fillStyle = CONFIG.COLORS.textMuted;
      this.ctx.fillText('Press P or Esc to resume', CONFIG.WIDTH / 2, 360);
      
    } else if (world.state === 'levelComplete') {
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.font = 'bold 40px sans-serif';
      this.ctx.fillText('LEVEL COMPLETE!', CONFIG.WIDTH / 2, 280);
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('Relics secured. Moving to next gallery...', CONFIG.WIDTH / 2, 340);
      
      // Button
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.fillRect(CONFIG.WIDTH / 2 - 100, 400, 200, 50);
      this.ctx.fillStyle = '#030509';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('NEXT LEVEL', CONFIG.WIDTH / 2, 432);
      
    } else if (world.state === 'gameOver') {
      this.ctx.fillStyle = CONFIG.COLORS.danger;
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.fillText('CAUGHT!', CONFIG.WIDTH / 2, 280);
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('The Wardens locked down the archive. All lives lost.', CONFIG.WIDTH / 2, 340);
      
      // Button
      this.ctx.fillStyle = CONFIG.COLORS.danger;
      this.ctx.fillRect(CONFIG.WIDTH / 2 - 100, 400, 200, 50);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('TRY AGAIN', CONFIG.WIDTH / 2, 432);
      
    } else if (world.state === 'victory') {
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.fillText('HEIST SUCCESSFUL!', CONFIG.WIDTH / 2, 200);
      
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('You escaped into the moonlit night with all priceless relics!', CONFIG.WIDTH / 2, 260);
      
      // Score breakdown box
      this.ctx.fillStyle = CONFIG.COLORS.uiBg;
      this.ctx.fillRect(CONFIG.WIDTH / 2 - 220, 310, 440, 160);
      this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
      this.ctx.strokeRect(CONFIG.WIDTH / 2 - 220, 310, 440, 160);
      
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.font = 'bold 16px sans-serif';
      this.ctx.fillText('SCORE BREAKDOWN', CONFIG.WIDTH / 2, 340);
      
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText(`Total Time: ${world.score.time.toFixed(1)}s`, CONFIG.WIDTH / 2, 380);
      this.ctx.fillText(`Alarm Detections: ${world.score.detections}`, CONFIG.WIDTH / 2, 410);
      this.ctx.fillText(`Relics Secured: ${world.score.relicsCollected}/9`, CONFIG.WIDTH / 2, 440);
      
      // Restart button
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.fillRect(CONFIG.WIDTH / 2 - 100, 510, 200, 50);
      this.ctx.fillStyle = '#030509';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('PLAY AGAIN', CONFIG.WIDTH / 2, 542);
    }
    
    this.ctx.restore();
  }
}
