import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const jokes = JSON.parse(readFileSync(resolve(root, 'data/jokes.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const html = readFileSync(resolve(root, 'index.html'), 'utf8');

describe('data/jokes.json', () => {
  it('contient les 18 blagues du Flash original', () => {
    expect(jokes).toHaveLength(18);
  });

  it('a des identifiants uniques et des champs complets', () => {
    const ids = new Set(jokes.map((j) => j.id));
    expect(ids.size).toBe(jokes.length);
    for (const j of jokes) {
      expect(['fils', 'fille']).toContain(j.child);
      expect(j.name.length).toBeGreaterThan(0);
      expect(Array.isArray(j.variants)).toBe(true);
    }
  });

  it('référence uniquement des fichiers présents', () => {
    for (const j of jokes) {
      expect(existsSync(resolve(root, j.pill)), j.pill).toBe(true);
      expect(existsSync(resolve(root, j.sound)), j.sound).toBe(true);
      for (const v of j.variants) expect(existsSync(resolve(root, v.sound)), v.sound).toBe(true);
    }
  });

  it('a une seule variante : la version canadienne de Situtrouvpa', () => {
    const withVariants = jokes.filter((j) => j.variants.length > 0);
    expect(withVariants.map((j) => j.id)).toEqual(['situtrouvpa']);
    expect(withVariants[0].variants[0].label).toBe('Version Cannadienne!');
  });
});

describe('version affichée', () => {
  it('index.html affiche la version de package.json', () => {
    expect(html).toContain(`v${pkg.version}`);
    expect(html).toContain(`<meta name="version" content="${pkg.version}">`);
  });
});
