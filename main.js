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

  // --- 4. Interactive Moodboard Configurator (3D Canvas) ---
  const container = document.getElementById('canvas-3d');
  let scene, camera, renderer, controls;
  let chairGroup;
  let upholsteryMaterial, frameMaterial;
  let isUserInteracting = false;

  if (container) {
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 3.0;
    controls.maxDistance = 6.0;

    controls.addEventListener('start', () => {
      isUserInteracting = true;
    });
    controls.addEventListener('end', () => {
      isUserInteracting = false;
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(8, 12, 8);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.bias = -0.001;
    scene.add(spotLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(-8, 8, -8);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xfff1e0, 0.6, 15);
    pointLight.position.set(0, 4, -4);
    scene.add(pointLight);

    // Group for the chair
    chairGroup = new THREE.Group();
    chairGroup.position.set(0, -0.8, 0); // Center the chair around the pivot
    scene.add(chairGroup);

    // Materials mapping to colors
    upholsteryMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b0705a'), // Default: Boucle Terra Cotta
      roughness: 0.8,
      metalness: 0.0,
    });

    frameMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a1a1a'), // Default: Charcoal Black
      roughness: 0.35,
      metalness: 0.2,
    });

    // Build Chair Model (from ModelChair.jsx)
    // 1. Seat
    const seatGeo = new THREE.BoxGeometry(1.6, 0.2, 1.6);
    const seatMesh = new THREE.Mesh(seatGeo, upholsteryMaterial);
    seatMesh.position.set(0, 1.2, 0);
    seatMesh.castShadow = true;
    seatMesh.receiveShadow = true;
    chairGroup.add(seatMesh);

    // 2. Backrest
    const backGeo = new THREE.BoxGeometry(1.6, 1.4, 0.2);
    const backMesh = new THREE.Mesh(backGeo, upholsteryMaterial);
    backMesh.position.set(0, 2.0, -0.7);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    chairGroup.add(backMesh);

    // 3. Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.04, 1.2, 16);
    const legPositions = [
      [-0.7, 0.6, 0.7],
      [0.7, 0.6, 0.7],
      [-0.7, 0.6, -0.7],
      [0.7, 0.6, -0.7]
    ];

    legPositions.forEach(pos => {
      const legMesh = new THREE.Mesh(legGeo, frameMaterial);
      legMesh.position.set(pos[0], pos[1], pos[2]);
      legMesh.castShadow = true;
      chairGroup.add(legMesh);
    });

    // Ground Shadow Plane
    const floorGeo = new THREE.PlaneGeometry(15, 15);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.8;
    floor.receiveShadow = true;
    scene.add(floor);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      if (!isUserInteracting && chairGroup) {
        chairGroup.rotation.y += 0.003;
      }

      if (controls) {
        controls.update();
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
  }

  const upholsteryDots = document.querySelectorAll('#upholstery-dots .color-dot');
  const upholsterySelectionText = document.getElementById('upholstery-name');

  const frameDots = document.querySelectorAll('#frame-dots .color-dot');
  const frameSelectionText = document.getElementById('frame-name');

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

      // Update upholstery 3D material color and properties
      if (upholsteryMaterial) {
        upholsteryMaterial.color.set(colorVal);
        if (name.includes('Leather')) {
          upholsteryMaterial.roughness = 0.4;
          upholsteryMaterial.metalness = 0.1;
        } else if (name.includes('Velvet') || name.includes('Boucle')) {
          upholsteryMaterial.roughness = 0.8;
          upholsteryMaterial.metalness = 0.0;
        } else {
          upholsteryMaterial.roughness = 0.9;
          upholsteryMaterial.metalness = 0.0;
        }
      }

      // Add a scale pop interaction
      if (chairGroup) {
        chairGroup.scale.set(1.06, 1.06, 1.06);
        setTimeout(() => {
          if (chairGroup) chairGroup.scale.set(1, 1, 1);
        }, 200);
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

      // Update frame 3D material color
      if (frameMaterial) {
        frameMaterial.color.set(colorVal);
      }

      // Add scale pop interaction
      if (chairGroup) {
        chairGroup.scale.set(1.06, 1.06, 1.06);
        setTimeout(() => {
          if (chairGroup) chairGroup.scale.set(1, 1, 1);
        }, 200);
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

/* =====================
   MEGA MENU PREVIEW
===================== */

const megaLinks = document.querySelectorAll('.mega-column a');

const previewImage =
document.getElementById('megaPreviewImage');

const previewTitle =
document.getElementById('megaPreviewTitle');

const previewText =
document.getElementById('megaPreviewText');

const previewData = {

  "Executive Chairs": {
    img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1",
    text: "Premium executive seating solutions."
  },

  "Conference Chairs": {
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    text: "Comfortable meeting room seating."
  },

  "Task Chairs": {
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    text: "Ergonomic chairs for daily work."
  },

  "Lounge Chairs": {
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    text: "Relaxed seating for collaborative spaces."
  },

  "Sofas": {
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    text: "Stylish sofas for modern interiors."
  }
};

megaLinks.forEach(link => {

  link.addEventListener('mouseenter', () => {

    const item = link.textContent.trim();

    if(!previewData[item]) return;

    previewImage.src =
      previewData[item].img;

    previewTitle.textContent =
      item;

    previewText.textContent =
      previewData[item].text;
  });

});
