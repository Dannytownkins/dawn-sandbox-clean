/**
 * Cart Drawer Functionality
 * Handles opening/closing the mini cart drawer
 */

(() => {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;

  const openers = document.querySelectorAll('[data-open-cart]');
  const closers = drawer.querySelectorAll('[data-close-cart]');

  // Open drawer
  openers.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.hidden = false;
      drawer.setAttribute('aria-hidden', 'false');

      // Focus first interactive element
      const firstFocusable = drawer.querySelector('button, a');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    });
  });

  // Close drawer
  const closeDrawer = () => {
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');

    // Return focus to cart icon
    const cartIcon = document.getElementById('cart-icon-bubble');
    if (cartIcon) {
      cartIcon.focus();
    }
  };

  closers.forEach((button) => {
    button.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) {
      closeDrawer();
    }
  });
})();
