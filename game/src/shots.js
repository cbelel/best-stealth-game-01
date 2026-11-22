export function stageShot(name, world) {
  if (name === 'cover') {
    world.state = 'title';
    world.gameTimer = 0;
  } else if (name === 'sneak') {
    world.state = 'play';
    world.gameTimer = 71;
    world.player.x = 200;
    world.player.y = 220;
    world.player.sneaking = true;
    if (world.guards.length > 0) {
      world.guards[0].x = 350;
      world.guards[0].y = 180;
      world.guards[0].angle = Math.PI;
    }
  } else if (name === 'alert') {
    world.state = 'play';
    world.gameTimer = 41;
    world.detectionMeter = 0.92;
    world.player.x = 420;
    world.player.y = 360;
    if (world.guards.length > 0) {
      world.guards[0].x = 500;
      world.guards[0].y = 360;
      world.guards[0].angle = 0;
      world.guards[0].state = 'alert';
    }
  } else if (name === 'exit') {
    world.state = 'play';
    world.gameTimer = 134;
    world.level.relics.forEach(r => r.collected = true);
    world.player.x = world.level.exit.x + 15;
    world.player.y = world.level.exit.y + 40;
  }
}
