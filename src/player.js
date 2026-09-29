/**
 * Lecteur audio à voix unique : un seul son joue à la fois.
 * `createAudio` est injecté pour rester testable sans navigateur.
 */
export function createPlayer({ createAudio = (src) => new Audio(src), onPlay = () => {}, onStop = () => {} } = {}) {
  const cache = new Map();
  let current = null;

  const getAudio = (src) => {
    if (!cache.has(src)) {
      const audio = createAudio(src);
      audio.addEventListener('ended', () => {
        if (current === src) {
          current = null;
          onStop(src);
        }
      });
      cache.set(src, audio);
    }
    return cache.get(src);
  };

  const stop = () => {
    if (current === null) return;
    const src = current;
    const audio = cache.get(src);
    audio.pause();
    audio.currentTime = 0;
    current = null;
    onStop(src);
  };

  const toggle = (src) => {
    if (current === src) {
      stop();
      return;
    }
    stop();
    const audio = getAudio(src);
    current = src;
    onPlay(src);
    audio.play().catch(() => {
      // Lecture refusée (autoplay bloqué, fichier absent) : on rétablit l'état
      if (current === src) {
        current = null;
        onStop(src);
      }
    });
  };

  return {
    toggle,
    stop,
    get current() {
      return current;
    },
  };
}
