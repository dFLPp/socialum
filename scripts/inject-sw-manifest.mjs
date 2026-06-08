import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const serviceWorkerPath = path.join(distDir, 'sw.js');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await walk(distDir);
const precacheUrls = files
  .map((file) => path.relative(distDir, file).split(path.sep).join('/'))
  .filter((file) => file !== 'sw.js' && !file.endsWith('.map'))
  .sort()
  .map((file) => `./${file}`);

const serviceWorker = await readFile(serviceWorkerPath, 'utf8');
const nextServiceWorker = serviceWorker.replace(
  /const PRECACHE_URLS = \[[\s\S]*?\];/,
  `const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};`
);

await writeFile(serviceWorkerPath, nextServiceWorker);
