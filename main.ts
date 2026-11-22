import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

// Ensure output dir exists
fs.mkdirSync(outputDir, { recursive: true });

// Helper to copy directory recursively
function copyRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    throw new Error(`Directory or file does not exist: ${src}`);
  }
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Verify game/ and screenshots/ exist, throw if missing
const gameDir = path.join(__dirname, 'game');
const screenshotsDir = path.join(__dirname, 'screenshots');

if (!fs.existsSync(gameDir)) {
  throw new Error(`Missing required game directory: ${gameDir}`);
}
if (!fs.existsSync(screenshotsDir)) {
  throw new Error(`Missing required screenshots directory: ${screenshotsDir}`);
}

// Copy game and screenshots to output dir
const outGameDir = path.join(outputDir, 'game');
const outScreenshotsDir = path.join(outputDir, 'screenshots');

copyRecursive(gameDir, outGameDir);
copyRecursive(screenshotsDir, outScreenshotsDir);

// Build dossier with two arguments: outputDir and caps object
const dossierBytes = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000
});

fs.writeFileSync(path.join(outputDir, 'dossier.json'), dossierBytes);
console.log('Dossier built successfully at:', outputDir);
