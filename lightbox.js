(() => {
  const items = document.querySelectorAll(
    '.media__item:has(.media__image, .media__video)'
  );
  if (!items.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Aperçu du média');
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Fermer">
      <img src="assets/close.svg" alt="" width="32" height="32" />
    </button>
    <div class="lightbox__backdrop" aria-hidden="true"></div>
    <div class="lightbox__stage"></div>
  `;

  document.body.appendChild(lightbox);

  const closeBtn = lightbox.querySelector('.lightbox__close');
  const backdrop = lightbox.querySelector('.lightbox__backdrop');
  const stage = lightbox.querySelector('.lightbox__stage');
  let lastFocus = null;
  let currentMedia = null;

  const getSliderMedias = (media) => {
    const slider = media.closest('.media--overflow');
    if (!slider) return [media];

    return [...slider.querySelectorAll('.media__track .media__item')]
      .map((item) => item.querySelector('.media__image, .media__video'))
      .filter(Boolean);
  };

  const syncSlider = (media) => {
    const item = media.closest('.media__item');
    item?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const renderMedia = (source) => {
    stage.querySelectorAll('video').forEach((video) => {
      video.pause();
    });
    stage.replaceChildren();

    const frame = document.createElement('div');
    frame.className = 'lightbox__frame';

    if (source.matches('.media__image')) {
      const img = document.createElement('img');
      img.className = 'lightbox__media lightbox__media--image';
      img.src = source.currentSrc || source.src;
      img.alt = source.alt || '';
      frame.appendChild(img);
    } else if (source.matches('.media__video')) {
      const video = document.createElement('video');
      video.className = 'lightbox__media lightbox__media--video';
      video.src = source.currentSrc || source.src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      if (source.getAttribute('aria-label')) {
        video.setAttribute('aria-label', source.getAttribute('aria-label'));
      }
      frame.appendChild(video);
    }

    stage.appendChild(frame);
  };

  const close = () => {
    stage.querySelectorAll('video').forEach((video) => {
      video.pause();
    });
    stage.replaceChildren();
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lastFocus?.focus();
    lastFocus = null;
    currentMedia = null;
  };

  const showMedia = (source, { focusClose = false } = {}) => {
    currentMedia = source;
    renderMedia(source);
    syncSlider(source);

    if (focusClose) {
      closeBtn.focus();
    }
  };

  const navigate = (direction) => {
    if (!currentMedia) return;

    const group = getSliderMedias(currentMedia);
    if (group.length < 2) return;

    const index = group.indexOf(currentMedia);
    if (index === -1) return;

    const nextIndex = (index + direction + group.length) % group.length;
    showMedia(group[nextIndex]);
  };

  const open = (source) => {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    showMedia(source, { focusClose: true });
  };

  items.forEach((item) => {
    item.classList.add('media__item--interactive');

    if (item.querySelector('.media__open')) return;

    const media = item.querySelector('.media__image, .media__video');
    const label =
      media?.getAttribute('aria-label') ||
      media?.getAttribute('alt') ||
      'Agrandir le média';

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'media__open';
    openBtn.setAttribute('aria-label', label);
    openBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      if (media) open(media);
    });

    item.appendChild(openBtn);
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (!currentMedia || getSliderMedias(currentMedia).length < 2) return;

      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
})();
