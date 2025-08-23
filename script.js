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

<script>
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.zoom-list a');
  if(!btn) return;
  // If your links navigate to other pages, remove the next line.
  e.preventDefault(); 
  btn.classList.toggle('is-active');
});
</script>





