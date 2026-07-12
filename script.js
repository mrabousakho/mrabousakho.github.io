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
  initCommandPalette();
  initMatrixBackground();
  initGithubStats();
  initCaseFilters();
});

// ===== Subtle matrix-style hero background (Home page only) =====
function initMatrixBackground(){
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const chars = 'KQL01{}[]<>|;:.,ATT&CKDCSyncLSASSC2RDP';
  let cols, drops, w, h;

  function resize(){
    const parent = canvas.parentElement;
    w = canvas.width = parent.clientWidth;
    h = canvas.height = parent.clientHeight;
    cols = Math.floor(w / 16);
    drops = new Array(cols).fill(0);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw(){
    ctx.fillStyle = 'rgba(8,9,11,0.12)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ff4433';
    ctx.font = '13px JetBrains Mono, monospace';
    for (let i = 0; i < cols; i++){
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * 16, drops[i] * 16);
      if (drops[i] * 16 > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ===== Live GitHub stats (WhoAmI page) =====
function initGithubStats(){
  const el = document.getElementById('gh-stats');
  if (!el) return;
  el.classList.add('loading');
  fetch('https://api.github.com/users/mrabousakho')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      el.classList.remove('loading');
      el.innerHTML = `
        <div class="gh-stat"><b>${data.public_repos ?? '—'}</b><span>Public Repos</span></div>
        <div class="gh-stat"><b>${data.followers ?? '—'}</b><span>Followers</span></div>
        <div class="gh-stat"><b>${new Date(data.created_at).getFullYear()}</b><span>On GitHub Since</span></div>
      `;
    })
    .catch(() => {
      el.classList.remove('loading');
      el.innerHTML = `<div class="gh-stat"><span>GitHub stats unavailable right now — <a href="https://github.com/mrabousakho" target="_blank" rel="noopener" style="color:var(--red);">view profile directly</a></span></div>`;
    });
}

// ===== Case Files filter buttons =====
function initCaseFilters(){
  const row = document.getElementById('filter-row');
  if (!row) return;
  const buttons = row.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#case-grid .card, #repo-grid .card');

  buttons.forEach(btn => {
    btn.addEventListener('click', ()=>{
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all'){
          card.classList.remove('hidden-by-filter');
          return;
        }
        const badge = card.querySelector('.badge');
        const badgeClass = badge ? Array.from(badge.classList).find(c => c !== 'badge') : null;
        if (badgeClass === filter){
          card.classList.remove('hidden-by-filter');
        } else {
          card.classList.add('hidden-by-filter');
        }
      });
    });
  });
}

// ===== Command palette (press "/" or Ctrl+K) =====
function initCommandPalette(){
  const commands = [
    { label: 'Home', desc: 'Back to the start', href: 'index.html' },
    { label: 'WhoAmI', desc: 'Background & journey', href: 'whoami.html' },
    { label: 'Case Files', desc: 'Threat hunts & investigations', href: 'case-files.html' },
    { label: 'Projects', desc: 'Apps, AI agents, tools', href: 'projects.html' },
    { label: 'Ops', desc: 'KQL/SPL field notes', href: 'ops.html' },
    { label: 'Contact', desc: 'Get in touch', href: 'contact.html' },
    { label: 'Resume', desc: 'Styled resume + PDF download', href: 'resume.html' },
    { label: 'GitHub', desc: 'github.com/mrabousakho', href: 'https://github.com/mrabousakho' },
    { label: 'LinkedIn', desc: 'linkedin.com/in/asakho', href: 'https://www.linkedin.com/in/asakho/' },
  ];

  const overlay = document.createElement('div');
  overlay.className = 'cmdk-overlay';
  overlay.innerHTML = `
    <div class="cmdk-box">
      <div class="cmdk-input-row">
        <span class="cmdk-prompt">&gt;</span>
        <input class="cmdk-input" type="text" placeholder="Type a command… (Home, Case Files, Contact…)" autocomplete="off">
      </div>
      <div class="cmdk-list"></div>
      <div class="cmdk-hint">↑↓ navigate · ↵ select · esc close</div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.cmdk-input');
  const list = overlay.querySelector('.cmdk-list');
  let activeIndex = 0;
  let filtered = commands;

  function render(){
    list.innerHTML = '';
    filtered.forEach((c, i)=>{
      const row = document.createElement('div');
      row.className = 'cmdk-row' + (i === activeIndex ? ' active' : '');
      row.innerHTML = `<span class="cmdk-label">${c.label}</span><span class="cmdk-desc">${c.desc}</span>`;
      row.addEventListener('click', ()=> go(c));
      list.appendChild(row);
    });
  }

  function go(c){
    if (!c) return;
    window.location.href = c.href;
  }

  function open(){
    overlay.classList.add('open');
    input.value = '';
    filtered = commands;
    activeIndex = 0;
    render();
    setTimeout(()=> input.focus(), 10);
  }
  function close(){
    overlay.classList.remove('open');
  }

  input.addEventListener('input', ()=>{
    const q = input.value.toLowerCase();
    filtered = commands.filter(c => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
    activeIndex = 0;
    render();
  });

  input.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowDown'){ e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
    else if (e.key === 'Enter'){ go(filtered[activeIndex]); }
    else if (e.key === 'Escape'){ close(); }
  });

  overlay.addEventListener('click', (e)=>{ if (e.target === overlay) close(); });

  document.addEventListener('keydown', (e)=>{
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))){
      e.preventDefault();
      open();
    } else if (e.key === 'Escape'){
      close();
    }
  });
}
