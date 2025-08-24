// Utilities
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// Flip card toggles 
function initFlipCards() {
  document.querySelectorAll('.flip[data-flip]').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');

    const toggle = () => {
      card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', card.classList.contains('is-flipped') ? 'true' : 'false');
    };

    // IMPORTANT: still flip even if you clicked a link/button
    card.addEventListener('click', (e) => {
      const clickable = e.target.closest('a,button');
      if (clickable) e.preventDefault();  // stop navigation
      toggle();
    });

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
/*
function initSkillsTabs() {
  const skillLinksWrap = document.querySelector('#skill-links');
  const cards = document.querySelectorAll('.skill-card');
  if (!skillLinksWrap || !cards.length) return;

  const links = skillLinksWrap.querySelectorAll('a');

  function clearActive() {
    skillLinksWrap.querySelectorAll('a.is-active').forEach(a => a.classList.remove('is-active'));
  }

  // Click handler
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
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

  // Highlight correct tab while scrolling
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        clearActive();
        const match = skillLinksWrap.querySelector(`a[href="${id}"]`);
        if (match) match.classList.add('is-active');
      }
    });
  }, { threshold: 0.6 });

  cards.forEach(c => io.observe(c));
}
*/
/* new skills*/
function initSkillsTabs() {
  const wrap = document.querySelector('#skill-links');
  const cards = document.querySelectorAll('.skill-card');
  if (!wrap || !cards.length) return;

  const links = wrap.querySelectorAll('a');

  const clearActiveTabs = () =>
    wrap.querySelectorAll('a.is-active').forEach(a => a.classList.remove('is-active'));
  const clearActiveCards = () =>
    document.querySelectorAll('.skill-card.is-active').forEach(c => c.classList.remove('is-active'));

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');           // e.g. "#frameworks"
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      // highlight tab
      clearActiveTabs();
      a.classList.add('is-active');

      // highlight card (persist)
      clearActiveCards();
      target.classList.add('is-active');

      // scroll and update hash
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      history.pushState(null, '', id);
    });
  });

  // Highlight while scrolling into sections
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;

        // active tab
        clearActiveTabs();
        const match = wrap.querySelector(`a[href="${id}"]`);
        if (match) match.classList.add('is-active');

        // active card
        clearActiveCards();
        entry.target.classList.add('is-active');
      }
    });
  }, { threshold: 0.6 });

  cards.forEach(c => io.observe(c));

  // On load with a hash, highlight the right card/tab
  if (location.hash) {
    const initial = document.querySelector(location.hash);
    if (initial && initial.classList.contains('skill-card')) {
      clearActiveCards(); initial.classList.add('is-active');
      clearActiveTabs();
      const t = wrap.querySelector(`a[href="${location.hash}"]`);
      if (t) t.classList.add('is-active');
    }
  }
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
function initCertModals(){
  const cards = document.querySelectorAll('.cert');
  if (!cards.length) return;

  const modal = document.getElementById('cert-modal');
  const backdrop = document.getElementById('cert-modal-backdrop');
  const img = document.getElementById('cert-modal-img');
  const title = document.getElementById('cert-modal-title');
  const issuer = document.getElementById('cert-modal-issuer');
  const issued = document.getElementById('cert-modal-issued');
  const credId = document.getElementById('cert-modal-id');
  const linkWrap = document.getElementById('cert-modal-link');
  const cta = document.getElementById('cert-modal-cta');

  let lastFocus = null;

  function open(card){
    lastFocus = document.activeElement;
    const d = card.dataset;

    title.textContent = d.title || card.querySelector('h3')?.textContent || 'Certification';
    issuer.textContent = d.issuer || '—';
    issued.textContent = d.issued || '—';
    credId.textContent = d.id || '—';

    if (d.img) {
      img.src = d.img;
      img.alt = `${title.textContent} badge`;
      img.hidden = false;
    } else {
      img.removeAttribute('src');
      img.hidden = true;
    }

    linkWrap.textContent = '—';
    cta.hidden = true;
    if (d.link) {
      const a = document.createElement('a');
      a.href = d.link; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'View on issuer site';
      linkWrap.innerHTML = '';
      linkWrap.appendChild(a);
      cta.href = d.link;
      cta.hidden = false;
    }

    backdrop.hidden = false;
    modal.hidden = false;
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => {
      backdrop.classList.add('is-open');
      modal.classList.add('is-open');
      (modal.querySelector('[data-close]') || modal).focus();
    });
  }

  function close(){
    backdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    setTimeout(() => {
      backdrop.hidden = true;
      modal.hidden = true;
      document.body.classList.remove('no-scroll');
      if (lastFocus) lastFocus.focus();
    }, 180);
  }

  cards.forEach(card => {
    const go = () => open(card);
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) close();
  });
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') close();
  });
}



document.addEventListener('DOMContentLoaded', () => {
  initFlipCards();
  markActiveNav();
  initSkillsTabs();
  initScrollReveal();
  initHeroTypewriter();
  initTiltCards();
  initCertModals();
});













