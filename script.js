/* ==========================================================================
   AWN · PREMIUM PORTFOLIO — SCRIPTS
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV: SCROLL STATE ---------- */
  const navHeader = document.getElementById('navHeader');
  const onScrollNav = () => {
    if (window.scrollY > 40) navHeader.classList.add('scrolled');
    else navHeader.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- NAV: ACTIVE LINK + INDICATOR ---------- */
  const navInd = document.getElementById('navIndicator');
  const navAnchors = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActiveLink(id) {
    let activeEl = null;
    navAnchors.forEach((a) => {
      const isActive = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', isActive);
      if (isActive) activeEl = a;
    });
    if (activeEl && window.innerWidth > 860) {
      const navRect = navLinks.getBoundingClientRect();
      const linkRect = activeEl.getBoundingClientRect();
      navInd.style.width = linkRect.width + 'px';
      navInd.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
      navInd.classList.add('visible');
    } else {
      navInd.classList.remove('visible');
    }
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 860) navInd.classList.remove('visible');
    else {
      const active = document.querySelector('.nav-link.active');
      if (active) setActiveLink(active.getAttribute('href').slice(1));
    }
  });

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.body;
  const storedTheme = localStorage.getItem('awn-theme');
  if (storedTheme === 'light') root.classList.add('theme-light');
  else if (storedTheme === 'dark') root.classList.add('theme-dark');

  themeToggle.addEventListener('click', () => {
    const isLight = root.classList.toggle('theme-light');
    root.classList.toggle('theme-dark', !isLight);
    localStorage.setItem('awn-theme', isLight ? 'light' : 'dark');
  });

  /* ---------- TYPING ANIMATION ---------- */
  const typingEl = document.getElementById('typing');
  const phrases = [
    'Information Science Student',
    'Aspiring IT Professional',
    'Web Development Enthusiast',
    'Future Software Developer'
  ];

  if (typingEl && !prefersReducedMotion) {
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const TYPE_SPEED = 70;
    const DELETE_SPEED = 35;
    const HOLD = 1600;

    const tick = () => {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(tick, HOLD);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIdx--;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    };
    setTimeout(tick, 800);
  } else if (typingEl) {
    typingEl.textContent = phrases[0];
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- SKILL BARS ---------- */
  const skillCards = document.querySelectorAll('.skill-card');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const skillObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            skillObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillCards.forEach((c) => skillObs.observe(c));
  } else {
    skillCards.forEach((c) => c.classList.add('visible'));
  }

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener(
    'scroll',
    () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    },
    { passive: true }
  );
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- CV PLACEHOLDER ---------- */
  const downloadCv = document.getElementById('downloadCv');
  if (downloadCv) {
    downloadCv.addEventListener('click', (e) => {
      e.preventDefault();
      alert(
        'CV placeholder — upload your CV file to the assets/ folder, then update the href on the Download CV button in index.html to point to it (e.g. assets/Awn-CV.pdf).'
      );
    });
  }

  /* ---------- PORTRAIT FALLBACK GUARD ---------- */
  const portraitImg = document.getElementById('portraitImg');
  if (portraitImg) {
    portraitImg.addEventListener('error', () => {
      portraitImg.style.display = 'none';
      const fallback = document.getElementById('portraitFallback');
      if (fallback) fallback.style.display = 'flex';
    });
  }

  /* ---------- PARTICLES (lightweight canvas) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let rafId = null;
    let running = true;

    const PARTICLE_COUNT = window.innerWidth < 768 ? 26 : 46;
    const ACCENT = '59, 130, 246';

    function resize() {
      w = canvas.clientWidth = window.innerWidth;
      h = canvas.clientHeight = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 0.6,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, ${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 130 * 130) {
            const alpha = (1 - dist2 / (130 * 130)) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(step);
    }

    resize();
    initParticles();
    step();

    window.addEventListener('resize', () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
      initParticles();
    });

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) step();
      else if (rafId) cancelAnimationFrame(rafId);
    });
  }

  /* ---------- SMOOTH ANCHOR FALLBACK (older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- PROJECT IMAGE FALLBACK (belt & suspenders) ---------- */
  document.querySelectorAll('.project-img').forEach((img) => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const parent = this.parentElement;
      parent.classList.add('media-placeholder');
      if (!parent.querySelector('.media-fallback')) {
        const title = this.closest('.project-card')?.querySelector('.project-title')?.textContent || 'Project';
        const fallback = document.createElement('div');
        fallback.className = 'media-fallback';
        fallback.innerHTML = `<span>${title}</span><small>Add a screenshot to assets/</small>`;
        parent.appendChild(fallback);
      }
    });
  });
})();
