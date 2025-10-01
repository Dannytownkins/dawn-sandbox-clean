/**
 * Custom Cart Functionality
 * Dawn theme handles cart drawer - this file is for additional cart features
 */

/**
 * Mobile Menu Drawer
 */
(() => {
  const drawer = document.querySelector('.mobile-drawer');
  if (!drawer) return;

  const openers = document.querySelectorAll('[data-open-menu]');
  const closers = drawer.querySelectorAll('[data-close-menu]');

  const openMenu = () => {
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
  };

  const closeMenu = () => {
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');
  };

  openers.forEach((btn) => {
    btn.addEventListener('click', openMenu);
  });

  closers.forEach((btn) => {
    btn.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) {
      closeMenu();
    }
  });
})();
