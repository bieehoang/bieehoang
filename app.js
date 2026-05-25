/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
const curDot  = document.getElementById('curDot');
const curRing = document.getElementById('curRing');

if (curDot && curRing && window.innerWidth > 768) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curDot.style.left = mx + 'px';
    curDot.style.top  = my + 'px';
  });

  (function ringLoop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    curRing.style.left = rx + 'px';
    curRing.style.top  = ry + 'px';
    requestAnimationFrame(ringLoop);
  })();
}

/* ═══════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════ */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

let W, H, particles = [];

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3 - 0.1;
    this.life = 0;
    this.maxLife = 180 + Math.random() * 220;
    this.size = 0.8 + Math.random() * 1.4;
    this.gold = Math.random() > 0.6;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    const prog = this.life / this.maxLife;
    const alpha = prog < 0.15
      ? prog / 0.15
      : prog > 0.75
        ? (1 - prog) / 0.25
        : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.gold
      ? `rgba(212,160,23,${alpha * 0.55})`
      : `rgba(200,190,160,${alpha * 0.2})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) {
  const p = new Particle();
  p.life = Math.random() * p.maxLife; // pre-seed
  particles.push(p);
}

// Connection lines between nearby gold particles
function drawConnections() {
  const gp = particles.filter(p => p.gold);
  for (let i = 0; i < gp.length; i++) {
    for (let j = i + 1; j < gp.length; j++) {
      const dx = gp[i].x - gp[j].x;
      const dy = gp[i].y - gp[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(gp[i].x, gp[i].y);
        ctx.lineTo(gp[j].x, gp[j].y);
        ctx.strokeStyle = `rgba(212,160,23,${(1 - d/120) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ═══════════════════════════════════════════
   NAV SCROLL
═══════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════════
   HAMBURGER
═══════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════
   TERMINAL TYPER
═══════════════════════════════════════════ */
const termCmd    = document.getElementById('termCmd');
const termOutput = document.getElementById('termOutput');

const sequence = [
  {
    cmd: 'whoami',
    out: [
      { cls: 'to-gold',  txt: 'bieehoang' },
    ]
  },
  {
    cmd: 'cat /etc/role',
    out: [
      { cls: 'to-green', txt: '→ DevOps Engineer' },
      { cls: 'to-line',  txt: '→ Linux · Docker · Nginx · Shell' },
    ]
  },
  {
    cmd: 'uptime --pretty',
    out: [
      { cls: 'to-line',  txt: 'up 3 years, maintaining systems' },
    ]
  },
  {
    cmd: 'docker ps --format "{{.Names}}"',
    out: [
      { cls: 'to-green', txt: 'nginx-proxy' },
      { cls: 'to-green', txt: 'app-container' },
      { cls: 'to-green', txt: 'monitor-stack' },
    ]
  },
];

let seqIdx = 0;

function typeCmd(str, cb) {
  let i = 0;
  termCmd.textContent = '';
  const t = setInterval(() => {
    termCmd.textContent += str[i++];
    if (i >= str.length) { clearInterval(t); setTimeout(cb, 350); }
  }, 65);
}

function showOutput(lines, cb) {
  termOutput.innerHTML = '';
  lines.forEach((l, i) => {
    setTimeout(() => {
      const d = document.createElement('div');
      d.className = l.cls;
      d.textContent = l.txt;
      termOutput.appendChild(d);
      if (i === lines.length - 1) setTimeout(cb, 1400);
    }, i * 180);
  });
}

function deleteCmd(cb) {
  const t = setInterval(() => {
    if (termCmd.textContent.length === 0) { clearInterval(t); cb(); }
    else termCmd.textContent = termCmd.textContent.slice(0, -1);
  }, 35);
}

function runSequence() {
  const step = sequence[seqIdx % sequence.length];
  typeCmd(step.cmd, () => {
    showOutput(step.out, () => {
      deleteCmd(() => {
        termOutput.innerHTML = '';
        seqIdx++;
        setTimeout(runSequence, 300);
      });
    });
  });
}
setTimeout(runSequence, 800);

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════ */
function animCounter(el) {
  const target = parseInt(el.dataset.target);
  const dur = 1400, step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur);
  }, 16);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target); cntObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

/* ═══════════════════════════════════════════
   MAGNETIC TILT on cards
═══════════════════════════════════════════ */
document.querySelectorAll('.proj-card, .stack-card, .contact-card').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    el.style.transform = `perspective(800px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-5px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ═══════════════════════════════════════════
   ACTIVE NAV
═══════════════════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const secObs   = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (a) a.style.color = '#d4a017';
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => secObs.observe(s));

/* ═══════════════════════════════════════════
   GOLD RIPPLE on click
═══════════════════════════════════════════ */
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  Object.assign(ripple.style, {
    position: 'fixed',
    left: e.clientX - 15 + 'px',
    top:  e.clientY - 15 + 'px',
    width: '30px', height: '30px',
    border: '1.5px solid rgba(212,160,23,0.6)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '9990',
    animation: 'rippleOut .6s ease-out forwards',
  });
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// inject ripple keyframes
const style = document.createElement('style');
style.textContent = `@keyframes rippleOut {
  0%   { transform: scale(1); opacity: 1; }
  100% { transform: scale(3.5); opacity: 0; }
}`;
document.head.appendChild(style);