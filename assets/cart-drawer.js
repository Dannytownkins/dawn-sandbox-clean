/**
 * Cart Drawer Functionality
 * Handles opening/closing, refreshing content, and cart badge updates
 */

window.CartDrawer = {
  drawer: null,
  isOpen: false,

  init() {
    this.drawer = document.getElementById('cart-drawer');
    if (!this.drawer) return;

    this.setupEventListeners();
    this.refresh();
  },

  setupEventListeners() {
    // Open drawer triggers
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-cart-drawer]') || e.target.closest('[data-open-cart]')) {
        e.preventDefault();
        this.open();
      }
    });

    // Close drawer triggers
    this.drawer.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-cart]') || e.target === this.drawer.querySelector('.cart-drawer__overlay')) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Listen for add to cart events
    window.addEventListener('danliora_add_to_cart', () => {
      this.refresh();
      this.open();
    });

    // Also listen for Dawn's standard cart refresh event
    document.documentElement.addEventListener('cart:refresh', () => {
      this.refresh();
      this.open();
    });
  },

  open() {
    if (!this.drawer) return;

    this.drawer.hidden = false;
    this.drawer.setAttribute('aria-hidden', 'false');
    this.isOpen = true;

    // Focus management
    const closeBtn = this.drawer.querySelector('[data-close-cart]');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }

    // Prevent page scroll and ensure top stacking
    document.documentElement.classList.add('cart-open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.drawer) return;

    this.drawer.hidden = true;
    this.drawer.setAttribute('aria-hidden', 'true');
    this.isOpen = false;

    // Restore page scroll
    document.documentElement.classList.remove('cart-open');
    document.body.style.overflow = '';
  },

  async refresh() {
    if (!this.drawer) return;

    // Don't refresh if already refreshing
    if (this._refreshing) return;
    this._refreshing = true;

    try {
      // Use Shopify's section rendering API
      const response = await fetch(window.location.href + '?sections=cart-drawer', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      const cartDrawerHtml = data['cart-drawer'];
      
      if (cartDrawerHtml) {
        // Parse the HTML and extract just the body content
        const parser = new DOMParser();
        const doc = parser.parseFromString(cartDrawerHtml, 'text/html');
        const newBody = doc.querySelector('.cart-drawer__body');
        const currentBody = this.drawer.querySelector('.cart-drawer__body');
        
        if (newBody && currentBody) {
          currentBody.innerHTML = newBody.innerHTML;
        }
      }

      // Update cart badge
      await this.updateCartBadge();
    } catch (error) {
      console.error('Cart refresh error:', error);
    } finally {
      this._refreshing = false;
    }
  },

  async updateCartBadge() {
    try {
      const response = await fetch('/cart.js', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch cart data');

      const cart = await response.json();
      const badges = document.querySelectorAll('[data-cart-count]');

      badges.forEach((badge) => {
        badge.textContent = cart.item_count;
        badge.style.display = cart.item_count > 0 ? '' : 'none';
      });
    } catch (error) {
      console.error('Cart badge update error:', error);
    }
  },
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CartDrawer.init());
} else {
  CartDrawer.init();
}
