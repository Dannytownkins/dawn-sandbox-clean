(() => {
  const html = document.documentElement;
  const drawer = document.querySelector('.cart-drawer, cart-drawer');
  const unlock = () => html.classList.remove('cart-open');
  const lock = () => html.classList.add('cart-open');

  // Fallback: observe class changes to detect open/close
  if (drawer) {
    const obs = new MutationObserver(() => {
      const open =
        drawer.classList.contains('is-open') ||
        drawer.getAttribute('open') === 'true' ||
        drawer.getAttribute('aria-hidden') === 'false';
      open ? lock() : unlock();
    });
    obs.observe(drawer, { attributes: true, attributeFilter: ['class', 'open', 'aria-hidden'] });
  }

  // Hard reset on navigation/back-forward cache
  window.addEventListener('pageshow', unlock);
  document.addEventListener('shopify:section:load', unlock);
})();
