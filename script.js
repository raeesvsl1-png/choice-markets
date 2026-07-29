/* ============================================================
   CHOICE.MARKETS — Main JavaScript
   - Mobile navigation toggle
   - Scroll reveal animations
   - Active nav link highlighting
   - Smooth UX micro-interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---- Hamburger / Mobile Nav ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));

      // Animate hamburger spans
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on mobile nav link click
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  /* ---- Header shadow on scroll ---- */
  const header = document.getElementById('header');
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (header) {
      if (currentScrollY > 60) {
        header.style.top = '10px';
      } else {
        header.style.top = '2.747vw';
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  /* ---- Scroll Reveal ---- */
  const revealElements = document.querySelectorAll(
    '.feature-card, .p4-card, .step-item, .hero-stats, .part5-inner, .demo-window, .part3-text'
  );

  // Add reveal classes
  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    const delay = (i % 3) + 1;
    if (delay > 1) el.classList.add(`reveal-delay-${delay}`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ---- Active Nav Link on Scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.background = '';
            link.style.color = '';
          });
          const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (activeLink && !activeLink.classList.contains('nav-link--app')) {
            activeLink.style.background = 'var(--gray-15)';
            activeLink.style.color = 'var(--white)';
          }
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(section => sectionObserver.observe(section));

  /* ---- Trade button micro-interaction ---- */
  document.querySelectorAll('.btn-trade').forEach(btn => {
    btn.addEventListener('click', function () {
      const originalText = this.textContent;
      const isYes = this.classList.contains('btn-yes');

      this.textContent = isYes ? '✓ Buying YES...' : '✓ Buying NO...';
      this.style.opacity = '0.7';

      setTimeout(() => {
        this.textContent = originalText;
        this.style.opacity = '';
      }, 1200);
    });
  });

  /* ---- Animated bar fills on hero preview ---- */
  function animateBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      const parent = bar.closest('.feed-bar');
      if (!parent) return;
      const pct = parent.style.getPropertyValue('--pct');
      if (pct) {
        bar.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
            bar.style.width = pct + '%';
          }, 300);
        });
      }
    });
  }
  // Run on load
  window.addEventListener('load', animateBars);

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Hero preview live-update simulation ---- */
  const markets = [
    { tag: 'AI', question: 'Will OpenAI release GPT-5 in 2025?', yesPrice: 71, noPrice: 29 },
    { tag: 'SPORTS', question: 'Will Man City win Champions League 2026?', yesPrice: 34, noPrice: 66 },
    { tag: 'TECH', question: 'Will Apple unveil AR glasses at WWDC?', yesPrice: 55, noPrice: 45 },
    { tag: 'CRYPTO', question: 'Will BTC surpass $120K before 2026?', yesPrice: 78, noPrice: 22 },
    { tag: 'POLITICS', question: 'Will the Fed cut rates in Q3 2025?', yesPrice: 62, noPrice: 38 },
  ];

  let marketIdx = 0;
  const feedItems = document.querySelectorAll('.feed-item');

  function cycleMarket() {
    marketIdx = (marketIdx + 1) % markets.length;
    const m = markets[marketIdx];
    const item = feedItems[0];
    if (!item) return;

    const tag = item.querySelector('.feed-tag');
    const question = item.querySelector('.feed-question');
    const yesFill = item.querySelectorAll('.bar-fill')[0];
    const noFill = item.querySelectorAll('.bar-fill')[1];
    const yesLabel = item.querySelectorAll('.bar-pct')[0];
    const noLabel = item.querySelectorAll('.bar-pct')[1];

    // Fade out
    item.style.transition = 'opacity 0.3s ease';
    item.style.opacity = '0.5';

    setTimeout(() => {
      if (tag) tag.textContent = m.tag;
      if (question) question.textContent = m.question;
      if (yesFill) { yesFill.style.transition = 'width 0.8s ease'; yesFill.style.width = m.yesPrice + '%'; }
      if (noFill) { noFill.style.transition = 'width 0.8s ease'; noFill.style.width = m.noPrice + '%'; }
      if (yesLabel) yesLabel.textContent = m.yesPrice + '¢';
      if (noLabel) noLabel.textContent = m.noPrice + '¢';
      item.style.opacity = '1';
    }, 300);
  }

  setInterval(cycleMarket, 4000);

  /* ---- Tiny price ticker on feed item 2 ---- */
  const pct2 = feedItems[1];
  if (pct2) {
    const yesBar = pct2.querySelectorAll('.bar-fill')[0];
    const yesLbl = pct2.querySelectorAll('.bar-pct')[0];
    const noLbl = pct2.querySelectorAll('.bar-pct')[1];
    let yesVal = 78;

    setInterval(() => {
      const delta = (Math.random() - 0.5) * 4;
      yesVal = Math.max(20, Math.min(95, yesVal + delta));
      const noVal = 100 - Math.round(yesVal);
      if (yesBar) { yesBar.style.transition = 'width 0.6s ease'; yesBar.style.width = Math.round(yesVal) + '%'; }
      if (yesLbl) yesLbl.textContent = Math.round(yesVal) + '¢';
      if (noLbl) noLbl.textContent = noVal + '¢';
    }, 2800);
  }

  console.log('%cCHOICE Markets', 'color:#ff0000;font-size:20px;font-weight:bold;font-family:monospace');
  console.log('%cAI-Powered Prediction Markets — choice.markets', 'color:#888;font-size:12px');
})();
