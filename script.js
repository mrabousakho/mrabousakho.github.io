// ===== Typewriter effect =====
// Any element with class "type-target" inside a ".type-panel" gets typed out
// character by character the first time it scrolls into view, then keeps a
// blinking cursor at the end (like a live terminal prompt).
function initTypewriters(){
  const targets = document.querySelectorAll('.type-target');
  if (!targets.length) return;

  const speed = 18; // ms per character

  function typeInto(el){
    const full = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', full);
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    el.after(cursor);

    let i = 0;
    function step(){
      if (i <= full.length){
        el.textContent = full.slice(0, i);
        i++;
        setTimeout(step, speed);
      }
    }
    step();
  }

  // Fire immediately for anything already on screen (covers the hero
  // terminal, which is always above the fold) instead of relying solely
  // on IntersectionObserver, which was failing to trigger reliably.
  const already = new Set();
  targets.forEach((t, idx)=>{
    const rect = t.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView){
      already.add(t);
      setTimeout(()=> typeInto(t), idx * 120);
    }
  });

  const remaining = Array.from(targets).filter(t => !already.has(t));
  if (remaining.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          typeInto(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    remaining.forEach(t => io.observe(t));
  }
}

// ===== Highlight current page in nav =====
function initNavActive(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(a=>{
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initTypewriters();
  initNavActive();
});
