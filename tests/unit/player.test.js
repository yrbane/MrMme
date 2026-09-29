import { describe, it, expect, vi } from 'vitest';
import { createPlayer } from '../../src/player.js';

// Faux Audio : on contrôle play/pause et la fin de lecture à la main
function fakeAudioFactory() {
  const instances = [];
  const createAudio = (src) => {
    const audio = {
      src,
      paused: true,
      currentTime: 0,
      listeners: {},
      play: vi.fn(() => { audio.paused = false; return Promise.resolve(); }),
      pause: vi.fn(() => { audio.paused = true; }),
      addEventListener: (type, fn) => { audio.listeners[type] = fn; },
      end() { audio.paused = true; audio.listeners.ended?.(); },
    };
    instances.push(audio);
    return audio;
  };
  return { createAudio, instances };
}

describe('createPlayer', () => {
  it('joue le son demandé et signale le démarrage', () => {
    const { createAudio, instances } = fakeAudioFactory();
    const onPlay = vi.fn();
    const player = createPlayer({ createAudio, onPlay });

    player.toggle('a.mp3');

    expect(instances[0].play).toHaveBeenCalledOnce();
    expect(onPlay).toHaveBeenCalledWith('a.mp3');
    expect(player.current).toBe('a.mp3');
  });

  it('arrête le son en cours quand on re-clique dessus', () => {
    const { createAudio, instances } = fakeAudioFactory();
    const onStop = vi.fn();
    const player = createPlayer({ createAudio, onStop });

    player.toggle('a.mp3');
    player.toggle('a.mp3');

    expect(instances[0].pause).toHaveBeenCalledOnce();
    expect(instances[0].currentTime).toBe(0);
    expect(onStop).toHaveBeenCalledWith('a.mp3');
    expect(player.current).toBeNull();
  });

  it("n'a qu'une seule voix à la fois", () => {
    const { createAudio, instances } = fakeAudioFactory();
    const onStop = vi.fn();
    const player = createPlayer({ createAudio, onStop });

    player.toggle('a.mp3');
    player.toggle('b.mp3');

    expect(instances[0].pause).toHaveBeenCalledOnce();
    expect(onStop).toHaveBeenCalledWith('a.mp3');
    expect(instances[1].play).toHaveBeenCalledOnce();
    expect(player.current).toBe('b.mp3');
  });

  it('signale la fin naturelle du son', () => {
    const { createAudio, instances } = fakeAudioFactory();
    const onStop = vi.fn();
    const player = createPlayer({ createAudio, onStop });

    player.toggle('a.mp3');
    instances[0].end();

    expect(onStop).toHaveBeenCalledWith('a.mp3');
    expect(player.current).toBeNull();
  });

  it('réutilise le même objet Audio pour un même fichier', () => {
    const { createAudio, instances } = fakeAudioFactory();
    const player = createPlayer({ createAudio });

    player.toggle('a.mp3');
    player.toggle('a.mp3');
    player.toggle('a.mp3');

    expect(instances).toHaveLength(1);
    expect(instances[0].play).toHaveBeenCalledTimes(2);
  });
});
