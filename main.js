document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Header ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Drawer Menu ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-drawer-close');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on clicking mobile nav link
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeMobileMenu);
  });

  // --- 3. Scroll Reveal System ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Interactive Moodboard Configurator ---
  const upholsteryDots = document.querySelectorAll('#upholstery-dots .color-dot');
  const upholsterySelectionText = document.getElementById('upholstery-name');
  const upholsteryOverlay = document.getElementById('upholstery-overlay');

  const frameDots = document.querySelectorAll('#frame-dots .color-dot');
  const frameSelectionText = document.getElementById('frame-name');
  const frameOverlay = document.getElementById('frame-overlay');

  const productMainImage = document.getElementById('product-main-image');

  // Handle Upholstery configuration click
  upholsteryDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Toggle active states
      upholsteryDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Update name text
      const name = dot.getAttribute('data-name');
      const colorVal = dot.getAttribute('data-color');
      upholsterySelectionText.textContent = name;

      // Update upholstery visual overlay with blend mode color
      if (upholsteryOverlay) {
        upholsteryOverlay.style.backgroundColor = colorVal;
        upholsteryOverlay.style.opacity = '0.35';
      }

      // Add a scale pop interaction
      if (productMainImage) {
        productMainImage.style.transform = 'scale(1.05)';
        setTimeout(() => {
          productMainImage.style.transform = '';
        }, 300);
      }
    });
  });

  // Handle Frame configuration click
  frameDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Toggle active states
      frameDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Update name text
      const name = dot.getAttribute('data-name');
      const colorVal = dot.getAttribute('data-color');
      frameSelectionText.textContent = name;

      // Update frame visual overlay
      if (frameOverlay) {
        frameOverlay.style.backgroundColor = colorVal;
        frameOverlay.style.opacity = '0.15';
      }

      // Add scale pop interaction
      if (productMainImage) {
        productMainImage.style.transform = 'scale(1.05)';
        setTimeout(() => {
          productMainImage.style.transform = '';
        }, 300);
      }
    });
  });

  // --- 5. Interactive Category Showcase ---
  const categoryItems = document.querySelectorAll('.category-item');
  const categoryImages = document.querySelectorAll('.showcase-img');
  const categoryOverlayChair = document.getElementById('category-overlay-chair');

  categoryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const activeIndex = parseInt(item.getAttribute('data-index'), 10);

      // Reset active categories
      categoryItems.forEach(cat => cat.classList.remove('active'));
      item.classList.add('active');

      // Cross-fade image showcase
      categoryImages.forEach((img, idx) => {
        if (idx === activeIndex) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });

      // Special overlay logic for Lounge Chairs (index 2)
      if (categoryOverlayChair) {
        if (activeIndex === 2) {
          categoryOverlayChair.classList.add('active');
        } else {
          categoryOverlayChair.classList.remove('active');
        }
      }
    });
  });

  // --- 6. Newsletter Form Submission Handling ---
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput.value.trim();

      if (email) {
        // High-end success message inside the newsletter block
        const container = newsletterForm.parentElement;
        container.style.opacity = '0';
        setTimeout(() => {
          container.innerHTML = `
            <div style="padding: 1.5rem 0; text-align: left; animation: fadeIn 0.8s forwards;">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-bottom: 1rem;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <h3 style="font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem; font-family: 'Outfit', sans-serif;">Thank you!</h3>
              <p style="color: #cbd5e1; font-size: 0.9375rem; font-family: 'Inter', sans-serif; line-height: 1.5;">You have successfully subscribed with <strong>${email}</strong>.<br>We'll send design inspiration and news to your inbox.</p>
            </div>
          `;
          container.style.opacity = '1';
        }, 400);
      }
    });
  }

  // --- 7. Footer Copyright Year Dynamic Insertion ---
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Add support for custom keyframe animations
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);
});
