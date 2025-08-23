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


document.addEventListener('DOMContentLoaded', () => {
  initFooterYear();
  initFlipCards();
  markActiveNav();
  initSkillsTabs();
});

