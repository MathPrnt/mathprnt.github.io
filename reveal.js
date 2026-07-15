(() => {
  const tiles = document.querySelectorAll('.project-tile');
  const singles = [...document.querySelectorAll('.reveal')].filter(
    (el) => !el.closest('.project-tile')
  );

  if (!singles.length && !tiles.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;

        if (target.classList.contains('project-tile')) {
          target.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('is-visible');
          });
        } else {
          target.classList.add('is-visible');
        }

        observer.unobserve(target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px 0px 0px',
    }
  );

  singles.forEach((el) => observer.observe(el));
  tiles.forEach((el) => observer.observe(el));
})();
