/**
 * Robust Add-to-Cart functionality for product forms
 * Updates variant ID when options change, handles AJAX submission, and integrates with cart drawer
 */

(() => {
  // Find all product forms on the page
  const productForms = document.querySelectorAll('form[data-type="add-to-cart-form"]');

  productForms.forEach((form) => {
    const sectionId = form.closest('[data-section]')?.dataset.section;
    if (!sectionId) return;

    const variantMapEl = document.getElementById(`VariantMap-${sectionId}`);
    const variantMap = variantMapEl ? JSON.parse(variantMapEl.textContent) : null;
    const idInput = form.querySelector('[data-variant-id]');

    if (!variantMap || !idInput) return;

    // 1) Keep hidden variant id in sync with selected options using VariantMap
    const optionSelects = form.querySelectorAll('select[name^="options"], input[name^="options"]');
    const syncVariantId = () => {
      if (!variantMap) return;
      const chosen = Array.from(optionSelects).map((el) => el.value);
      const key = chosen.map((v) => v.toLowerCase().trim()).join('||');
      const match = variantMap.find((v) => v.key === key);
      if (idInput) {
        idInput.value = match ? match.id : '';
      }
    };

    // Initial sync
    syncVariantId();

    // Listen for option changes
    optionSelects.forEach((el) => el.addEventListener('change', syncVariantId));

    // Helper function to show inline error
    const showError = (message) => {
      const errorWrapper = form.querySelector('.product-form__error-message-wrapper');
      const errorMessage = form.querySelector('.product-form__error-message');
      if (errorWrapper && errorMessage) {
        errorMessage.textContent = message;
        errorWrapper.hidden = false;
        errorWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // Fallback to alert if no error wrapper found
        alert(message);
      }
    };

    const hideError = () => {
      const errorWrapper = form.querySelector('.product-form__error-message-wrapper');
      if (errorWrapper) {
        errorWrapper.hidden = true;
      }
    };

    // 2) Intercept submit -> /cart/add.js
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(); // Clear any previous errors

      const fd = new FormData(form);

      // Guard: no variant id -> show helpful message
      const vId = fd.get('id');
      if (!vId) {
        showError('Please select a valid variant.');
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Adding...</span>';
      }

      try {
        const r = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: fd,
        });

        if (!r.ok) {
          // Shopify sends 422 with a useful JSON description
          const err = await r.json().catch(() => ({}));
          throw new Error(err && err.description ? err.description : 'Add to cart failed.');
        }

        // Success: open the drawer + refresh badge
        window.dispatchEvent(new CustomEvent('danliora_add_to_cart'));

        // Update cart badge
        fetch('/cart.js', { headers: { Accept: 'application/json' } })
          .then((r) => r.json())
          .then((cart) => {
            const badge = document.querySelector('[data-cart-count]');
            if (badge) badge.textContent = cart.item_count;
          });
      } catch (err) {
        console.error('ATC error', err);
        showError(err.message); // Show inline error instead of alert
      } finally {
        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  });
})();
