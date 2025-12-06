
/* ============================================
   Universe Option C – Particle Explosion
   Author: ChatGPT for Nguyên 💫
============================================ */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ============================================
   STARFIELD BACKGROUND
============================================ */
let stars = [];
const STAR_COUNT = 150;

function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.2 + Math.random() * 0.4,
            size: 0.5 + Math.random() * 1
        });
    }
}
createStars();

function drawStarfield() {
    for (let s of stars) {
        s.y += s.speed;
        if (s.y > canvas.height) s.y = 0;

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ============================================
   CONSTELLATION — Scorpio (7 points)
============================================ */
const CONSTELLATION = [
    { x: 0.32, y: 0.22 },
    { x: 0.42, y: 0.32 },
    { x: 0.51, y: 0.40 },
    { x: 0.55, y: 0.50 },
    { x: 0.48, y: 0.62 },
    { x: 0.42, y: 0.75 },
    { x: 0.53, y: 0.83 }
];

let points = [];
let progress = 0;
let finished = false;

function convertPoints() {
    points = CONSTELLATION.map(p => ({
        x: p.x * canvas.width,
        y: p.y * canvas.height
    }));
}
convertPoints();

/* Draw points + lines up to progress */
function drawConstellation() {
    ctx.globalAlpha = 1;

    // stars (points)
    points.forEach((p, i) => {
        // glow
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
    });

    // lines for connected part
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < progress - 1; i++) {
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
    }
    ctx.stroke();
}

/* ============================================
   TAP HANDLER
============================================ */
canvas.addEventListener("pointerdown", e => {
    if (finished) return;

    let x = e.clientX;
    let y = e.clientY;

    let target = points[progress];
    let dist = Math.hypot(x - target.x, y - target.y);

    if (dist < 32) {
        progress++;

        // Done all 7 points
        if (progress === points.length) {
            finished = true;
            triggerExplosion();
        }
    }
});

/* ============================================
   PARTICLE EXPLOSION
============================================ */
let particles = [];
const particleLayer = document.getElementById("particleLayer");
const finalMsg = document.getElementById("finalMessage");
const flash = document.getElementById("flash");

function triggerExplosion() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create 180–220 particles
    for (let i = 0; i < 200; i++) {
        let angle = Math.random() * Math.PI * 2;
        let speed = 1.5 + Math.random() * 3;

        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            size: 2 + Math.random() * 2
        });
    }

    // Flash bright white
    setTimeout(() => {
        flash.style.opacity = 1;
    }, 300);

    setTimeout(() => {
        flash.style.opacity = 0;
    }, 650);

    // Show final phrase
    setTimeout(() => {
        finalMsg.style.opacity = 1;
    }, 1200);
}

/* Draw particles */
function drawParticles() {
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    particles = particles.filter(p => p.life > 0);
}

/* ============================================
   ANIMATION LOOP
============================================ */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStarfield();
    drawConstellation();
    drawParticles();

    requestAnimationFrame(animate);
}
animate();
