(() => {
  const cards = document.querySelectorAll('.project-card');
  const singles = [...document.querySelectorAll('.reveal')].filter(
    (el) => !el.closest('.project-card')
  );

  if (!singles.length && !cards.length) return;

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

        if (target.classList.contains('project-card')) {
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
  cards.forEach((el) => observer.observe(el));
})();
