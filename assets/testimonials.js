/**
 * Testimonials Slider Logic
 * Lightweight vanilla JS slider with translateX and button controls
 */

(() => {
  const slider = document.querySelector('[data-testimonials-slider]');
  if (!slider) return;

  const prevBtn = document.querySelector('[data-testimonials-prev]');
  const nextBtn = document.querySelector('[data-testimonials-next]');

  if (!prevBtn || !nextBtn) return;

  const scrollStep = () => slider.clientWidth * 0.85;

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: scrollStep(), behavior: 'smooth' });
  });

  // Optional: Auto-play functionality (uncomment if desired)
  /*
  let autoPlayInterval;
  
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      slider.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    }, 5000);
  };
  
  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };
  
  // Start auto-play on load
  startAutoPlay();
  
  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);
  
  // Pause on focus
  slider.addEventListener('focusin', stopAutoPlay);
  slider.addEventListener('focusout', startAutoPlay);
  */
})();
