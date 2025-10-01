/**
 * ATC Fallback - Ensures single-variant products never submit empty variant ID
 * Client-side fallback to prevent "Required parameter missing or invalid: id" errors
 */

document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[action="/cart/add"]');
  if (!form) return;

  const idInput = form.querySelector('input[name="id"]');
  if (!idInput || !idInput.value) {
    // Try to recover from a disabled input
    const enabled = form.querySelector('input[name="id"][value]:not([disabled])');
    if (enabled) {
      idInput?.removeAttribute('disabled');
      return;
    }
    e.preventDefault();
    alert('Please select a valid variant.');
  }
});
