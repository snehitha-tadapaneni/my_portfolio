// ==============================
// Flip card toggles (robust + accessible)
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.flip[data-flip]').forEach(card => {
    card.setAttribute('tabindex', '0'); // keyboard friendly
    card.addEventListener('click', (e) => {
      const clickable = e.target.closest('a,button');
      if (clickable) e.preventDefault();
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });
});


// ==============================
// Mark active nav item if present
// ==============================
(function () {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.menu a').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if ((path === '' && href.endsWith('index.html')) || href.endsWith(path)) {
      a.classList.add('active');
    }
  });
})();

// ==============================
// Home: show fallback image if PDF can’t load
// ==============================
function showResumeFallback() {
  const holder = document.querySelector('#resume-fallback');
  const iframe = document.querySelector('#resume-embed');
  if (!holder || !iframe) return;

  let swapped = false;

  const swap = () => {
    if (swapped) return;
    swapped = true;
    try { iframe.remove(); } catch {}
    holder.style.display = 'flex';
  };

  // If the PDF fails to load
  iframe.addEventListener('error', swap);

  // If browser blocks inline PDF, fallback after a short delay
  // Also attempt a 'load' check; some browsers fire 'load' without rendering, so keep timeout guard.
  let loaded = false;
  iframe.addEventListener('load', () => { loaded = true; });

  setTimeout(() => {
    if (!loaded || !iframe.contentDocument) swap();
  }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Skills page behavior
  const skillLinksWrap = document.querySelector('#skill-links');
  if (skillLinksWrap){
    const links = skillLinksWrap.querySelectorAll('a');
    const cards = document.querySelectorAll('.skill-card');

    const clearActive = () => {
      skillLinksWrap.querySelectorAll('a.is-active').forEach(a=>a.classList.remove('is-active'));
    };

    links.forEach(a=>{
      a.addEventListener('click', (e)=>{
        const id = a.getAttribute('href');
        const target = document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        clearActive();
        a.classList.add('is-active');
        target.scrollIntoView({behavior:'smooth', block:'center'});
        target.classList.add('pop');
        setTimeout(()=> target.classList.remove('pop'), 450);
        history.pushState(null, '', id);
      });
    });

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = '#' + entry.target.id;
          clearActive();
          const match = skillLinksWrap.querySelector(`a[href="${id}"]`);
          if(match) match.classList.add('is-active');
        }
      });
    }, {threshold: 0.6});
    cards.forEach(c=>io.observe(c));
  }
});

  <script src="script.js"></script>
  <script>
    document.getElementById('y').textContent = new Date().getFullYear();
    (function(){
      const links = document.querySelectorAll('#skill-links a');
      const cards = document.querySelectorAll('.skill-card');

      function clearActive(){
        document.querySelectorAll('#skill-links a.is-active').forEach(a=>a.classList.remove('is-active'));
      }

      links.forEach(a=>{
        a.addEventListener('click', (e)=>{
          const id = a.getAttribute('href');
          const target = document.querySelector(id);
          if(!target) return;

          e.preventDefault();
          clearActive();
          a.classList.add('is-active');

          target.scrollIntoView({behavior:'smooth', block:'center'});
          target.classList.add('pop');
          setTimeout(()=> target.classList.remove('pop'), 450);

          history.pushState(null, '', id);
        });
      });
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            const id = '#' + entry.target.id;
            clearActive();
            const match = document.querySelector(`#skill-links a[href="${id}"]`);
            if(match) match.classList.add('is-active');
          }
        });
      }, {threshold: 0.6});
      cards.forEach(c=>io.observe(c));
    })();
  </script>



