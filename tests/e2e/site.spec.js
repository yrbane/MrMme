import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/is-ready/);
});

test('affiche les 18 blagues et 19 cachets', async ({ page }) => {
  await expect(page.locator('.joke')).toHaveCount(18);
  await expect(page.locator('button.pill')).toHaveCount(19);
  await expect(page.locator('.joke').first()).toContainText('Turdéolmatrabeulsinsofareuwé');
  await expect(page.locator('.joke').first()).toContainText('ont une fille');
  await expect(page.locator('.joke__variant-label')).toHaveText('Version Cannadienne!');
});

test('un clic lance le son, un second clic l’arrête', async ({ page }) => {
  const pill = page.locator('.joke[data-id="tazief"] button.pill');
  await pill.click();
  await expect(pill).toHaveAttribute('aria-pressed', 'true');
  await expect(pill).toHaveClass(/is-playing/);
  await pill.click();
  await expect(pill).toHaveAttribute('aria-pressed', 'false');
});

test('une seule voix à la fois', async ({ page }) => {
  const first = page.locator('.joke[data-id="tazief"] button.pill');
  const second = page.locator('.joke[data-id="keurienhici"] button.pill');
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await second.click();
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  await expect(first).toHaveAttribute('aria-pressed', 'false');
});

test('le son se termine tout seul et libère le bouton', async ({ page }) => {
  // On intercepte les objets Audio créés par la page pour sauter à la fin du fichier
  await page.addInitScript(() => {
    window.__audios = [];
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(src) {
        super(src);
        window.__audios.push(this);
      }
    };
  });
  await page.goto('/');
  const pill = page.locator('.joke[data-id="keurienhici"] button.pill');
  await pill.click();
  await expect(pill).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(async () => {
    const [audio] = window.__audios;
    if (!Number.isFinite(audio.duration)) await new Promise((resolve) => audio.addEventListener('loadedmetadata', resolve, { once: true }));
    audio.currentTime = audio.duration - 0.2;
  });
  await expect(pill).toHaveAttribute('aria-pressed', 'false', { timeout: 5_000 });
});

test('les fichiers audio répondent', async ({ request }) => {
  const jokes = await (await request.get('/data/jokes.json')).json();
  for (const joke of jokes) {
    const response = await request.get(`/${joke.sound}`);
    expect(response.ok(), joke.sound).toBe(true);
    expect(response.headers()['content-type']).toBe('audio/mpeg');
  }
});

test('aucun scroll horizontal', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('la version affichée correspond au package.json', async ({ page, request }) => {
  const meta = await page.locator('meta[name="version"]').getAttribute('content');
  await expect(page.locator('.footer__version')).toHaveText(`v${meta}`);
});
