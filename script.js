(() => {
  // --- Nav ---
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const heroTrack = document.getElementById('heroTrack');
  // The bar stays out of the way until the pinned rotation has played out.
  const onScroll = () => {
    const gate = heroTrack
      ? (heroTrack.offsetHeight - window.innerHeight) * 0.82
      : 24;
    nav.classList.toggle('scrolled', window.scrollY > gate);
  };
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
  // (Featured case studies, helmet and spindle whorl, live directly in index.html.)
  const PROJECTS = {
    bullseye: {
      thumb: 'assets/projects/bullseye-poster.jpg',
      tag: 'Product · Open Source',
      title: 'Bullseye: Marketplace Deal Scorer',
      desc: 'Open-source Windows desktop app that scores Facebook Marketplace listings against real eBay sold-comp data in real time. Deterministic percentile-rank scoring with confidence bands and honesty guards: no LLM in the scoring path, same listing always produces the same score. Free forever for 3 saved searches, Pro for unlimited.',
      bullets: [
        'Tukey-trimmed median + IQR over the eBay Browse API (last 90 days) drives the percentile rank, not "estimated value" or Marketplace-vs-Marketplace',
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
      title: 'Claude Monitor: Live Pi Usage Dashboard',
      desc: 'A wall-mounted 7" Raspberry Pi screen that shows live Claude Code usage: exact 5-hour and weekly window percentages, reset countdowns, per-session context %, cost, and every active session on the desktop. Built because Anthropic doesn\'t expose any of this through an API; the numbers are only rendered to the terminal.',
      bullets: [
        'Scrapes the CLI\'s /usage dialog by spawning a hidden claude.cmd via pywinpty, types the command, and parses the dialog text every 90s',
        'FastAPI + watchdog server streams updates over WebSocket; static dashboard sized for a fixed 800×480 canvas with a CRT-terminal aesthetic',
        'If a scrape fails, bars render as "—" rather than approximated numbers; what\'s on screen is always either real or visibly absent',
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
      title: 'Sentinel: AI Occupancy Monitor',
      desc: 'Connects to an IP camera, uses a YOLOv8-Pose model to detect and track people, and counts entries and exits as they cross a virtual tripwire. Every event is logged to SQLite and visualized in a live Streamlit dashboard that refreshes every 2 seconds.',
      bullets: [
        'Shoulder-midpoint tripwire logic, more robust than bounding-box centre across different camera angles and partial occlusions',
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
      title: 'Sensor Fusion: A Personalized Learning Experiment',
      desc: 'A self-paced course on computer vision, sensor calibration, and multi-sensor fusion, designed around AI as a first-class learning collaborator. The artifact is a working static-site course; the point is the experiment: testing whether structured AI collaboration helps a single learner cover college-level technical material faster and deeper than passive content or solo grinding.',
      bullets: [
        '"Ask Claude" and "Stuck?" buttons on every lesson and quiz; each click copies a topic-specific, pre-engineered Socratic prompt to the clipboard and opens claude.ai',
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
      desc: 'Built a small autonomous driving car using ultrasonic sensors for obstacle detection and basic navigation: the "see, decide, drive" loop that sits at the heart of every mobile robot. Designed, wired, coded, and debugged entirely from scratch.',
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
      desc: 'Designed and assembled a remote-controlled airplane from scratch: a hands-on dive into aerodynamics, control surfaces, and radio link tuning. Took it from a pile of parts on a workbench to flying hardware.',
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
      title: 'cc-discord-remote: Drive Claude Code from Discord',
      desc: 'A Discord bot that lets you drive a Claude Code session running on your laptop from anywhere: typed prompts go in over Win32 console APIs, and responses stream back by tailing Claude\'s session JSONL. Built because Claude Code\'s official /remote-control requires same-account auth between the phone and the laptop; this works across accounts.',
      bullets: [
        'Live attach to a running terminal via ctypes: AttachConsole + WriteConsoleInput against the Claude Code process',
        'Response capture without screen scraping: tails the session JSONL Claude writes to disk and streams new turns back to Discord',
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
    // The focused panel moves only within its own plane (lift + scale, no Z
    // travel, no rotation): parallel planes at distinct depths can never
    // intersect, so nothing phases through anything mid-transition.
    function transformFor(j, focus) {
      const x = (j - (N - 1) / 2) * X_STEP;
      const z = -j * Z_SPREAD;
      if (j === focus) return `translate3d(${x}px, -76px, ${z}px) scale(1.07)`;
      if (focus < 0) return `translate3d(${x}px, 0, ${z}px)`;
      const d = Math.abs(j - focus), s = Math.sign(j - focus);
      return `translate3d(${(x + s * 60 * Math.pow(0.68, d - 1)).toFixed(1)}px, 0, ${z}px)`;
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
      caption.innerHTML = `<span class="shelf-tag">${p.tag}</span><span class="shelf-title">${p.title.split(':')[0].trim()}</span>`;
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
        rings[k].style.background = `rgba(141, 164, 245, ${d[k] / DUTY_MAX})`;
        rings[k].style.boxShadow = 'none';
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
    const animate = !reduceMotion;

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
    const PIVOT = 46;      // cm: orbit centre, midway between helmet and wall
    const CAM_D = 205;     // cm: virtual camera distance
    const pts = new Array(N);

    // --- The helmet, built once, in the same sensor frame as the capture.
    // Units are cm, +y is down, +z points at the wall. The camera sits on the
    // -z side, so this is an over-the-shoulder view: you see the back of the
    // helmet and the cone leaving its face, which is what the wearer "sees".
    // The dome is placed so its front surface passes through the origin of the
    // ray fan, i.e. the sensor really is mounted on the helmet's face.
    const R = 13.5, SZ = -PIVOT, DOME_Y = -2.5, DOME_Z = SZ - R, VMAX = 1.9;
    const dome = (u, v) => [
      R * Math.sin(v) * Math.sin(u),
      DOME_Y - R * Math.cos(v),
      DOME_Z + R * Math.sin(v) * Math.cos(u),
    ];
    const helmet = [];
    for (const v of [0.38, 0.72, 1.06, 1.4, 1.72, VMAX]) {
      const ring = [];
      for (let i = 0; i <= 48; i++) ring.push(dome((i / 48) * 6.2832, v));
      helmet.push(ring);
    }
    for (let k = 0; k < 12; k++) {
      const u = (k / 12) * 6.2832, arc = [];
      for (let i = 0; i <= 20; i++) arc.push(dome(u, (i / 20) * VMAX));
      helmet.push(arc);
    }
    // A flared brim at the rim: the line that stops it reading as a wire globe.
    const brim = [];
    for (let i = 0; i <= 48; i++) {
      const u = (i / 48) * 6.2832, q = dome(u, VMAX);
      brim.push([q[0] * 1.09, q[1] + 1.1, DOME_Z + (q[2] - DOME_Z) * 1.09]);
    }
    helmet.push(brim);
    // Three coin motors, where they actually sit: forehead, left and right temple.
    const motors = [dome(0, 1.34), dome(-1.5708, 1.62), dome(1.5708, 1.62)];
    // Grid corners, for the FoV cone.
    const CORNERS = [0, data.cols - 1, N - 1, N - data.cols];
    const BANDS = 6;   // depth-fade buckets, so the wireframe strokes in 6 passes

    // Scroll drives everything: the orbit, the capture playback, and the
    // wavefront. The scene is STILL at rest, so all motion is the visitor's.
    // Scrolling the hero scrubs the real recording from first frame to last.
    let tgtP = 0, curP = 0;
    const track = document.getElementById('heroTrack') || hero;
    const hint = hero.querySelector('.hero-hint');
    const hintBar = hint && hint.firstElementChild;
    // The hero is pinned to the top of the track, so the track's remaining
    // travel is exactly the scroll budget the rotation gets.
    const progress = () => {
      const span = track.offsetHeight - window.innerHeight;
      if (span <= 0) return 0;
      return Math.max(0, Math.min(1, -track.getBoundingClientRect().top / span));
    };

    function draw() {
      ctx.clearRect(0, 0, w, h);
      curP += (tgtP - curP) * 0.14;
      const prog = curP;
      const fi = prog * (data.frames - 1);
      const i0 = Math.floor(fi), i1 = Math.min(i0 + 1, data.frames - 1), mix = fi - i0;
      // Two rotations. The rig turns about the sensor's own vertical axis,
      // which is the wearer turning their head and sweeping the cone with it;
      // the camera only drifts, because orbiting it far enough to read as a
      // rotation flings the helmet and the wall apart on screen.
      // One continuous gesture, every term monotonic. The back-and-forth
      // sine that was here read as jitter, because reversing direction
      // partway through looks like a correction rather than a movement.
      // The roll carries most of it: it turns about the axis the sensor
      // looks down, so the whole rig banks in place without anything
      // sliding out of frame. The head turn and the drift are support.
      const roll = prog * 0.92;
      const head = -0.22 + prog * 0.5;
      const yaw = 0.32 + prog * 0.25;
      const pitch = -0.26 + prog * 0.14;
      if (hintBar) {
        hintBar.style.width = (prog * 100).toFixed(1) + '%';
        hint.classList.toggle('on', prog < 0.98);
      }
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const chd = Math.cos(head), shd = Math.sin(head);
      const crl = Math.cos(roll), srl = Math.sin(roll);
      const f = w * (w > 900 ? 0.98 : 1.6);
      // Sit the scene right of centre so it never fights the headline.
      const wide = w > 900;
      const ax = w * (wide ? 0.72 - prog * 0.02 : 0.52), ay = h * (wide ? 0.48 + prog * 0.05 : 0.7);

      // One projector for everything in the scene: cloud, cone, and helmet.
      // Roll about the sensor's forward axis, then the head turn about its
      // vertical axis, then the camera.
      const proj = (x, y, z) => {
        const rx = x * crl - y * srl;
        const ry = x * srl + y * crl;
        const dz = z - SZ;
        const hx = rx * chd + dz * shd;
        const hz = SZ - rx * shd + dz * chd;
        const x2 = hx * cy + hz * sy, z2 = -hx * sy + hz * cy;
        const y2 = ry * cp - z2 * sp, z3 = ry * sp + z2 * cp;
        const depth = z3 + CAM_D;
        return depth < 20 ? null : [ax + (x2 / depth) * f, ay + (y2 / depth) * f, depth];
      };

      // The recorded scene is a flat wall, so on its own the field barely
      // moves. An obstacle is synthesised on top of it: a soft blob crossing
      // the grid that pulls the zones it covers much closer, which is exactly
      // what the sensor sees when something passes in front of the wearer.
      // The wall underneath is the real capture; the obstacle is not.
      const obsX = Math.sin(prog * 8.4) * 0.44 + Math.sin(prog * 3.1) * 0.1;
      const obsY = Math.cos(prog * 5.6) * 0.26;
      const obsD = 38 + Math.sin(prog * 12.7) * 16;
      const OBS_S2 = 2 * 0.19 * 0.19;
      // Absent on the first screen, so the page opens on the clean wall and
      // the obstacle is something the visitor's scroll brings into the field.
      const obsAmt = Math.min(1, prog * 5);

      let sum = 0, nValid = 0;
      const nearest = [1e4, 1e4, 1e4];   // centre, left, right: the firmware's regions
      for (let z = 0; z < N; z++) {
        const d0 = all[i0 * N + z], d1 = all[i1 * N + z];
        if (!d0 || !d1) { pts[z] = null; continue; }
        const col0 = z % data.cols, row0 = (z / data.cols) | 0;
        const nx = (col0 + 0.5) / data.cols - 0.5;
        const ny = (row0 + 0.5) / data.rows - 0.5;
        const g = obsAmt * Math.exp(-((nx - obsX) * (nx - obsX) + (ny - obsY) * (ny - obsY)) / OBS_S2);
        let d = d0 + (d1 - d0) * mix;
        d = d * (1 - g) + obsD * g;
        d += Math.sin(z * 1.73 + prog * 46) * 1.4 * obsAmt;   // per-zone shimmer
        const p = proj(dirs[z][0] * d, dirs[z][1] * d, d - PIVOT);
        if (!p) { pts[z] = null; continue; }
        pts[z] = [p[0], p[1], d];
        sum += d; nValid++;
        const col = z % data.cols;
        const reg = col < data.cols / 3 ? 1 : col < (2 * data.cols) / 3 ? 0 : 2;
        if (d < nearest[reg]) nearest[reg] = d;
      }
      const meanD = nValid ? Math.max(sum / nValid, CENTER_D * 0.85) : CENTER_D;
      ctx.strokeStyle = 'rgba(141, 164, 245, 0.1)';
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
        const near = Math.max(0, Math.min(1, (110 - p[2]) / 62));
        ctx.fillStyle = `rgba(141, 164, 245, ${Math.min(1, 0.18 + near * 0.62)})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.7 + near * 3.4, 0, 6.2832);
        ctx.fill();
      }

      // --- The FoV cone leaving the sensor, reaching to the frame's mean range
      const src = proj(0, 0, SZ + R * 0.02);
      const far = CORNERS.map(z =>
        proj(dirs[z][0] * meanD, dirs[z][1] * meanD, meanD - PIVOT));
      if (src && far.every(Boolean)) {
        ctx.lineWidth = 1;
        for (const q of far) {
          const g = ctx.createLinearGradient(src[0], src[1], q[0], q[1]);
          g.addColorStop(0, 'rgba(141, 164, 245, 0.4)');
          g.addColorStop(1, 'rgba(141, 164, 245, 0.05)');
          ctx.strokeStyle = g;
          ctx.beginPath();
          ctx.moveTo(src[0], src[1]);
          ctx.lineTo(q[0], q[1]);
          ctx.stroke();
        }
        // A wavefront leaving the emitter, three across the scroll.
        const s01 = (prog * 3) % 1;
        ctx.strokeStyle = `rgba(141, 164, 245, ${0.45 * Math.sin(s01 * Math.PI)})`;
        ctx.beginPath();
        far.forEach((q, k) => {
          const px = src[0] + (q[0] - src[0]) * s01;
          const py = src[1] + (q[1] - src[1]) * s01;
          k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
      }

      // --- Helmet wireframe. Depth fade stands in for the occlusion a
      // wireframe cannot do, and it is batched into six passes so the whole
      // dome costs six strokes rather than four hundred.
      const bands = [];
      for (let b = 0; b < BANDS; b++) bands.push(new Path2D());
      for (const line of helmet) {
        let prev = null;
        for (const vtx of line) {
          const p = proj(vtx[0], vtx[1], vtx[2]);
          if (prev && p) {
            const dep = (prev[2] + p[2]) * 0.5;
            const t01 = Math.max(0, Math.min(0.999, 1 - (dep - 130) / 50));
            const path = bands[Math.floor(t01 * BANDS)];
            path.moveTo(prev[0], prev[1]);
            path.lineTo(p[0], p[1]);
          }
          prev = p;
        }
      }
      ctx.lineWidth = 1;
      for (let b = 0; b < BANDS; b++) {
        ctx.strokeStyle = `rgba(202, 210, 242, ${0.1 + (b / (BANDS - 1)) * 0.52})`;
        ctx.stroke(bands[b]);
      }

      // The emitter itself, so the cone visibly leaves a piece of hardware.
      if (src) {
        ctx.fillStyle = 'rgba(214, 221, 250, 0.9)';
        ctx.fillRect(src[0] - 3.5, src[1] - 3.5, 7, 7);
        ctx.strokeStyle = 'rgba(141, 164, 245, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(src[0] - 6.5, src[1] - 6.5, 13, 13);
      }

      // --- Coin motors. Vermilion when their region has something close,
      // using the same three-region split the firmware uses.
      for (let m = 0; m < 3; m++) {
        const p = proj(motors[m][0], motors[m][1], motors[m][2]);
        if (!p) continue;
        const lit = Math.max(0, Math.min(1, 1 - nearest[m] / 150));
        const dep = Math.max(0.25, Math.min(1, 1 - (p[2] - 130) / 54));
        ctx.fillStyle = lit > 0.02
          ? `rgba(236, 142, 108, ${(0.4 + lit * 0.6) * dep})`
          : `rgba(202, 210, 242, ${0.4 * dep})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2.3 + lit * 2.2, 0, 6.2832);
        ctx.fill();
      }
    }

    resize();
    tgtP = curP = progress();
    draw();
    if (!animate) {
      window.addEventListener('resize', () => { resize(); tgtP = curP = progress(); draw(); });
      return;
    }

    let running = false, rafId = 0, visible = true;
    const loop = () => {
      draw();
      if (Math.abs(tgtP - curP) < 0.0004) {   // rest: hold one still frame
        curP = tgtP;
        draw();
        running = false;
        return;
      }
      rafId = requestAnimationFrame(loop);
    };
    const start = () => { if (!running && visible) { running = true; rafId = requestAnimationFrame(loop); } };
    const stop = () => { if (running) { running = false; cancelAnimationFrame(rafId); } };

    window.addEventListener('scroll', () => { tgtP = progress(); start(); }, { passive: true });
    window.addEventListener('resize', () => { resize(); tgtP = progress(); start(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => {
        visible = e.isIntersecting;
        visible ? start() : stop();
      })).observe(hero);
    }
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
