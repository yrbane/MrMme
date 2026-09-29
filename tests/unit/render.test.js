import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderJokes } from '../../src/render.js';

const jokes = [
  { id: 'tazief', name: 'Tazief', child: 'fils', pill: 'assets/pills/tazief.png', sound: 'assets/sounds/tazief.mp3', variants: [] },
  {
    id: 'situtrouvpa', name: 'Situtrouvpa', child: 'fils', pill: 'assets/pills/situtrouvpa.png', sound: 'assets/sounds/situtrouvpa.mp3',
    variants: [{ id: 'situtrouvpa-ca', label: 'Version Cannadienne!', sound: 'assets/sounds/situtrouvpa-ca.mp3' }],
  },
  { id: 'sfoud', name: 'Sfoudmagueul', child: 'fille', pill: 'assets/pills/sfoud.png', sound: 'assets/sounds/sfoud.mp3', variants: [] },
];

function fakePlayer() {
  return { toggle: vi.fn(), current: null };
}

describe('renderJokes', () => {
  let root;
  beforeEach(() => {
    document.body.innerHTML = '<ol id="jokes"></ol>';
    root = document.getElementById('jokes');
  });

  it('crée une ligne par blague avec le texte de l’original', () => {
    renderJokes(root, jokes, fakePlayer());
    const items = root.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('Tazief');
    expect(items[0].textContent).toContain('ont un fils');
    expect(items[2].textContent).toContain('ont une fille');
  });

  it('distingue le nom (couleur nom) du reste de la phrase', () => {
    renderJokes(root, jokes, fakePlayer());
    const name = root.querySelector('li .joke__name');
    expect(name.textContent).toBe('Tazief');
  });

  it('ajoute un bouton par son, avec image et libellé accessible', () => {
    renderJokes(root, jokes, fakePlayer());
    const buttons = root.querySelectorAll('button');
    expect(buttons).toHaveLength(4);
    const first = buttons[0];
    expect(first.getAttribute('aria-label')).toBe('Écouter la réponse pour Monsieur et Madame Tazief');
    expect(first.getAttribute('aria-pressed')).toBe('false');
    expect(first.querySelector('img').getAttribute('src')).toBe('assets/pills/tazief.png');
    expect(first.querySelector('img').getAttribute('alt')).toBe('');
  });

  it('rend la variante avec son étiquette', () => {
    renderJokes(root, jokes, fakePlayer());
    const variant = root.querySelector('[data-sound="assets/sounds/situtrouvpa-ca.mp3"]');
    expect(variant).not.toBeNull();
    expect(variant.closest('.joke__variant').textContent).toContain('Version Cannadienne!');
    expect(variant.getAttribute('aria-label')).toBe('Écouter la réponse pour Monsieur et Madame Situtrouvpa, Version Cannadienne!');
  });

  it('délègue le clic au player', () => {
    const player = fakePlayer();
    renderJokes(root, jokes, player);
    root.querySelector('button').click();
    expect(player.toggle).toHaveBeenCalledWith('assets/sounds/tazief.mp3');
  });

  it('expose des callbacks qui reflètent aria-pressed', () => {
    const player = fakePlayer();
    const { onPlay, onStop } = renderJokes(root, jokes, player);
    const button = root.querySelector('button');
    onPlay('assets/sounds/tazief.mp3');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.classList.contains('is-playing')).toBe(true);
    onStop('assets/sounds/tazief.mp3');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.classList.contains('is-playing')).toBe(false);
  });
});
