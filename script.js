(() => {
  // --- Nav ---
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Reveal animation ---
  const targets = document.querySelectorAll('.section, .hero-inner');
  targets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('visible'));
  }

  // --- Project data ---
  const PROJECTS = {
    vl53l8cx: {
      tag: 'Robotics · Perception',
      title: 'VL53L8CX Live Point Cloud + 6-DOF Pose',
      desc: 'ESP-IDF firmware streams an 8×8 depth grid from a ST VL53L8CX ToF sensor at 15 Hz over USB-serial, while a Python visualizer renders it as a GPU-accelerated point cloud with animated sensor beams, a color-coded distance scale, and live 6-DOF pose estimation — no IMU required.',
      bullets: [
        'Threaded serial pipeline drains the buffer and renders the newest valid frame — eliminates the one-frame-stale lag of earlier matplotlib versions',
        'World-frame point memory: ~6 s of past observations re-projected into the current sensor frame, alpha-faded by age',
        'Closed-form Kabsch / Procrustes SVD between consecutive clouds, with translation and rotation sanity gates',
      ],
      stack: ['C · ESP-IDF', 'ESP32-S3', 'Python', 'PyQtGraph + OpenGL', 'Point clouds', 'Sensor fusion'],
      github: 'https://github.com/reubenlavin08/vl53l8cx-pointcloud-esp32',
      gallery: [
        { type: 'video', src: 'assets/projects/pointcloud-demo.mp4' },
      ],
    },
    bullseye: {
      tag: 'Product · Open Source',
      title: 'Bullseye — Marketplace Deal Scorer',
      desc: 'Open-source Windows desktop app that scores Facebook Marketplace listings against real eBay sold-comp data in real time. Deterministic percentile-rank scoring with confidence bands and honesty guards — no LLM in the scoring path, same listing always produces the same score. Free forever for 3 saved searches, Pro for unlimited.',
      bullets: [
        'Tukey-trimmed median + IQR over the eBay Browse API (last 90 days) drives the percentile rank — not "estimated value" or Marketplace-vs-Marketplace',
        'Four-layer adaptive scanner: exponential rate-limit cooldown, slow-start ramp (60s → 20s floor), half-open circuit breaker with cheap HTML probe, round-robin coordinator across watches',
        'Lineage: evolved from salvage-radar → bullseye → bullseye-app over three rewrites',
      ],
      stack: ['Python', 'Supabase Edge Functions', 'eBay Browse API', 'AGPL-3.0', 'Statistical analysis', 'Web scraping'],
      github: 'https://github.com/reubenlavin08/bullseye-app',
      website: 'https://getbullseye.app',
      gallery: [
        { type: 'video', src: 'assets/projects/bullseye-demo.mp4' },
      ],
    },
    claudemonitor: {
      tag: 'Embedded · Dashboards',
      title: 'Claude Monitor — Live Pi Usage Dashboard',
      desc: 'A wall-mounted 7" Raspberry Pi screen that shows live Claude Code usage: exact 5-hour and weekly window percentages, reset countdowns, per-session context %, cost, and every active session on the desktop. Built because Anthropic doesn\'t expose any of this through an API — the numbers are only rendered to the terminal.',
      bullets: [
        'Scrapes the CLI\'s /usage dialog by spawning a hidden claude.cmd via pywinpty, types the command, and parses the dialog text every 90s',
        'FastAPI + watchdog server streams updates over WebSocket; static dashboard sized for a fixed 800×480 canvas with a CRT-terminal aesthetic',
        'If a scrape fails, bars render as — rather than approximated numbers; what\'s on screen is always either real or visibly absent',
      ],
      stack: ['Python', 'FastAPI', 'pywinpty', 'Raspberry Pi', 'WebSocket', 'Computer vision', 'Voice control'],
      github: 'https://github.com/reubenlavin08/claude-monitor',
      gallery: [
        { type: 'image', src: 'assets/projects/claude-monitor-dashboard.png' },
      ],
    },
    sentinel: {
      tag: 'AI · Computer Vision',
      title: 'Sentinel — AI Occupancy Monitor',
      desc: 'Connects to an IP camera, uses a YOLOv8-Pose model to detect and track people, and counts entries and exits as they cross a virtual tripwire. Every event is logged to SQLite and visualized in a live Streamlit dashboard that refreshes every 2 seconds.',
      bullets: [
        'Shoulder-midpoint tripwire logic — more robust than bounding-box centre across different camera angles and partial occlusions',
        'Per-person state machine with an 80 px buffer zone prevents double-counting at the line',
        'Model accelerated with Intel OpenVINO for faster CPU inference; occupancy can never go below zero',
      ],
      stack: ['Python', 'YOLOv8-Pose', 'OpenVINO', 'OpenCV', 'SQLite', 'Streamlit', 'Pose estimation', 'Object tracking'],
      github: 'https://github.com/reubenlavin08/Sentinel-AI-Occupancy-Monitor',
      gallery: [
        { type: 'image', src: 'assets/projects/sentinel-demo.png' },
      ],
    },
    cvcourse: {
      tag: 'Learning · Experiment',
      title: 'Sensor Fusion — A Personalized Learning Experiment',
      desc: 'A self-paced course on computer vision, sensor calibration, and multi-sensor fusion, designed around AI as a first-class learning collaborator. The artifact is a working static-site course; the point is the experiment — testing whether structured AI collaboration helps a single learner cover college-level technical material faster and deeper than passive content or solo grinding.',
      bullets: [
        '"Ask Claude" and "Stuck?" buttons on every lesson and quiz — each click copies a topic-specific, pre-engineered Socratic prompt to the clipboard and opens claude.ai',
        'A portable BRIEFING.md handoff document reloads full project context into any fresh Claude chat in under 30 seconds',
        'Built to support a three-phase assistive-helmet project: Phase 1 (shipped) = ToF + 6-DOF pose, Phase 2 = camera CV, Phase 3 = ToF + camera + IMU fused into a unified state estimator',
      ],
      stack: ['Static site', 'Active recall', 'AI-collaborative design', 'Sensor fusion', 'Computer vision', 'Linear algebra'],
      github: 'https://github.com/reubenlavin08/cv-robotics-course',
      website: 'https://reubenlavin08.github.io/cv-robotics-course/',
      gallery: [
        { type: 'image', src: 'assets/projects/cv-course-home.png' },
      ],
    },
    rccar: {
      tag: 'Robotics',
      title: 'Autonomous RC Car',
      desc: 'Built a small autonomous driving car using ultrasonic sensors for obstacle detection and basic navigation — the "see, decide, drive" loop that sits at the heart of every mobile robot. Designed, wired, coded, and debugged entirely from scratch.',
      bullets: [
        'Ultrasonic distance sensing for real-time obstacle detection and avoidance',
        'Microcontroller-driven steering and motor control loop',
        'Full end-to-end build: chassis, wiring, firmware, and hands-on hardware debugging',
      ],
      stack: ['Embedded', 'Ultrasonic sensors', 'Motor control', 'Obstacle avoidance'],
      github: null,
      gallery: [
        { type: 'image', src: 'assets/projects/rc-car-photo.jpg' },
        { type: 'image', src: 'assets/projects/rc-car.jpg' },
        { type: 'video', src: 'assets/projects/rc-car-new.mov',   poster: 'assets/projects/rc-car-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-car-drive.mp4', poster: 'assets/projects/rc-car.jpg' },
      ],
    },
    rcplane: {
      tag: 'Aerospace · Hardware',
      title: 'RC Plane Build',
      desc: 'Designed and assembled a remote-controlled airplane from scratch — a hands-on dive into aerodynamics, control surfaces, and radio link tuning. Took it from a pile of parts on a workbench to flying hardware.',
      bullets: [
        'Airframe assembly, CG balancing, and control surface alignment',
        'Servo, ESC, and receiver wiring with proper cable routing',
        'Field-side troubleshooting and trim adjustments across maiden flights',
      ],
      stack: ['Aerodynamics', 'RC electronics', 'Servo · ESC · Rx'],
      github: null,
      gallery: [
        { type: 'image', src: 'assets/projects/rc-plane.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-1.mov', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-2.mov', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-3.mov', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-4.mov', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-build.mp4', poster: 'assets/projects/rc-plane.jpg' },
      ],
    },
  };

  // --- Modal elements ---
  const modal            = document.getElementById('projectModal');
  const modalBackdrop    = document.getElementById('modalBackdrop');
  const modalClose       = document.getElementById('modalClose');
  const modalGalleryWrap = document.getElementById('modalGalleryWrap');
  const modalGallery     = document.getElementById('modalGallery');
  const galPrev          = document.getElementById('galPrev');
  const galNext          = document.getElementById('galNext');
  const galDots          = document.getElementById('galDots');
  const mTag             = document.getElementById('mTag');
  const mTitle           = document.getElementById('mTitle');
  const mDesc            = document.getElementById('mDesc');
  const mBullets         = document.getElementById('mBullets');
  const mStack           = document.getElementById('mStack');
  const mLinks           = document.getElementById('mLinks');

  let currentSlide = 0;
  let totalSlides  = 0;
  let activeVideo  = null;

  function pauseActive() {
    if (activeVideo) { activeVideo.pause(); activeVideo = null; }
  }

  function goToSlide(n) {
    pauseActive();
    currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
    modalGallery.style.transform = `translateX(-${currentSlide * 100}%)`;
    galDots.querySelectorAll('.gal-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    const vid = modalGallery.children[currentSlide]?.querySelector('video');
    if (vid) { vid.play().catch(() => {}); activeVideo = vid; }
  }

  function buildGallery(gallery) {
    modalGallery.innerHTML = '';
    galDots.innerHTML = '';
    currentSlide = 0;
    totalSlides  = gallery.length;

    if (!gallery.length) {
      modalGalleryWrap.classList.add('no-gallery');
      return;
    }
    modalGalleryWrap.classList.remove('no-gallery');

    gallery.forEach((item, i) => {
      const slide = document.createElement('div');
      slide.className = 'gal-slide';

      if (item.type === 'video') {
        const vid = document.createElement('video');
        vid.src = item.src;
        if (item.poster) vid.poster = item.poster;
        vid.controls   = true;
        vid.muted       = true;
        vid.playsInline = true;
        vid.preload     = 'metadata';
        slide.appendChild(vid);
      } else {
        const img = document.createElement('img');
        img.src     = item.src;
        img.alt     = '';
        img.loading = 'lazy';
        slide.appendChild(img);
      }
      modalGallery.appendChild(slide);

      const dot = document.createElement('button');
      dot.className = 'gal-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      galDots.appendChild(dot);
    });

    const multi = totalSlides > 1;
    galPrev.hidden = !multi;
    galNext.hidden = !multi;
    galDots.hidden = !multi;
    modalGallery.style.transform = '';
  }

  function openModal(id) {
    const p = PROJECTS[id];
    if (!p) return;

    mTag.textContent   = p.tag;
    mTitle.textContent = p.title;
    mDesc.textContent  = p.desc;
    mBullets.innerHTML = p.bullets.map(b => `<li>${b}</li>`).join('');
    mStack.innerHTML   = p.stack.map(s => `<span>${s}</span>`).join('');

    mLinks.innerHTML = '';
    if (p.website) {
      const a = document.createElement('a');
      a.href      = p.website;
      a.target    = '_blank';
      a.rel       = 'noopener';
      a.className = 'link-arrow';
      a.textContent = p.website.replace(/^https?:\/\//, '').replace(/\/$/, '') + ' →';
      mLinks.appendChild(a);
    }
    if (p.github) {
      const a = document.createElement('a');
      a.href      = p.github;
      a.target    = '_blank';
      a.rel       = 'noopener';
      a.className = 'link-arrow';
      a.textContent = 'View on GitHub →';
      mLinks.appendChild(a);
    } else if (!p.website) {
      const span = document.createElement('span');
      span.style.cssText = 'font-family:var(--mono,monospace);font-size:12px;color:var(--text-mute);letter-spacing:0.04em;text-transform:uppercase';
      span.textContent = 'Private / no repo yet';
      mLinks.appendChild(span);
    }

    buildGallery(p.gallery || []);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();

    if (p.gallery?.length && p.gallery[0].type === 'video') {
      setTimeout(() => {
        const vid = modalGallery.querySelector('video');
        if (vid) { vid.play().catch(() => {}); activeVideo = vid; }
      }, 250);
    }
  }

  function closeModal() {
    pauseActive();
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  galPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  galNext.addEventListener('click', () => goToSlide(currentSlide + 1));
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight')  goToSlide(currentSlide + 1);
  });

  document.querySelectorAll('.proj-card[data-project]').forEach(card => {
    const id = card.dataset.project;
    card.addEventListener('click', () => openModal(id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(id); }
    });
  });
})();
