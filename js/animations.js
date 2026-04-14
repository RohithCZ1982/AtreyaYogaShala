/* ============================================================
   ATREYA YOGA SHALA — Scroll-reveal & interaction animations
   Pure vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Intersection Observer: scroll reveal ── */

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Also reveal section-labels inside
          entry.target.querySelectorAll('.section-label').forEach(el => {
            el.classList.add('label-visible');
          });
          io.unobserve(entry.target);   // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  /* ── 2. Tag elements with reveal classes ── */

  function tagReveal(selector, direction, stagger) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal', direction || 'from-up');
      if (stagger) el.style.transitionDelay = (i * 0.13) + 's';
      io.observe(el);
    });
  }

  // Section headings & labels
  tagReveal('.section-title',    'from-up');
  tagReveal('p.section-label',   'from-up');

  // Home — class cards (staggered)
  document.querySelectorAll('.class-card').forEach((el, i) => {
    el.classList.add('reveal', 'from-up');
    el.style.transitionDelay = (i * 0.14) + 's';
    io.observe(el);
  });

  // Pillars
  document.querySelectorAll('.pillar').forEach((el, i) => {
    el.classList.add('reveal', i % 2 === 0 ? 'from-left' : 'from-right');
    el.style.transitionDelay = (i * 0.12) + 's';
    io.observe(el);
  });

  // Testimonials
  document.querySelectorAll('.testimonial').forEach((el, i) => {
    el.classList.add('reveal', 'from-up');
    el.style.transitionDelay = (i * 0.15) + 's';
    io.observe(el);
  });

  // About teaser / about full
  tagReveal('.about-text',       'from-right');
  tagReveal('.about-body',       'from-right');
  tagReveal('.about-img-wrap',   'from-left');
  tagReveal('.about-photo-wrap', 'from-left');
  tagReveal('.about-credentials','from-up');

  // Safety: force-reveal anything already in the viewport after a short delay
  // (catches elements above the fold that IntersectionObserver may miss)
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }, 200);

  // Class detail blocks
  document.querySelectorAll('.class-detail').forEach((el, i) => {
    const imgEl  = el.querySelector('.class-detail-img');
    const textEl = el.querySelector('.class-detail-text');
    if (imgEl)  { imgEl.classList.add('reveal',  i % 2 === 0 ? 'from-left' : 'from-right'); io.observe(imgEl); }
    if (textEl) { textEl.classList.add('reveal', i % 2 === 0 ? 'from-right' : 'from-left'); textEl.style.transitionDelay = '0.15s'; io.observe(textEl); }
  });

  // Pricing cards
  document.querySelectorAll('.price-card').forEach((el, i) => {
    el.classList.add('reveal', 'from-up');
    el.style.transitionDelay = (i * 0.13) + 's';
    io.observe(el);
  });

  // Contact
  tagReveal('.contact-info',      'from-left');
  tagReveal('.contact-form-wrap', 'from-right');

  // Value items
  document.querySelectorAll('.value-item').forEach((el, i) => {
    el.classList.add('reveal', 'from-up');
    el.style.transitionDelay = (i * 0.1) + 's';
    io.observe(el);
  });

  // Schedule table
  tagReveal('.schedule-table-wrap', 'from-up');

  // CTA banner children
  document.querySelectorAll('.cta-banner .container > *').forEach((el, i) => {
    el.classList.add('reveal', 'from-up');
    el.style.transitionDelay = (i * 0.12) + 's';
    io.observe(el);
  });

  /* ── 3. Topbar ticker ── */

  const topbar = document.querySelector('.topbar');
  if (topbar) {
    const original = topbar.innerHTML;
    // Duplicate for seamless loop
    topbar.innerHTML = `<span class="topbar-inner">${original}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;${original}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;</span>`;
  }

  /* ── 4. Nav: mark active page ── */

  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .footer-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath === '' && href === 'index.html') ||
        (currentPath === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ── 5. Smooth page entrance on load ── */

  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.45s ease';
    document.body.style.opacity    = '1';
  });

  /* ── 6. Header shadow on scroll ── */

  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 24px rgba(40,44,30,0.18)';
      } else {
        header.style.boxShadow = '0 2px 16px rgba(40,44,30,0.10)';
      }
    }, { passive: true });
  }

  /* ── 7. Section-label underline for already-visible labels ── */

  document.querySelectorAll('p.section-label').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('label-visible');
    }
  });

  /* ── 8. Hamburger menu ── */

  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('nav-open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll while drawer is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('nav-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mainNav.classList.contains('nav-open')) {
        mainNav.classList.remove('nav-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 9. Scroll-to-top ── */

  const fabTop = document.querySelector('.fab-top');
  if (fabTop) {
    window.addEventListener('scroll', () => {
      fabTop.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });

    fabTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
