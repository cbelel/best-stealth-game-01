import { CONFIG } from './config.js';
import { RNG } from './random.js';
import { World } from './world.js';
import { Input } from './input.js';
import { AudioManager } from './audio.js';
import { Renderer } from './render.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const params = new URLSearchParams(window.location.search);
const seed = parseInt(params.get('seed') || '12345', 10);
const shotName = params.get('shot');

const rng = new RNG(seed);
const world = new World(0, rng);
const input = new Input();
const audio = new AudioManager();
const renderer = new Renderer(ctx);

if (shotName) {
  stageShot(shotName, world);
  renderer.render(world, true, shotName);
  requestAnimationFrame(() => {
    renderer.render(world, true, shotName);
    window.__shotReady = true;
    const status = document.getElementById('status');
    if (status) status.textContent = 'shotReady';
  });
} else {
  let lastTime = performance.now();
  
  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    
    if (input.consumeClick()) {
      audio.init();
      const mouse = input.mouse;
      const cx = CONFIG.WIDTH / 2;
      
      if (world.state === 'title') {
        if (mouse.x >= cx - 110 && mouse.x <= cx + 110 &&
            mouse.y >= 520 && mouse.y <= 575) {
          world.state = 'play';
        }
      } else if (world.state === 'levelComplete') {
        if (mouse.x >= cx - 110 && mouse.x <= cx + 110 &&
            mouse.y >= 410 && mouse.y <= 465) {
          world.loadLevel(world.levelIndex + 1);
          world.state = 'play';
        }
      } else if (world.state === 'gameOver') {
        if (mouse.x >= cx - 110 && mouse.x <= cx + 110 &&
            mouse.y >= 410 && mouse.y <= 465) {
          world.loadLevel(0);
          world.player.lives = 3;
          world.score = { time: 0, detections: 0, relicsCollected: 0 };
          world.state = 'play';
        }
      } else if (world.state === 'victory') {
        if (mouse.x >= cx - 110 && mouse.x <= cx + 110 &&
            mouse.y >= 500 && mouse.y <= 555) {
          world.loadLevel(0);
          world.player.lives = 3;
          world.score = { time: 0, detections: 0, relicsCollected: 0 };
          world.state = 'title';
        }
      }
    }
    
    if (input.isDown('KeyM')) {
      audio.toggleMute();
    }
    
    if (input.isDown('KeyP') || input.isDown('Escape')) {
      if (world.state === 'play') world.state = 'paused';
      else if (world.state === 'paused') world.state = 'play';
    }
    
    if (input.isDown('KeyR')) {
      if (world.state === 'play' || world.state === 'paused') {
        world.loadLevel(world.levelIndex);
        world.state = 'play';
      }
    }
    
    world.update(dt, input, audio);
    renderer.render(world, false);
    
    requestAnimationFrame(loop);
  }
  
  requestAnimationFrame(loop);
}
