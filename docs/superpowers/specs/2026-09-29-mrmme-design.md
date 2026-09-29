# MrMme — portage JS d'un Flash « Monsieur et Madame »

Date : 2026-09-29 · Statut : validé en discussion

## Contexte

`mrmme.swf` (Flash 7, 900×1500, une seule frame, aucun ActionScript) affiche 18 blagues (19 boutons)
« Monsieur et Madame X ont un fils/une fille ». À droite de chaque ligne, un bouton rond
(photo de cachet) joue un MP3 avec la réponse parlée. La ligne « Situtrouvpa » a un second
bouton « Version Cannadienne! ». Aucun lien externe.

## Objectif

Recréer la page en HTML/CSS/JS vanilla, fidèle à l'original (fond noir, Comic Sans,
cachets à droite, clic = son), accessible et lisible sur mobile, déployée sur GitHub Pages.

## Décisions

- Stack : HTML + CSS + JS modules, zéro build pour le site. Node uniquement pour les tests
  et le packaging (`scripts/build.js` copie le site dans `dist/`).
- Données : `data/jokes.json` (id, name, child, pill, sound, variants[]).
- Assets : `assets/pills/<id>.png` aux dimensions d'origine, `assets/sounds/<id>.mp3` tels
  quels (pas de ré-encodage, fidélité).
- Police : `"Comic Sans MS", "Comic Neue", cursive` ; Comic Neue via Google Fonts. La police
  extraite du SWF n'est pas redistribuée (propriétaire).
- Lecture : une seule voix à la fois. Clic sur le cachet en cours = stop. Clic sur un autre =
  stop du précédent puis lecture. `aria-pressed` reflète l'état.
- Responsive : en dessous de 640 px la ligne passe en colonne. Aucun scroll horizontal.
- Version : lue depuis `package.json` et affichée dans le pied de page (injectée dans
  `index.html` par le bump, vérifiée par un test).

## Modules

- `src/player.js` : `createPlayer({ createAudio })` → `{ toggle(src), stop(), current }`,
  émet `play`/`stop` via callbacks. Testé unitairement avec un faux `Audio`.
- `src/render.js` : `renderJokes(root, jokes, player)` construit la liste `<ol>`, les boutons
  et les libellés accessibles. Testé sous jsdom.
- `src/main.js` : charge le JSON, instancie le player, rend la page.

## Tests

- Vitest (jsdom) : player, render, cohérence des données (chaque fichier référencé existe,
  version index.html = package.json).
- Playwright (Chromium) : 18 lignes et 19 boutons rendus, toggle `aria-pressed`, exclusivité entre deux
  cachets, capture d'écran desktop + mobile.

## Publication

Repo public `yrbane/MrMme`, CI GitHub Actions (tests → Pages), tag `v1.0.0`, release avec
`mrmme-site.zip`, mise à jour du profil `yrbane/yrbane` et du site `yrbane.github.io`.
