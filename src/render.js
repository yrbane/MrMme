/**
 * Construit la liste des blagues dans `root` et branche les boutons sur le player.
 * Retourne les callbacks onPlay/onStop à donner au player pour refléter l'état.
 */
export function renderJokes(root, jokes, player) {
  const buttonsBySound = new Map();

  const makeButton = (joke, sound, suffix = '') => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pill';
    button.dataset.sound = sound;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Écouter la réponse pour Monsieur et Madame ${joke.name}${suffix}`);

    const img = document.createElement('img');
    img.src = joke.pill;
    img.alt = '';
    img.width = 70;
    img.height = 70;
    img.loading = 'lazy';
    button.append(img);

    button.addEventListener('click', () => player.toggle(sound));
    buttonsBySound.set(sound, button);
    return button;
  };

  const fragment = document.createDocumentFragment();
  for (const joke of jokes) {
    const li = document.createElement('li');
    li.className = 'joke';
    li.dataset.id = joke.id;

    const text = document.createElement('p');
    text.className = 'joke__text';
    const name = document.createElement('span');
    name.className = 'joke__name';
    name.textContent = joke.name;
    const child = joke.child === 'fille' ? 'une fille' : 'un fils';
    text.append('...', name, `...ont ${child}...`);

    const actions = document.createElement('div');
    actions.className = 'joke__actions';
    for (const variant of joke.variants) {
      const wrapper = document.createElement('div');
      wrapper.className = 'joke__variant';
      const label = document.createElement('span');
      label.className = 'joke__variant-label';
      label.textContent = variant.label;
      wrapper.append(label, makeButton(joke, variant.sound, `, ${variant.label}`));
      actions.append(wrapper);
    }
    actions.append(makeButton(joke, joke.sound));

    li.append(text, actions);
    fragment.append(li);
  }
  root.replaceChildren(fragment);

  const setState = (sound, playing) => {
    const button = buttonsBySound.get(sound);
    if (!button) return;
    button.setAttribute('aria-pressed', String(playing));
    button.classList.toggle('is-playing', playing);
  };

  return {
    onPlay: (sound) => setState(sound, true),
    onStop: (sound) => setState(sound, false),
  };
}
