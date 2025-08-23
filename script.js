// Utilities
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// Flip card toggles 
function initFlipCards() {
  $all('.flip[data-flip]').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');

    const toggle = () => {
      card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', card.classList.contains('is-flipped') ? 'true' : 'false');
    };

    // Click anywhere on card to flip 
    card.addEventListener('click', (e) => {
      const clickable = e.target.closest('a,button');
      if (clickable) return; // don't hijack real links/buttons
      toggle();
    });

    // Space flip
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

// Mark active nav item if present
function markActiveNav() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $all('.menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if ((path === '' && href.endsWith('index.html')) || href.endsWith(path)) {
      a.classList.add('active');
    }
  });
}

// Home
function showResumeFallback() {
  const holder = $('#resume-fallback');
  const iframe = $('#resume-embed');
  if (!holder || !iframe) return;

  let swapped = false;
  const swap = () => {
    if (swapped) return;
    swapped = true;
    try { iframe.remove(); } catch {}
    holder.style.display = 'flex';
  };

  iframe.addEventListener('error', swap);

  let loaded = false;
  iframe.addEventListener('load', () => { loaded = true; });

  setTimeout(() => {
    try {
      if (!loaded || !iframe.contentDocument) swap();
    } catch {
      swap();
    }
  }, 2500);
}

// Skills page
function initSkillsTabs() {
  const skillLinksWrap = $('#skill-links');
  const cards = $all('.skill-card');
  if (!skillLinksWrap || !cards.length) return;

  const links = $all('a', skillLinksWrap);
  const clearActive = () => $all('a.is-active', skillLinksWrap).forEach(a => a.classList.remove('is-active'));

  // click → tint 
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = $(id);
      if (!target) return;

      e.preventDefault();
      clearActive();
      a.classList.add('is-active');

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('pop');
      setTimeout(() => target.classList.remove('pop'), 450);

      history.pushState(null, '', id);
    });
  });

  // highlight tab during scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        clearActive();
        const match = skillLinksWrap.querySelector(`a[href="${id}"]`);
        if (match) match.classList.add('is-active');
      }
    });
  }, {
    threshold: 0.6,
    rootMargin: '0px 0px -10% 0px'
  });

  cards.forEach(c => io.observe(c));
  window.addEventListener('beforeunload', () => io.disconnect());
}

/* ---------- Scroll reveal (reuse your .reveal CSS) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.15, rootMargin: '40px 0px -10% 0px' });
  items.forEach(el => io.observe(el));
}

/* ---------- Typewriter for hero title (runs once per session) ---------- */
function initHeroTypewriter() {
  const el = document.getElementById('hero-title');
  if (!el) return;

  // Run once per session
  if (sessionStorage.getItem('typedOnce')) return;
  sessionStorage.setItem('typedOnce', '1');

  const full = el.dataset.text || el.textContent.trim();
  el.textContent = "";            // clear
  el.classList.add('typewriter'); // caret
  let i = 0;

  const step = () => {
    if (i <= full.length) {
      el.textContent = full.slice(0, i);
      i++;
      setTimeout(step, i < 8 ? 60 : 38); // slightly faster over time
    } else {
      // stop caret after a bit
      setTimeout(() => el.classList.remove('typewriter'), 1500);
    }
  };
  step();
}

/* ---------- Subtle 3D tilt on hover (desktop only) ---------- */
function initTiltCards() {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const tiles = document.querySelectorAll('.project-block, .exp-block, .card.tilt');
  if (!tiles.length) return;

  const damp = 18; // lower = stronger tilt
  tiles.forEach(tile => {
    let rq = null;

    const onMove = (e) => {
      const r = tile.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      const rx = (+dy * 12);
      const ry = (-dx * 12);

      if (!rq) {
        rq = requestAnimationFrame(() => {
          tile.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
          tile.classList.add('is-tilting');
          rq = null;
        });
      }
    };

    const onLeave = () => {
      tile.style.transform = '';
      tile.classList.remove('is-tilting');
    };

    tile.addEventListener('mousemove', onMove);
    tile.addEventListener('mouseleave', onLeave);
  });
}



document.addEventListener('DOMContentLoaded', () => {
  initFooterYear();
  initFlipCards();
  markActiveNav();
  initSkillsTabs();
  initScrollReveal();
  initHeroTypewriter();
  initTiltCards();
});




