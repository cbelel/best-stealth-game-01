export function stageShot(name, world) {
  if (name === 'cover') {
    world.state = 'title';
  } else if (name === 'sneak') {
    world.state = 'play';
    world.player.x = 240;
    world.player.y = 240;
    world.player.sneaking = true;
    if (world.guards.length > 0) {
      world.guards[0].x = 400;
      world.guards[0].y = 200;
      world.guards[0].angle = Math.PI;
    }
  } else if (name === 'alert') {
    world.state = 'play';
    world.detectionMeter = 0.88;
    world.player.x = 480;
    world.player.y = 360;
    if (world.guards.length > 0) {
      world.guards[0].x = 560;
      world.guards[0].y = 360;
      world.guards[0].angle = 0;
      world.guards[0].state = 'alert';
    }
  } else if (name === 'exit') {
    world.state = 'play';
    // Collect all relics
    world.level.relics.forEach(r => r.collected = true);
    world.player.x = world.level.exit.x + 20;
    world.player.y = world.level.exit.y + 40;
  }
}
