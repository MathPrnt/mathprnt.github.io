(() => {
  const nav = document.querySelector('.navigation');
  const toggle = document.querySelector('.navigation__toggle');
  const links = document.querySelectorAll(
    '.navigation__link, .navigation__button, .navigation__brand'
  );

  if (!nav || !toggle) return;

  const mobileQuery = window.matchMedia('(max-width: 1079px)');

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute(
      'aria-label',
      open ? 'Fermer le menu' : 'Ouvrir le menu'
    );
    document.body.classList.toggle('nav-open', open && mobileQuery.matches);
  };

  const close = () => setOpen(false);

  toggle.addEventListener('click', () => {
    if (!mobileQuery.matches) return;
    setOpen(!nav.classList.contains('is-open'));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (!mobileQuery.matches || !nav.classList.contains('is-open')) return;
      close();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
    }
  });

  const handleBreakpointChange = () => {
    if (!mobileQuery.matches) close();
  };

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', handleBreakpointChange);
  } else {
    mobileQuery.addListener(handleBreakpointChange);
  }
})();
