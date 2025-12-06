// script.js (fixed for index.html that uses canvas id="galaxy" and .typing)
// Level2 — Galaxy + Scorpius touch-to-connect + explosion -> redirect

// CONFIG
const STAR_COUNT = 300;
const STAR_SPEED = 0.08;
const CONSTELLATION_POINTS = [
  { x: 0.50, y: 0.20 },
  { x: 0.60, y: 0.28 },
  { x: 0.62, y: 0.40 },
  { x: 0.58, y: 0.55 },
  { x: 0.55, y: 0.65 },
  { x: 0.50, y: 0.75 },
  { x: 0.44, y: 0.85 }
];

// ELEMENTS (match index.html)
const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');
const typingEl = document.querySelector('.typing');
const flashEl = document.getElementById('flash');

// resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// starfield
let stars = [];
function genStars(){
  stars = [];
  for (let i=0;i<STAR_COUNT;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      z: Math.random()*1.6 + 0.4,
      r: Math.random()*1.6 + 0.3
    });
  }
}
genStars();

// prepare constellation pixel positions
let constellationPixels = CONSTELLATION_POINTS.map(p => ({
  x: Math.round(p.x * canvas.width),
  y: Math.round(p.y * canvas.height)
}));

// state
let touchedIndex = 0;
let allConnected = false;

// animate starfield + small nebula blobs
let t0 = performance.now();
function draw() {
  const now = performance.now();
  const dt = (now - t0) * 0.001;
  t0 = now;

  // background (slight gradient)
  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0,'#020317');
  g.addColorStop(1,'#07041a');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // small nebula blobs (subtle)
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#2a0f63';
  ctx.beginPath();
  ctx.ellipse(canvas.width*0.15, canvas.height*0.25, 220,120,0,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#00183f';
  ctx.beginPath();
  ctx.ellipse(canvas.width*0.85, canvas.height*0.72, 180,100,0,0,Math.PI*2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // stars
  for (let s of stars){
    s.y += STAR_SPEED * (s.z+0.2) * (dt*60);
    if (s.y > canvas.height) s.y = -10;
    ctx.globalAlpha = 0.8 * (0.6 + (s.z*0.4));
    ctx.fillStyle = `rgba(200,220,255,${ctx.globalAlpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // draw constellation points
  for (let i=0;i<constellationPixels.length;i++){
    const p = constellationPixels[i];
    // small pulse when reached
    const reached = i < touchedIndex;
    ctx.fillStyle = reached ? '#fff6dd' : 'rgba(220,230,255,0.85)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, reached ? 8 : 5, 0, Math.PI*2);
    ctx.fill();

    // soft glow
    ctx.globalAlpha = reached ? 0.22 : 0.14;
    ctx.beginPath();
    ctx.arc(p.x, p.y, reached ? 20 : 14, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // draw connected lines up to touchedIndex
  if (touchedIndex > 1){
    ctx.strokeStyle = 'rgba(220,230,255,0.95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i=0;i<touchedIndex;i++){
      const p = constellationPixels[i];
      if (i===0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// handle pointer -> require user to tap near the next star
canvas.addEventListener('pointerdown', (e) => {
  if (allConnected) return;
  // allow tap anywhere to start typing first if desired
  // compute pointer coords
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  const target = constellationPixels[touchedIndex];
  const dx = px - target.x;
  const dy = py - target.y;
  const dist = Math.hypot(dx,dy);

  // threshold depends on screen size
  const threshold = Math.max(28, Math.min(52, canvas.width * 0.04));

  if (dist <= threshold) {
    // correct tap
    touchedIndex++;
    // little subtle sound or pulse could be added here
    if (touchedIndex >= constellationPixels.length){
      allConnected = true;
      // reveal typed message
      revealMessage();
      // slight delay then explosion effect and final redirect
      setTimeout(() => showFlashAndRedirect(), 1500);
    }
  } else {
    // optional: if user taps elsewhere we can show a small hint pulse
    // draw small ripple
    ripple(px,py);
  }
});

// ripple helper
function ripple(x,y){
  const rad = 6;
  ctx.save();
  ctx.strokeStyle = 'rgba(180,200,255,0.6)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x,y,rad,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
}

// reveal typed message (typing effect)
function revealMessage(){
  const phrase = "In this universe, only you shine this bright.";
  typingEl.textContent = '';
  let idx = 0;
  const speed = 45;
  const show = () => {
    if (idx <= phrase.length){
      typingEl.textContent = phrase.slice(0, idx);
      idx++;
      setTimeout(show, speed);
    } else {
      // add small glow after finish
      typingEl.style.textShadow = '0 8px 40px rgba(130,90,255,0.18), 0 2px 12px rgba(10,20,60,0.6)';
    }
  };
  show();
}

// flash + redirect
function showFlashAndRedirect(){
  if (!flashEl) {
    window.location.href = 'message.html';
    return;
  }
  flashEl.classList.add('show');
  // quick zoom/pulse via transform
  setTimeout(()=> {
    // redirect after flash
    window.location.href = 'message.html';
  }, 900);
}

