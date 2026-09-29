import { createPlayer } from './player.js';
import { renderJokes } from './render.js';

const root = document.getElementById('jokes');

// Le player et le rendu se référencent mutuellement : on relie les callbacks après coup
let ui = { onPlay() {}, onStop() {} };
const player = createPlayer({
  onPlay: (src) => ui.onPlay(src),
  onStop: (src) => ui.onStop(src),
});

fetch('data/jokes.json')
  .then((response) => response.json())
  .then((jokes) => {
    ui = renderJokes(root, jokes, player);
    document.body.classList.add('is-ready');
  })
  .catch((error) => {
    root.innerHTML = '<li class="joke joke--error">Impossible de charger les blagues.</li>';
    console.error(error);
  });
