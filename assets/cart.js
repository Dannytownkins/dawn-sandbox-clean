/**
 * Cart Drawer Functionality + AJAX Add to Cart
 * Handles opening/closing the mini cart drawer and intercepting ATC submissions
 */

(() => {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;

  const openers = document.querySelectorAll('[data-open-cart]');
  const closers = drawer.querySelectorAll('[data-close-cart]');

  // Open drawer function
  const openDrawer = () => {
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');

    // Focus first interactive element
    const firstFocusable = drawer.querySelector('button, a');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  };

  // Close drawer function
  const closeDrawer = () => {
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');

    // Return focus to cart icon
    const cartIcon = document.getElementById('cart-icon-bubble');
    if (cartIcon) {
      cartIcon.focus();
    }
  };

  // Open drawer on click
  openers.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  // Close drawer
  closers.forEach((button) => {
    button.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) {
      closeDrawer();
    }
  });

  // AJAX Add to Cart - Intercept form submissions
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.action.includes('/cart/add')) return;

    e.preventDefault();

    // Show loading state on submit button
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Adding...</span>';
    }

    const fd = new FormData(form);

    try {
      // Add item to cart via AJAX
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Add to cart failed');

      // Refresh cart data
      const cartRes = await fetch('/cart.js', {
        headers: { Accept: 'application/json' },
      });
      const cart = await cartRes.json();

      // Update cart count badge
      const countBadge = document.querySelector('.cart-count-bubble span[aria-hidden="true"]');
      if (countBadge && cart.item_count > 0) {
        countBadge.textContent = cart.item_count;
      }

      // Reload drawer content
      const drawerRes = await fetch(window.location.href);
      const html = await drawerRes.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newDrawer = doc.getElementById('cart-drawer');
      if (newDrawer) {
        drawer.innerHTML = newDrawer.innerHTML;
        // Re-attach close listeners
        drawer.querySelectorAll('[data-close-cart]').forEach((btn) => {
          btn.addEventListener('click', closeDrawer);
        });
      }

      // Open the drawer
      openDrawer();

      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Could not add to cart. Please try again or contact support.');

      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
})();

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
