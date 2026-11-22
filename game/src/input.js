export class Input {
  constructor() {
    this.keys = {};
    this.mouse = { x: 640, y: 360, clicked: false, down: false };
    
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (['Space', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        // prevent default scrolling for game keys
      }
    });
    
    window.addEventListener('keyup', e => {
      this.keys[e.code] = false;
    });
    
    window.addEventListener('mousemove', e => {
      const rect = e.target.tagName === 'CANVAS' ? e.target.getBoundingClientRect() : { left: 0, top: 0 };
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    window.addEventListener('mousedown', e => {
      this.mouse.down = true;
      this.mouse.clicked = true;
    });
    
    window.addEventListener('mouseup', e => {
      this.mouse.down = false;
    });
  }
  
  isDown(code) {
    return !!this.keys[code];
  }
  
  consumeClick() {
    const clicked = this.mouse.clicked;
    this.mouse.clicked = false;
    return clicked;
  }
}
