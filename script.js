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
      stack: ['C · ESP-IDF', 'ESP32-S3', 'Python', 'PyQtGraph + OpenGL'],
      github: 'https://github.com/ReubenLavin08/vl53l8cx-pointcloud-esp32',
      gallery: [
        { type: 'video', src: 'assets/projects/pointcloud-demo.mp4' },
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
      stack: ['Python', 'YOLOv8-Pose', 'OpenVINO', 'OpenCV', 'SQLite', 'Streamlit'],
      github: 'https://github.com/reubenlavin08/Sentinel-AI-Occupancy-Monitor',
      gallery: [],
    },
    emailaudit: {
      tag: 'Software · Agents',
      title: 'Email Audit — Claude Cowork Skill',
      desc: 'A Claude Cowork skill that consolidates an Outlook inbox and a Gmail inbox into a single prioritized action list. Solves the fragmented-inbox problem with a hybrid browser-automation + native API approach.',
      bullets: [
        'Split-fetch strategy: browser navigation for Outlook web, official OAuth via Google Workspace Connector for Gmail',
        'Zero-credential design — relies on active sessions and OAuth tokens; no passwords stored',
        'Unified prioritization output that surfaces urgent items across both inboxes',
      ],
      stack: ['Claude Cowork', 'SKILL.md', 'Browser automation', 'OAuth'],
      github: 'https://github.com/ReubenLavin08/email-audit-claude-cowork-skill',
      gallery: [],
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
      stack: ['Embedded', 'Ultrasonic sensors', 'Motor control'],
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
    sorta: {
      tag: 'Software · AI · In progress',
      title: 'Sorta — AI File Organizer',
      desc: 'A desktop app that watches folders and uses LLM reasoning to read, understand, and automatically route files to the right destination. Ollama runs a local model first for privacy and speed; Claude API serves as the fallback. A 12-check safety gate prevents any destructive moves before a file is touched.',
      bullets: [
        'LLM orchestration layer: tries Ollama locally first, falls through to Claude API — file content extracted (PDF, text) and passed as context so the model knows what it\'s sorting',
        'Safety gate runs 12 checks on every file event before allowing a move — recycle bin, system paths, locked files, and more all blocked at the gate',
        'Ships as a WPF dashboard + Windows system tray app and a CLI daemon; originally built in Swift / SwiftUI for macOS, now porting to C# / .NET 8 for Windows x64',
      ],
      stack: ['C# · .NET 8', 'WPF', 'Swift · SwiftUI', 'Ollama', 'Claude API', 'Supabase'],
      github: 'https://github.com/reubenlavin08/Sorta_windowsx_64',
      gallery: [],
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
    if (p.github) {
      const a = document.createElement('a');
      a.href      = p.github;
      a.target    = '_blank';
      a.rel       = 'noopener';
      a.className = 'link-arrow';
      a.textContent = 'View on GitHub →';
      mLinks.appendChild(a);
    } else {
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
