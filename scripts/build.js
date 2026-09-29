// Copie le site publiable dans dist/ (aucune transformation, le site n'a pas de build)
import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const entries = ['index.html', 'style.css', 'src', 'data', 'assets'];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const entry of entries) {
  await cp(resolve(root, entry), resolve(dist, entry), { recursive: true });
}
console.log(`dist/ prêt (${entries.join(', ')})`);
