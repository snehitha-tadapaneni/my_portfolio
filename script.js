// Flip card toggles
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-flip]');
  if (t) {
    t.classList.toggle('is-flipped');
  }
});

// Mark active nav item if present
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a=>{
    const href = a.getAttribute('href');
    if ((path === '' && href.endsWith('index.html')) || href.endsWith(path)) {
      a.classList.add('active');
    }
  });
})();

// Home: show fallback image if PDF can’t load
function showResumeFallback(){
  const holder = document.querySelector('#resume-fallback');
  const iframe = document.querySelector('#resume-embed');
  if (!holder || !iframe) return;
  let handled = false;

  const swap = () => {
    if (handled) return;
    handled = true;
    iframe.remove();
    holder.style.display = 'flex';
  };

  iframe.addEventListener('error', swap);
  // If PDF blocked by browser, use a timeout to swap
  setTimeout(()=>{
    // crude check: if iframe hasn't painted height, show fallback
    if (iframe.contentDocument == null) swap();
  }, 2500);
}
