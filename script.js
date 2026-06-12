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
    // threshold 0 (not a ratio): tall sections (e.g. featured case studies on
    // mobile) can exceed the viewport, so a fractional threshold never fires.
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('visible'));
  }

  // --- Scroll-spy active nav ---
  const navLinkEls = [...document.querySelectorAll('.nav-links a')];
  const spied = navLinkEls
    .map(a => ({ a, sec: document.querySelector(a.getAttribute('href')) }))
    .filter(x => x.sec);
  if (spied.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          navLinkEls.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spied.forEach(x => spy.observe(x.sec));
  }

  // --- Project data ---
  // (Featured case studies — helmet, spindle whorl — live directly in index.html.)
  const PROJECTS = {
    bullseye: {
      thumb: 'assets/projects/bullseye-poster.jpg',
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
        { type: 'video', src: 'assets/projects/bullseye-demo.mp4', poster: 'assets/projects/bullseye-poster.jpg' },
        { type: 'image', src: 'assets/projects/bullseye-landing.png' },
        { type: 'image', src: 'assets/projects/bullseye-home.png' },
        { type: 'image', src: 'assets/projects/bullseye-featured.png' },
      ],
    },
    claudemonitor: {
      thumb: 'assets/projects/claude-monitor-dashboard.png',
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
        { type: 'image', src: 'assets/projects/claude-monitor-live.png' },
        { type: 'image', src: 'assets/projects/claude-monitor-housing.webp' },
      ],
    },
    sentinel: {
      thumb: 'assets/projects/sentinel-demo.webp',
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
        { type: 'image', src: 'assets/projects/sentinel-demo.webp' },
      ],
    },
    cvcourse: {
      thumb: 'assets/projects/cv-course-home.png',
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
      thumb: 'assets/projects/rc-car-thumb.jpg',
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
        { type: 'image', src: 'assets/projects/rc-car-photo.webp' },
        { type: 'image', src: 'assets/projects/rc-car.jpg' },
        { type: 'video', src: 'assets/projects/rc-car-new.mp4',   poster: 'assets/projects/rc-car-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-car-drive.mp4', poster: 'assets/projects/rc-car.jpg' },
      ],
    },
    rcplane: {
      thumb: 'assets/projects/rc-plane-thumb.jpg',
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
        { type: 'video', src: 'assets/projects/rc-plane-1.mp4', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-2.mp4', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-3.mp4', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-4.mp4', poster: 'assets/projects/rc-plane-thumb.jpg' },
        { type: 'video', src: 'assets/projects/rc-plane-build.mp4', poster: 'assets/projects/rc-plane.jpg' },
      ],
    },
    ccdiscord: {
      thumb: 'assets/projects/cc-discord-remote-phone.jpg',
      tag: 'Automation · Windows API',
      title: 'cc-discord-remote — Drive Claude Code from Discord',
      desc: 'A Discord bot that lets you drive a Claude Code session running on your laptop from anywhere — typed prompts go in over Win32 console APIs, and responses stream back by tailing Claude\'s session JSONL. Built because Claude Code\'s official /remote-control requires same-account auth between the phone and the laptop; this works across accounts.',
      bullets: [
        'Live attach to a running terminal via ctypes: AttachConsole + WriteConsoleInput against the Claude Code process',
        'Response capture without screen scraping — tails the session JSONL Claude writes to disk and streams new turns back to Discord',
        'Supervised by a Windows Scheduled Task with an ensure-running watchdog (PowerShell + VBScript) so the bot survives restarts',
      ],
      stack: ['Python', 'discord.py', 'Win32 console APIs', 'ctypes', 'Claude Agent SDK', 'PowerShell · Scheduled Task'],
      github: 'https://github.com/reubenlavin08/cc-discord-remote',
      gallery: [
        { type: 'image', src: 'assets/projects/cc-discord-remote-phone.jpg' },
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

  // Tab must stay inside the open dialog (aria-modal alone doesn't enforce it)
  function trapFocus(container, e) {
    const focusables = container.querySelectorAll('button, [href], video[controls]');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  let modalPushed = false; // false when the modal state came from a direct deep link

  function openModal(id, fromHistory) {
    const p = PROJECTS[id];
    if (!p) return;
    if (!fromHistory) { history.pushState({ project: id }, '', '#project-' + id); modalPushed = true; }

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

  function closeModal(fromHistory) {
    pauseActive();
    modal.hidden = true;
    document.body.style.overflow = '';
    if (!fromHistory && history.state?.project) {
      if (modalPushed) history.back();
      // deep-linked first entry: clean the URL in place, never navigate away
      else history.replaceState(null, '', location.pathname + location.search);
    }
  }

  window.addEventListener('popstate', e => {
    modalPushed = false;
    if (e.state?.project) openModal(e.state.project, true);
    else if (!modal.hidden) closeModal(true);
  });
  // Deep link: #project-<id> opens the modal on load
  const hashMatch = location.hash.match(/^#project-(\w+)$/);
  if (hashMatch && PROJECTS[hashMatch[1]]) {
    history.replaceState({ project: hashMatch[1] }, '', location.hash);
    openModal(hashMatch[1], true);
  }

  galPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  galNext.addEventListener('click', () => goToSlide(currentSlide + 1));
  modalClose.addEventListener('click', () => closeModal());
  modalBackdrop.addEventListener('click', () => closeModal());

  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight')  goToSlide(currentSlide + 1);
    if (e.key === 'Tab')         trapFocus(modal, e);
  });

  document.querySelectorAll('.proj-card[data-project]').forEach(card => {
    const id = card.dataset.project;
    card.addEventListener('click', () => openModal(id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(id); }
    });
  });

  // --- 3D project shelf for the non-featured builds (desktop only) ---
  // Z-stacked panel scene with a cursor squash/stretch wave (same math as
  // the stacked-panels reference: Gaussian influence, tilting scene).
  // Always built; the 821px media query alone decides shelf vs card grid,
  // so resizing/zooming after load can't strand the user with neither.
  (() => {
    const grid = document.querySelector('.proj-grid');
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // i=0 (strongest project) is the big front panel; later items recede.
    const order = ['bullseye', 'claudemonitor', 'sentinel', 'cvcourse', 'rccar', 'rcplane', 'ccdiscord'];
    const N = order.length;
    const Z_SPREAD = 110;   // depth gap between panels
    const X_STEP = 74;      // lateral staircase so every panel stays reachable

    const shelf = document.createElement('div');
    shelf.className = 'shelf';
    const stage = document.createElement('div');
    stage.className = 'shelf-stage';
    const scene = document.createElement('div');
    scene.className = 'shelf-scene';
    const caption = document.createElement('p');
    caption.className = 'shelf-caption';
    const HINT = '<span class="shelf-tag">7 more builds · hover to browse · click to open</span>';
    caption.innerHTML = HINT;

    const baseOp = [];
    const panels = order.map((id, i) => {
      const p = PROJECTS[id];
      const t = 1 - i / (N - 1);
      const w = 210 + t * 90, h = 290 + t * 130;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'shelf-panel';
      b.setAttribute('aria-label', 'Open ' + p.title);
      b.style.width = w + 'px';
      b.style.height = h + 'px';
      b.style.marginLeft = -w / 2 + 'px';
      b.style.marginTop = -h / 2 + 'px';
      baseOp[i] = (0.35 + t * 0.65).toFixed(2);
      b.style.opacity = baseOp[i];
      const img = document.createElement('img');
      img.src = p.thumb; img.alt = ''; img.loading = 'lazy';
      b.appendChild(img);
      b.addEventListener('pointerenter', () => setFocus(i));
      b.addEventListener('focus', () => setFocus(i));
      b.addEventListener('click', () => openModal(id));
      scene.appendChild(b);
      return b;
    });

    stage.appendChild(scene);
    shelf.append(stage, caption);
    grid.before(shelf);
    grid.classList.add('has-shelf');

    // The browser hit-tests the 3D-transformed buttons directly, so the
    // hover target is always the panel visually under the cursor. Focus is
    // cleared only when the pointer leaves the stage (prevents flicker as
    // panels animate under a stationary cursor).
    function transformFor(j, focus) {
      const x = (j - (N - 1) / 2) * X_STEP;
      const z = -j * Z_SPREAD;
      if (j === focus) return `translate3d(${x}px, -18px, ${z + 140}px) rotateY(22deg)`;
      if (focus < 0) return `translate3d(${x}px, 0, ${z}px)`;
      const d = Math.abs(j - focus), s = Math.sign(j - focus);
      return `translate3d(${(x + s * 52 * Math.pow(0.68, d - 1)).toFixed(1)}px, 0, ${z}px)`;
    }
    function apply(focus) {
      panels.forEach((el, j) => {
        el.style.transform = transformFor(j, focus);
        el.style.opacity = j === focus ? '1' : baseOp[j];
        el.classList.toggle('is-focus', j === focus);
      });
    }
    function setFocus(i) {
      apply(i);
      const p = PROJECTS[order[i]];
      caption.innerHTML = `<span class="shelf-tag">${p.tag}</span><span class="shelf-title">${p.title.split('—')[0].trim()}</span>`;
    }
    function clearFocus() {
      apply(-1);
      caption.innerHTML = HINT;
    }
    stage.addEventListener('pointerleave', clearFocus);
    shelf.addEventListener('focusout', e => { if (!shelf.contains(e.relatedTarget)) clearFocus(); });
    apply(-1);
  })();

  // --- Haptic mapping playground (the shipped firmware computation) ---
  (() => {
    const grid = document.getElementById('hdGrid');
    if (!grid) return;
    const dot = document.getElementById('hdDot');
    const slider = document.getElementById('hdDist');
    const distVal = document.getElementById('hdDistVal');
    const rings = { left: document.getElementById('hdmLeft'), center: document.getElementById('hdmCenter'), right: document.getElementById('hdmRight') };
    const vals  = { left: document.getElementById('hdvLeft'), center: document.getElementById('hdvCenter'), right: document.getElementById('hdvRight') };

    // Firmware constants (main.c): duty floor 130/255 = 51%, squared urgency
    // curve mapped onto [MIN..MAX], dominance scales above-floor portion x0.7.
    const DUTY_MIN = 130, DUTY_MAX = 255, THRESH = 150, BLOB = 0.85;
    const region = c => (c < 2 ? 'left' : c > 5 ? 'right' : 'center');

    let colF = 3.5, rowF = 0.5; // obstacle position: column 0..8, row fraction 0..1

    function compute() {
      const dist = +slider.value;
      distVal.textContent = dist + ' cm';
      const d = { left: 0, center: 0, right: 0 };
      for (let c = Math.max(0, Math.ceil(colF - BLOB)); c <= Math.min(7, Math.floor(colF + BLOB)); c++) {
        // off-axis zones see a longer slant range (the per-row/column cosine effect)
        const lateral = Math.abs(c + 0.5 - colF) / BLOB;
        const zoneDist = dist * (1 + 0.15 * lateral);
        if (zoneDist >= THRESH) continue;
        const ratio = zoneDist / THRESH;
        const duty = DUTY_MIN + (DUTY_MAX - DUTY_MIN) * (1 - ratio) * (1 - ratio);
        const r = region(c);
        d[r] = Math.max(d[r], duty);
      }
      const top = Math.max(d.left, d.center, d.right);
      for (const k in d) {
        if (d[k] > 0 && d[k] < top) d[k] = DUTY_MIN + (d[k] - DUTY_MIN) * 0.7;
        const pct = d[k] ? Math.round((d[k] / DUTY_MAX) * 100) : 0;
        vals[k].textContent = pct ? pct + '%' : 'off';
        rings[k].style.background = `rgba(95, 208, 138, ${d[k] / DUTY_MAX})`;
        rings[k].style.boxShadow = d[k] ? `0 0 ${6 + (d[k] / DUTY_MAX) * 14}px rgba(95, 208, 138, 0.55)` : 'none';
      }
    }

    function place() {
      dot.style.left = (colF / 8) * 100 + '%';
      dot.style.top = rowF * 100 + '%';
      compute();
    }

    function dragTo(e) {
      const r = grid.getBoundingClientRect();
      colF = Math.max(0.2, Math.min(7.8, ((e.clientX - r.left) / r.width) * 8));
      rowF = Math.max(0.08, Math.min(0.92, (e.clientY - r.top) / r.height));
      place();
    }
    grid.addEventListener('pointerdown', e => { dragTo(e); try { grid.setPointerCapture(e.pointerId); } catch {} });
    grid.addEventListener('pointermove', e => { if (e.buttons) dragTo(e); });
    grid.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { colF = Math.max(0.2, colF - 0.5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { colF = Math.min(7.8, colF + 0.5); e.preventDefault(); }
      if (e.key === 'ArrowUp')    { slider.value = Math.min(200, +slider.value + 10); e.preventDefault(); }
      if (e.key === 'ArrowDown')  { slider.value = Math.max(25, +slider.value - 10); e.preventDefault(); }
      place();
    });
    slider.addEventListener('input', compute);
    place();
  })();

  // --- Pause autoplay videos while offscreen (battery + bandwidth) ---
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) { v.play().catch(() => {}); }
        else v.pause();
      });
    }, { rootMargin: '100px 0px' });
    document.querySelectorAll('video[autoplay]').forEach(v => vio.observe(v));
  }

  // --- Hero depth cloud: real VL53L8CX capture rendered live ---
  (() => {
    const canvas = document.getElementById('heroCanvas');
    const data = window.DEPTH_CAPTURE;
    if (!canvas || !data || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isNarrow = window.matchMedia('(max-width: 820px)').matches;
    const animate = !reduceMotion && !isNarrow;

    const N = data.rows * data.cols;
    const v36 = ch => { const c = ch.charCodeAt(0); return c <= 57 ? c - 48 : c - 87; };
    const all = new Int16Array(data.frames * N);
    for (let i = 0; i < all.length; i++) all[i] = v36(data.b36[2 * i]) * 36 + v36(data.b36[2 * i + 1]);

    // Per-zone ray directions for the sensor's square FoV (pinhole model)
    const fov = (data.fovDeg * Math.PI) / 180;
    const dirs = [];
    for (let r = 0; r < data.rows; r++)
      for (let c = 0; c < data.cols; c++)
        dirs.push([Math.tan(((c + 0.5) / data.cols - 0.5) * fov), Math.tan(((r + 0.5) / data.rows - 0.5) * fov)]);

    let w, h;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const CENTER_D = 95;   // cm: scene centroid depth in this capture
    const CAM_D = 175;     // cm: virtual camera distance
    const pts = new Array(N);

    // Pointer: parallax orbit + Gaussian lift. The field is STILL at rest;
    // capture playback and orbit run only while the pointer is in the hero,
    // so all motion is caused by the visitor.
    let tgtX = 0, tgtY = 0, curX = 0, curY = 0;       // -0.5..0.5 offsets
    let tgtPx = -1e4, tgtPy = -1e4, curPx = -1e4, curPy = -1e4; // cursor in canvas px
    let inside = false, playMs = 0, lastT = 0;
    const SIGMA = 130;      // px: Gaussian falloff radius

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const dt = lastT ? Math.min(t - lastT, 100) : 0;
      lastT = t;
      if (inside) playMs += dt;
      curX += (tgtX - curX) * 0.09;
      curY += (tgtY - curY) * 0.09;
      curPx += (tgtPx - curPx) * 0.12;
      curPy += (tgtPy - curPy) * 0.12;
      const fi = (playMs * 0.01) % data.frames;     // ~10 Hz, the real capture rate
      const i0 = Math.floor(fi), i1 = (i0 + 1) % data.frames, mix = fi - i0;
      const yaw = 0.55 + curX * 0.6;
      const pitch = -0.3 + curY * 0.2;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const f = w * 1.45;
      const ax = w * 0.5, ay = h * 0.52;
      for (let z = 0; z < N; z++) {
        const d0 = all[i0 * N + z], d1 = all[i1 * N + z];
        if (!d0 || !d1) { pts[z] = null; continue; }
        const d = d0 + (d1 - d0) * mix;
        const x = dirs[z][0] * d, y = dirs[z][1] * d, zz = d - CENTER_D;
        const x2 = x * cy + zz * sy, z2 = -x * sy + zz * cy;
        const y2 = y * cp - z2 * sp, z3 = y * sp + z2 * cp;
        const depth = z3 + CAM_D;
        if (depth < 20) { pts[z] = null; continue; }
        pts[z] = [ax + (x2 / depth) * f, ay + (y2 / depth) * f, d];
      }
      ctx.strokeStyle = 'rgba(95, 208, 138, 0.045)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 0; r < data.rows; r++) {
        for (let c = 0; c < data.cols; c++) {
          const a = pts[r * data.cols + c];
          if (!a) continue;
          const right = c < data.cols - 1 && pts[r * data.cols + c + 1];
          const down = r < data.rows - 1 && pts[(r + 1) * data.cols + c];
          if (right) { ctx.moveTo(a[0], a[1]); ctx.lineTo(right[0], right[1]); }
          if (down)  { ctx.moveTo(a[0], a[1]); ctx.lineTo(down[0], down[1]); }
        }
      }
      ctx.stroke();
      for (const p of pts) {
        if (!p) continue;
        const near = Math.max(0, Math.min(1, (110 - p[2]) / 35));
        const dx = p[0] - curPx, dy = p[1] - curPy;
        const inf = Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA));
        ctx.fillStyle = `rgba(95, 208, 138, ${Math.min(1, 0.1 + near * 0.28 + inf * 0.55)})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1] - inf * 12, 1.8 + near * 1.9 + inf * 2.6, 0, 6.2832);
        ctx.fill();
      }
    }

    resize();
    if (!animate) { draw(40000); window.addEventListener('resize', () => { resize(); draw(40000); }); return; }

    let running = false, rafId = 0;
    const settled = () =>
      !inside &&
      Math.abs(tgtX - curX) < 0.001 && Math.abs(tgtY - curY) < 0.001 &&
      curPx < -5000;
    const loop = t => {
      draw(t);
      if (settled()) { running = false; lastT = 0; return; } // rest: hold one still frame
      rafId = requestAnimationFrame(loop);
    };
    const start = () => { if (!running) { running = true; lastT = 0; rafId = requestAnimationFrame(loop); } };
    const stop = () => { if (running) { running = false; lastT = 0; cancelAnimationFrame(rafId); } };

    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      inside = true;
      tgtX = e.clientX / r.width - 0.5;
      tgtY = e.clientY / r.height - 0.5;
      tgtPx = e.clientX - r.left;
      tgtPy = e.clientY - r.top;
      start();
    });
    hero.addEventListener('pointerleave', () => { inside = false; tgtX = 0; tgtY = 0; tgtPx = tgtPy = -1e4; start(); });
    window.addEventListener('resize', () => { resize(); start(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? start() : stop()))).observe(hero);
    } else start();
  })();

  // --- Gallery lightbox ---
  (() => {
    const grid    = document.getElementById('galleryGrid');
    const box     = document.getElementById('lightbox');
    const img     = document.getElementById('lightboxImg');
    const close   = document.getElementById('lightboxClose');
    const prev    = document.getElementById('lightboxPrev');
    const next    = document.getElementById('lightboxNext');
    const counter = document.getElementById('lightboxCounter');
    if (!grid || !box) return;

    const items = Array.from(grid.querySelectorAll('.gal-item'));
    const srcs  = items.map(b => b.dataset.src);
    const alts  = items.map(b => b.querySelector('img')?.alt || '');
    let idx = 0;

    const show = i => {
      idx = (i + srcs.length) % srcs.length;
      img.src = srcs[idx];
      img.alt = alts[idx];
      counter.textContent = `${idx + 1} / ${srcs.length}`;
    };
    const open = i => {
      show(i);
      box.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    const dismiss = () => {
      box.hidden = true;
      img.src = '';
      document.body.style.overflow = '';
    };

    items.forEach((btn, i) => btn.addEventListener('click', () => open(i)));
    close.addEventListener('click', dismiss);
    prev.addEventListener('click', () => show(idx - 1));
    next.addEventListener('click', () => show(idx + 1));
    box.addEventListener('click', e => { if (e.target === box) dismiss(); });
    document.addEventListener('keydown', e => {
      if (box.hidden) return;
      if (e.key === 'Escape')     dismiss();
      if (e.key === 'ArrowLeft')  show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();
})();
