# Changelog

## 1.0.0 — 2026-09-29 · « Monsieur et Madame reprennent vie »

- Décompilation de `mrmme.swf` (Flash 7, 2004) avec JPEXS : 18 blagues, 19 sons MP3, 18 photos de cachets, textes et positions extraits.
- Portage en HTML/CSS/JS vanilla, sans build : fond noir, Comic Sans (repli Comic Neue), lettres espacées, cachets cliquables à droite comme dans l'original.
- Lecteur audio à voix unique : un clic joue la réponse, un second clic l'arrête, un autre cachet coupe le précédent. Halo lumineux sur le cachet en cours de lecture.
- Ligne « Situtrouvpa » avec sa « Version Cannadienne! ».
- Accessibilité : boutons étiquetés, `aria-pressed`, navigation clavier, respect de `prefers-reduced-motion`.
- Mise en page responsive : passage en colonne sous 640 px, aucun scroll horizontal.
- Tests : 16 tests unitaires Vitest (player, rendu, cohérence des données, version affichée) et 8 tests E2E Playwright (desktop + mobile).
- CI GitHub Actions : tests puis déploiement automatique sur GitHub Pages.
