import { CONFIG } from './config.js';

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }
  
  clear() {
    this.ctx.fillStyle = CONFIG.COLORS.bg;
    this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  }
  
  render(world, screenshotMode = false, shotName = null) {
    this.clear();
    
    // 1. Render Playfield
    this.renderPlayfield(world);
    
    // 2. Render Top Bar
    this.renderTopBar(world);
    
    // 3. Render Right Side Panel
    this.renderSidePanel(world);
    
    // 4. Render Screenshot Annotations if requested
    if (screenshotMode && shotName) {
      this.renderAnnotations(shotName);
    }
    
    // 5. Render Overlay Screens if not playing
    if (world.state !== 'play') {
      this.renderScreen(world);
    }
  }
  
  renderPlayfield(world) {
    const lvl = world.level;
    const pw = CONFIG.PLAYFIELD_WIDTH;
    const ph = CONFIG.PLAYFIELD_HEIGHT;
    
    // Floor background
    this.ctx.fillStyle = CONFIG.COLORS.floor;
    this.ctx.fillRect(0, 0, pw, ph);
    
    // Textured floor tiles / checker
    this.ctx.lineWidth = 1;
    for (let x = 40; x < pw - 40; x += CONFIG.TILE_SIZE) {
      for (let y = 44; y < ph; y += CONFIG.TILE_SIZE) {
        if ((Math.floor(x/CONFIG.TILE_SIZE) + Math.floor(y/CONFIG.TILE_SIZE)) % 2 === 0) {
          this.ctx.fillStyle = CONFIG.COLORS.floorCheck;
          this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        this.ctx.strokeRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
      }
    }
    
    // Rugs / Carpets
    if (lvl.rugs) {
      lvl.rugs.forEach(rug => {
        this.ctx.save();
        this.ctx.fillStyle = '#172033';
        this.ctx.fillRect(rug.x, rug.y, rug.w, rug.h);
        this.ctx.strokeStyle = '#253858';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(rug.x, rug.y, rug.w, rug.h);
        
        this.ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
        this.ctx.strokeRect(rug.x + 6, rug.y + 6, rug.w - 12, rug.h - 12);
        this.ctx.restore();
      });
    }
    
    // Shadow zones
    lvl.shadows.forEach(s => {
      this.ctx.fillStyle = CONFIG.COLORS.floorShadow;
      this.ctx.fillRect(s.x, s.y, s.w, s.h);
      this.ctx.strokeStyle = 'rgba(2, 6, 23, 0.6)';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(s.x, s.y, s.w, s.h);
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.012)';
      for (let sy = s.y + 10; sy < s.y + s.h; sy += 20) {
        this.ctx.fillRect(s.x, sy, s.w, 2);
      }
    });
    
    // Tall grass clumps (decor)
    if (lvl.decor) {
      lvl.decor.forEach(d => {
        this.ctx.save();
        this.ctx.fillStyle = '#064e3b';
        this.ctx.fillRect(d.x, d.y, d.w, d.h);
        this.ctx.strokeStyle = '#022c22';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(d.x, d.y, d.w, d.h);
        
        this.ctx.fillStyle = '#10b981';
        for (let dx = d.x + 8; dx < d.x + d.w - 6; dx += 12) {
          this.ctx.fillRect(dx, d.y + 6, 4, d.h - 12);
        }
        this.ctx.restore();
      });
    }
    
    // Lamps & Radial Glow
    lvl.lamps.forEach(l => {
      const grad = this.ctx.createRadialGradient(l.x, l.y, 8, l.x, l.y, l.radius);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      grad.addColorStop(0.5, 'rgba(251, 191, 36, 0.15)');
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    });
    
    // Relics
    lvl.relics.forEach(r => {
      if (!r.collected) {
        this.ctx.save();
        this.ctx.shadowColor = CONFIG.COLORS.relic;
        this.ctx.shadowBlur = 18;
        this.ctx.fillStyle = CONFIG.COLORS.relic;
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, 11, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(r.x - 3, r.y - 3, 3.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    });
    
    // Exit Portal
    const allRelics = lvl.relics.every(r => r.collected);
    const ex = lvl.exit;
    this.ctx.save();
    this.ctx.shadowColor = allRelics ? CONFIG.COLORS.exit : CONFIG.COLORS.exitLocked;
    this.ctx.shadowBlur = allRelics ? 22 : 4;
    this.ctx.fillStyle = allRelics ? 'rgba(74, 222, 128, 0.35)' : 'rgba(100, 116, 139, 0.25)';
    this.ctx.fillRect(ex.x, ex.y, ex.width, ex.height);
    this.ctx.strokeStyle = allRelics ? CONFIG.COLORS.exit : CONFIG.COLORS.exitLocked;
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(ex.x, ex.y, ex.width, ex.height);
    
    this.ctx.fillStyle = allRelics ? CONFIG.COLORS.exit : CONFIG.COLORS.exitLocked;
    this.ctx.font = 'bold 11px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(allRelics ? 'EXIT' : 'LOCKED', ex.x + ex.width / 2, ex.y - 8);
    this.ctx.restore();
    
    // Walls
    lvl.walls.forEach(w => {
      this.ctx.fillStyle = CONFIG.COLORS.wall;
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.fillStyle = CONFIG.COLORS.wallTop;
      this.ctx.fillRect(w.x, w.y, w.w, 6);
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });
    
    // Cover props
    lvl.cover.forEach(c => {
      this.ctx.save();
      this.ctx.fillStyle = c.type === 'bookshelf' ? CONFIG.COLORS.bookshelf :
                           c.type === 'pillar' ? CONFIG.COLORS.pillar :
                           c.type === 'display' ? '#1e293b' : CONFIG.COLORS.crate;
      this.ctx.fillRect(c.x, c.y, c.w, c.h);
      
      this.ctx.strokeStyle = c.type === 'display' ? '#facc15' : 'rgba(0,0,0,0.5)';
      this.ctx.lineWidth = c.type === 'display' ? 2 : 2;
      this.ctx.strokeRect(c.x, c.y, c.w, c.h);
      
      if (c.type === 'crate') {
        this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(c.x, c.y);
        this.ctx.lineTo(c.x + c.w, c.y + c.h);
        this.ctx.moveTo(c.x + c.w, c.y);
        this.ctx.lineTo(c.x, c.y + c.h);
        this.ctx.stroke();
      } else if (c.type === 'bookshelf') {
        const bookColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#0891b2'];
        let bx = c.x + 4;
        let bi = 0;
        while (bx < c.x + c.w - 6) {
          this.ctx.fillStyle = bookColors[bi % bookColors.length];
          const bw = 6;
          const bh = c.h - 8;
          this.ctx.fillRect(bx, c.y + 4, bw, bh);
          bx += bw + 2;
          bi++;
        }
      } else if (c.type === 'pillar') {
        this.ctx.fillStyle = '#1e293b';
        this.ctx.beginPath();
        this.ctx.arc(c.x + c.w/2, c.y + c.h/2, Math.min(c.w, c.h)/3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#475569';
        this.ctx.stroke();
      } else if (c.type === 'display') {
        this.ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
        this.ctx.fillRect(c.x + 6, c.y + 6, c.w - 12, c.h - 12);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(c.x + 12, c.y + 12, 6, 3);
        this.ctx.fillRect(c.x + c.w - 18, c.y + c.h - 15, 6, 3);
      }
      this.ctx.restore();
    });
    
    // Guard Vision Cones & Guards
    world.guards.forEach(g => {
      this.ctx.save();
      let coneCol = CONFIG.COLORS.coneCalm;
      if (g.state === 'suspicious') coneCol = CONFIG.COLORS.coneSuspicious;
      if (g.state === 'alert') coneCol = CONFIG.COLORS.coneAlert;
      
      const grad = this.ctx.createRadialGradient(g.x, g.y, 10, g.x, g.y, g.coneRange);
      grad.addColorStop(0, coneCol);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(g.x, g.y);
      this.ctx.arc(g.x, g.y, g.coneRange, g.angle - g.coneAngle / 2, g.angle + g.coneAngle / 2);
      this.ctx.lineTo(g.x, g.y);
      this.ctx.fill();
      this.ctx.restore();
      
      // Guard body
      this.ctx.save();
      this.ctx.fillStyle = g.state === 'alert' ? CONFIG.COLORS.guardAlert :
                           g.state === 'suspicious' ? CONFIG.COLORS.guardAmber : CONFIG.COLORS.guardTeal;
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(g.x, g.y);
      this.ctx.lineTo(g.x + Math.cos(g.angle) * (g.radius + 7), g.y + Math.sin(g.angle) * (g.radius + 7));
      this.ctx.stroke();
      
      if (g.state === 'alert') {
        this.ctx.fillStyle = CONFIG.COLORS.danger;
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('!', g.x, g.y - 20);
      } else if (g.state === 'suspicious') {
        this.ctx.fillStyle = CONFIG.COLORS.warning;
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('?', g.x, g.y - 20);
      }
      this.ctx.restore();
    });
    
    // Player
    const p = world.player;
    this.ctx.save();
    this.ctx.fillStyle = p.sneaking ? CONFIG.COLORS.playerSneak : CONFIG.COLORS.player;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.moveTo(p.x, p.y);
    this.ctx.lineTo(p.x + Math.cos(p.angle) * (p.radius + 6), p.y + Math.sin(p.angle) * (p.radius + 6));
    this.ctx.stroke();
    this.ctx.restore();
    
    if (world.noiseIndicator) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      const r = (1.2 - world.noiseIndicator.timer) * 80;
      this.ctx.arc(world.noiseIndicator.x, world.noiseIndicator.y, r, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
  
  renderTopBar(world) {
    this.ctx.save();
    this.ctx.fillStyle = CONFIG.COLORS.uiBg;
    this.ctx.fillRect(0, 0, CONFIG.PLAYFIELD_WIDTH, CONFIG.TOP_BAR_HEIGHT);
    this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, CONFIG.TOP_BAR_HEIGHT);
    this.ctx.lineTo(CONFIG.PLAYFIELD_WIDTH, CONFIG.TOP_BAR_HEIGHT);
    this.ctx.stroke();
    
    this.ctx.fillStyle = CONFIG.COLORS.text;
    this.ctx.font = 'bold 13px sans-serif';
    this.ctx.fillText(`THE LANTERN ARCHIVE · ${world.level.name.toUpperCase()}`, 16, 27);
    
    const relicsGot = world.level.relics.filter(r => r.collected).length;
    const allRelics = relicsGot === 3;
    this.ctx.fillStyle = allRelics ? CONFIG.COLORS.success : CONFIG.COLORS.warning;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(allRelics ? 'OBJECTIVE: ESCAPE THROUGH EXIT' : `OBJECTIVE: SECURE RELICS (${relicsGot}/3)`, 360, 27);
    
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    
    this.ctx.fillStyle = CONFIG.COLORS.textMuted;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`TIME ${formatTime(world.gameTimer)}`, CONFIG.PLAYFIELD_WIDTH - 16, 27);
    this.ctx.restore();
  }
  
  renderSidePanel(world) {
    const x = CONFIG.PLAYFIELD_WIDTH;
    const w = CONFIG.SIDE_PANEL_WIDTH;
    const h = CONFIG.HEIGHT;
    
    this.ctx.save();
    this.ctx.fillStyle = CONFIG.COLORS.uiPanelBg;
    this.ctx.fillRect(x, 0, w, h);
    this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, h);
    this.ctx.stroke();
    
    let curY = 30;
    
    // 1. Detection State Word Banner
    let stateWord = "UNDETECTED";
    let stateCol = CONFIG.COLORS.success;
    if (world.detectionMeter > 0.7) {
      stateWord = "ALERT!";
      stateCol = CONFIG.COLORS.danger;
    } else if (world.detectionMeter > 0.2) {
      stateWord = "SUSPICIOUS";
      stateCol = CONFIG.COLORS.warning;
    }
    
    this.ctx.fillStyle = stateCol;
    this.ctx.font = 'bold 18px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(stateWord, x + w / 2, curY);
    curY += 25;
    
    // Detection Meter Bar
    const barW = w - 40;
    const barH = 16;
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(x + 20, curY, barW, barH);
    this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
    this.ctx.strokeRect(x + 20, curY, barW, barH);
    
    this.ctx.fillStyle = stateCol;
    this.ctx.fillRect(x + 22, curY + 2, (barW - 4) * world.detectionMeter, barH - 4);
    curY += 32;
    
    // 2. Status & Meters
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = CONFIG.COLORS.textMuted;
    this.ctx.font = '11px sans-serif';
    this.ctx.fillText(`LIVES: ${'♥ '.repeat(world.player.lives)}`, x + 20, curY);
    curY += 22;
    
    const visibility = world.player.sneaking ? 'HIDDEN (SNEAK)' : world.player.running ? 'NOISY (RUN)' : 'NORMAL';
    this.ctx.fillText(`STANCE: ${visibility}`, x + 20, curY);
    curY += 28;
    
    // 3. Objectives Checklist
    this.ctx.fillStyle = CONFIG.COLORS.text;
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText('OBJECTIVES', x + 20, curY);
    curY += 20;
    
    world.level.relics.forEach((r, idx) => {
      this.ctx.fillStyle = r.collected ? CONFIG.COLORS.success : CONFIG.COLORS.textMuted;
      this.ctx.font = '11px sans-serif';
      const check = r.collected ? '[✓]' : '[ ]';
      this.ctx.fillText(`${check} ${r.name || 'Relic ' + (idx+1)}`, x + 20, curY);
      curY += 18;
    });
    
    const allRelics = world.level.relics.every(r => r.collected);
    this.ctx.fillStyle = allRelics ? CONFIG.COLORS.success : CONFIG.COLORS.textMuted;
    this.ctx.fillText(`${allRelics ? '[✓]' : '[ ]'} Reach Exit Portal`, x + 20, curY);
    curY += 28;
    
    // 4. Guard Roster
    this.ctx.fillStyle = CONFIG.COLORS.text;
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText('WARDEN ROSTER', x + 20, curY);
    curY += 20;
    
    world.guards.forEach(g => {
      this.ctx.fillStyle = g.state === 'alert' ? CONFIG.COLORS.danger : g.state === 'suspicious' ? CONFIG.COLORS.warning : CONFIG.COLORS.textMuted;
      this.ctx.font = '11px sans-serif';
      this.ctx.fillText(`${g.name}: ${g.state.toUpperCase()}`, x + 20, curY);
      curY += 18;
    });
    curY += 14;
    
    // 5. Field Notes Legend
    this.ctx.fillStyle = CONFIG.COLORS.text;
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText('FIELD NOTES', x + 20, curY);
    curY += 18;
    
    this.ctx.fillStyle = CONFIG.COLORS.textMuted;
    this.ctx.font = '10px sans-serif';
    const notes = [
      '• Vision Cone: What guards see',
      '• Shadow Zone: Cuts detection speed',
      '• Lamplight: Exposes player in cone',
      '• Cover / Walls: Blocks line of sight',
      '• Running: Emits sound & alerts guards'
    ];
    notes.forEach(n => {
      this.ctx.fillText(n, x + 20, curY);
      curY += 16;
    });
    curY += 10;
    
    // 6. Tactical Map (Job 2)
    this.ctx.fillStyle = CONFIG.COLORS.text;
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText('TACTICAL MAP', x + 20, curY);
    curY += 18;
    
    const mapBoxX = x + 20;
    const mapBoxY = curY;
    const mapBoxW = w - 40;
    const mapBoxH = 150;
    
    this.ctx.fillStyle = '#04060b';
    this.ctx.fillRect(mapBoxX, mapBoxY, mapBoxW, mapBoxH);
    this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(mapBoxX, mapBoxY, mapBoxW, mapBoxH);
    
    const playXMin = 40, playXMax = 930;
    const playYMin = 44, playYMax = 680;
    const playW = playXMax - playXMin;
    const playH = playYMax - playYMin;
    
    const scaleX = (mapBoxW - 12) / playW;
    const scaleY = (mapBoxH - 12) / playH;
    const scale = Math.min(scaleX, scaleY);
    
    const drawW = playW * scale;
    const drawH = playH * scale;
    const originX = mapBoxX + (mapBoxW - drawW) / 2;
    const originY = mapBoxY + (mapBoxH - drawH) / 2;
    
    const toMapX = (wx) => originX + (wx - playXMin) * scale;
    const toMapY = (wy) => originY + (wy - playYMin) * scale;
    
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(mapBoxX, mapBoxY, mapBoxW, mapBoxH);
    this.ctx.clip();
    
    world.level.walls.forEach(mw => {
      this.ctx.fillStyle = CONFIG.COLORS.wall;
      this.ctx.fillRect(toMapX(mw.x), toMapY(mw.y), mw.w * scale, mw.h * scale);
    });
    
    world.level.cover.forEach(mc => {
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(toMapX(mc.x), toMapY(mc.y), mc.w * scale, mc.h * scale);
    });
    
    world.level.relics.forEach(mr => {
      this.ctx.fillStyle = mr.collected ? '#64748b' : CONFIG.COLORS.relic;
      this.ctx.beginPath();
      this.ctx.arc(toMapX(mr.x), toMapY(mr.y), Math.max(2, 3.5 * scale), 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    const mex = world.level.exit;
    const allRelicsGot = world.level.relics.every(r => r.collected);
    this.ctx.fillStyle = allRelicsGot ? CONFIG.COLORS.exit : '#64748b';
    this.ctx.fillRect(toMapX(mex.x), toMapY(mex.y), mex.width * scale, mex.height * scale);
    
    world.guards.forEach(mg => {
      let gCol = CONFIG.COLORS.guardTeal;
      if (mg.state === 'suspicious') gCol = CONFIG.COLORS.guardAmber;
      if (mg.state === 'alert') gCol = CONFIG.COLORS.guardAlert;
      this.ctx.fillStyle = gCol;
      this.ctx.beginPath();
      this.ctx.arc(toMapX(mg.x), toMapY(mg.y), Math.max(2, 3 * scale), 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    const mp = world.player;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(toMapX(mp.x), toMapY(mp.y), Math.max(2.5, 3.5 * scale), 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    this.ctx.restore();
    
    curY += mapBoxH + 6;
    this.ctx.fillStyle = CONFIG.COLORS.textMuted;
    this.ctx.font = '10px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('LIVE · PLAYER · GUARDS · RELICS', mapBoxX + mapBoxW / 2, curY);
    
    this.ctx.restore();
  }
  
  renderAnnotations(shotName) {
    this.ctx.save();
    
    const drawCallout = (text, lx, ly, tx, ty) => {
      this.ctx.font = 'bold 11px sans-serif';
      const tw = this.ctx.measureText(text).width;
      
      this.ctx.fillStyle = 'rgba(4, 6, 11, 0.9)';
      this.ctx.strokeStyle = '#facc15';
      this.ctx.lineWidth = 1.5;
      this.ctx.fillRect(tx - 6, ty - 13, tw + 12, 22);
      this.ctx.strokeRect(tx - 6, ty - 13, tw + 12, 22);
      
      this.ctx.fillStyle = '#facc15';
      this.ctx.fillText(text, tx, ty + 2);
      
      this.ctx.strokeStyle = '#facc15';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(lx, ly);
      this.ctx.lineTo(tx, ty);
      this.ctx.stroke();
    };
    
    if (shotName === 'cover') {
      drawCallout('3 GALLERIES · 9 RELICS · ESCAPE UNSEEN', 640, 578, 640, 640);
    } else if (shotName === 'sneak') {
      drawCallout('HIDDEN BEHIND CRATE (CONE STOPS)', 200, 220, 110, 130);
    } else if (shotName === 'alert') {
      drawCallout('WARDEN ALERTED · METER NEAR FULL', 500, 360, 480, 240);
    } else if (shotName === 'exit') {
      drawCallout('ALL RELICS SECURED · EXIT OPEN', 850, 380, 660, 280);
    }
    
    this.ctx.restore();
  }
  
  renderScreen(world) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(4, 6, 11, 0.88)';
    this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    
    this.ctx.textAlign = 'center';
    const cx = CONFIG.WIDTH / 2;
    
    if (world.state === 'title') {
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.fillText('THE LANTERN ARCHIVE', cx, 180);
      
      this.ctx.fillStyle = CONFIG.COLORS.textMuted;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('Infiltrate the moonlit museum, steal 3 relics per gallery, and escape unseen.', cx, 230);
      
      this.ctx.fillStyle = CONFIG.COLORS.uiBg;
      this.ctx.fillRect(cx - 260, 280, 520, 200);
      this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
      this.ctx.strokeRect(cx - 260, 280, 520, 200);
      
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = 'bold 16px sans-serif';
      this.ctx.fillText('MISSION BRIEFING', cx, 315);
      
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = CONFIG.COLORS.textMuted;
      this.ctx.fillText('• Wardens patrol with lanterns and sweeping vision cones.', cx, 355);
      this.ctx.fillText('• Stay in shadows and use bookshelves & crates for cover.', cx, 385);
      this.ctx.fillText('• Running emits noise; hold SHIFT to sneak quietly.', cx, 415);
      this.ctx.fillText('• 3 Galleries of increasing difficulty await.', cx, 445);
      
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.fillRect(cx - 110, 520, 220, 55);
      this.ctx.fillStyle = '#04060b';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('START HEIST', cx, 555);
      
    } else if (world.state === 'paused') {
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = 'bold 40px sans-serif';
      this.ctx.fillText('HEIST PAUSED', cx, 300);
      this.ctx.font = '18px sans-serif';
      this.ctx.fillStyle = CONFIG.COLORS.textMuted;
      this.ctx.fillText('Press P or Esc to resume', cx, 360);
      
    } else if (world.state === 'levelComplete') {
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.font = 'bold 42px sans-serif';
      this.ctx.fillText('GALLERY CLEARED!', cx, 280);
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('All relics secured. Advancing to next gallery...', cx, 340);
      
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.fillRect(cx - 110, 410, 220, 55);
      this.ctx.fillStyle = '#04060b';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('NEXT GALLERY', cx, 445);
      
    } else if (world.state === 'gameOver') {
      this.ctx.fillStyle = CONFIG.COLORS.danger;
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.fillText('CAUGHT!', cx, 280);
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('The Wardens triggered the lockdown alarm. All lives lost.', cx, 340);
      
      this.ctx.fillStyle = CONFIG.COLORS.danger;
      this.ctx.fillRect(cx - 110, 410, 220, 55);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('TRY AGAIN', cx, 445);
      
    } else if (world.state === 'victory') {
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.fillText('HEIST SUCCESSFUL!', cx, 190);
      
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('You escaped into the moonlit night with all priceless relics!', cx, 250);
      
      this.ctx.fillStyle = CONFIG.COLORS.uiBg;
      this.ctx.fillRect(cx - 240, 290, 480, 180);
      this.ctx.strokeStyle = CONFIG.COLORS.uiBorder;
      this.ctx.strokeRect(cx - 240, 290, 480, 180);
      
      this.ctx.fillStyle = CONFIG.COLORS.lamp;
      this.ctx.font = 'bold 16px sans-serif';
      this.ctx.fillText('MISSION SCORE BREAKDOWN', cx, 325);
      
      this.ctx.fillStyle = CONFIG.COLORS.text;
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText(`Total Time: ${world.score.time.toFixed(1)}s`, cx, 365);
      this.ctx.fillText(`Alarm Detections: ${world.score.detections}`, cx, 395);
      this.ctx.fillText(`Relics Secured: ${world.score.relicsCollected}/9`, cx, 425);
      
      this.ctx.fillStyle = CONFIG.COLORS.success;
      this.ctx.fillRect(cx - 110, 500, 220, 55);
      this.ctx.fillStyle = '#04060b';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText('PLAY AGAIN', cx, 535);
    }
    
    this.ctx.restore();
  }
}
