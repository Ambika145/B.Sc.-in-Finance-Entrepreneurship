import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const assetsDir = path.resolve('assets');

const mapping = [
  ['image copy 30.png', 'faculty-1.png'],
  ['image copy 26.png', 'faculty-2.png'],
  ['image copy 27.png', 'faculty-3.png'],
  ['image copy 28.png', 'faculty-4.png'],
  ['image copy 29.png', 'faculty-5.png'],
];

function isOuterBlack(r, g, b) {
  // Only pure letterbox black — avoids eating dark blazer/hair pixels.
  return r <= 15 && g <= 15 && b <= 15;
}

function removeOuterBlackOnly(inputPath, outputPath) {
  const buffer = fs.readFileSync(inputPath);
  const png = PNG.sync.read(buffer);
  const { width, height, data } = png;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const pushIfBackground = (x, y) => {
    const pos = y * width + x;
    if (visited[pos]) return;

    const idx = pos << 2;
    if (!isOuterBlack(data[idx], data[idx + 1], data[idx + 2])) return;

    visited[pos] = 1;
    queue.push(pos);
  };

  for (let x = 0; x < width; x += 1) {
    pushIfBackground(x, 0);
    pushIfBackground(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    pushIfBackground(0, y);
    pushIfBackground(width - 1, y);
  }

  while (queue.length) {
    const pos = queue.pop();
    const x = pos % width;
    const y = (pos - x) / width;

    if (x > 0) pushIfBackground(x - 1, y);
    if (x < width - 1) pushIfBackground(x + 1, y);
    if (y > 0) pushIfBackground(x, y - 1);
    if (y < height - 1) pushIfBackground(x, y + 1);
  }

  let transparentCount = 0;

  for (let pos = 0; pos < width * height; pos += 1) {
    if (!visited[pos]) continue;

    const idx = pos << 2;
    data[idx + 3] = 0;
    transparentCount += 1;
  }

  fs.writeFileSync(outputPath, PNG.sync.write(png));
  return transparentCount;
}

for (const [source, target] of mapping) {
  const inputPath = path.join(assetsDir, source);
  const outputPath = path.join(assetsDir, target);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing source image: ${inputPath}`);
  }

  const transparentCount = removeOuterBlackOnly(inputPath, outputPath);
  console.log(`Prepared ${target} from ${source} (${transparentCount} outer pixels made transparent)`);
}
