/**
 * Lazy Loading with IntersectionObserver
 * Enhances images with loading="lazy" fallback
 */

(function() {
  // Check for IntersectionObserver support
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
    return;
  }

  // Intersection Observer config
  const config = {
    rootMargin: '50px 0px',
    threshold: 0.01
  };

  // Callback function
  const onIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // Add decoding async
        img.decoding = 'async';
        
        // Remove data attributes
        delete img.dataset.src;
        delete img.dataset.srcset;
        
        // Mark as loaded
        img.classList.add('lazy-loaded');
        
        // Stop observing
        observer.unobserve(img);
      }
    });
  };

  // Create observer
  const observer = new IntersectionObserver(onIntersection, config);

  // Observe all lazy images
  const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
  lazyImages.forEach(img => {
    // Add decoding async to all images
    img.decoding = 'async';
    
    // Only observe images with data-src
    if (img.dataset.src) {
      observer.observe(img);
    }
  });

  // Handle dynamically added images
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'IMG') {
          node.decoding = 'async';
          if (node.dataset.src) {
            observer.observe(node);
          }
        } else if (node.querySelectorAll) {
          node.querySelectorAll('img[data-src]').forEach(img => {
            img.decoding = 'async';
            observer.observe(img);
          });
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
