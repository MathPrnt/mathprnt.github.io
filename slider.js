(() => {
  const sliders = document.querySelectorAll('.media--overflow');
  if (!sliders.length) return;

  const FRICTION = 0.95;
  const MIN_VELOCITY = 0.05;

  sliders.forEach((media) => {
    const track = media.querySelector('.media__track');
    const progress = media.querySelector('.media__progress');
    const prev = media.querySelector('.media__btn--prev');
    const next = media.querySelector('.media__btn--next');
    if (!track) return;

    const updateThumb = () => {
      if (!progress) return;

      const { clientWidth, scrollWidth, scrollLeft } = track;
      if (scrollWidth <= clientWidth) {
        progress.style.width = '100%';
        progress.style.left = '0%';
        return;
      }

      const thumbRatio = clientWidth / scrollWidth;
      const maxScroll = scrollWidth - clientWidth;
      const travelRatio = 1 - thumbRatio;
      const position = (scrollLeft / maxScroll) * travelRatio;

      progress.style.width = `${thumbRatio * 100}%`;
      progress.style.left = `${position * 100}%`;
    };

    const scrollByPage = (direction) => {
      cancelInertia();
      const amount = track.clientWidth * 0.85;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    /* Drag + inertie */
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let inertiaId = 0;

    const cancelInertia = () => {
      if (inertiaId) {
        cancelAnimationFrame(inertiaId);
        inertiaId = 0;
      }
      velocity = 0;
    };

    const clampScroll = (value) => {
      const max = track.scrollWidth - track.clientWidth;
      return Math.min(Math.max(value, 0), Math.max(max, 0));
    };

    const runInertia = () => {
      if (Math.abs(velocity) < MIN_VELOCITY) {
        cancelInertia();
        return;
      }

      track.scrollLeft = clampScroll(track.scrollLeft + velocity);
      velocity *= FRICTION;

      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft <= 0 || track.scrollLeft >= max) {
        velocity = 0;
      }

      inertiaId = requestAnimationFrame(runInertia);
    };

    const onPointerDown = (event) => {
      if (event.pointerType === 'touch') return;
      if (event.button !== undefined && event.button !== 0) return;
      if (event.target.closest('.media__open')) return;

      cancelInertia();
      delete track.dataset.dragged;
      isDragging = true;
      moved = false;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      lastX = event.clientX;
      lastTime = performance.now();
      velocity = 0;
      track.classList.add('is-dragging');
      track.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;

      const now = performance.now();
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 3) moved = true;

      track.scrollLeft = clampScroll(startScroll - delta);

      const dt = now - lastTime;
      if (dt > 0) {
        const instant = (lastX - event.clientX) / dt;
        velocity = velocity * 0.7 + instant * 0.3;
      }

      lastX = event.clientX;
      lastTime = now;
    };

    const onPointerUp = (event) => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
      try {
        track.releasePointerCapture?.(event.pointerId);
      } catch (_) {}

      if (moved) {
        track.dataset.dragged = 'true';
      }

      // px / ms → px / frame (~16ms)
      velocity *= 16;

      if (moved && Math.abs(velocity) >= MIN_VELOCITY) {
        inertiaId = requestAnimationFrame(runInertia);
      } else {
        velocity = 0;
      }

      moved = false;
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('dragstart', (event) => event.preventDefault());

    prev?.addEventListener('click', () => scrollByPage(-1));
    next?.addEventListener('click', () => scrollByPage(1));
    track.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
    updateThumb();
  });
})();
