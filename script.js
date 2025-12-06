// Universe Level 2 — script.js
// Cinematic Galaxy + Scorpio Constellation + Touch Interaction + Star Explosion

// ===== CONFIG =====
const STAR_COUNT = 250;
const STAR_SPEED = 0.12;
const CONSTELLATION_POINTS = [
    { x: 0.38, y: 0.20 },
    { x: 0.45, y: 0.28 },
    { x: 0.52, y: 0.37 },
    { x: 0.55, y: 0.47 },
    { x: 0.48, y: 0.60 },
    { x: 0.42, y: 0.72 },
    { x: 0.50, y: 0.82 }
];

// ===== CANVAS SETUP =====
const canvas = document.getElementById("universeCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== STARFIELD GENERATION =====
let stars = [];

function generateStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 2 + 0.3,
            size: Math.random() * 1.2 + 0.2
        });
    }
}
generateStars();

// ===== DRAW MOVING GALAXY =====
function drawGalaxy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.y += STAR_SPEED * star.z;
        if (star.y > canvas.height) star.y = 0;

        ctx.globalAlpha = 0.6 * star.z;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ===== CONSTELLATION =====
let constellationPixels = [];
let touchedIndex = 0;
let allConnected = false;

function drawConstellation() {
    constellationPixels = CONSTELLATION_POINTS.map(p => ({
        x: p.x * canvas.width,
        y: p.y * canvas.height
    }));

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    constellationPixels.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    // Draw connected lines
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < touchedIndex - 1; i++) {
        ctx.moveTo(constellationPixels[i].x, constellationPixels[i].y);
        ctx.lineTo(constellationPixels[i + 1].x, constellationPixels[i + 1].y);
    }
    ctx.stroke();
}

// ===== TOUCH HANDLING =====
canvas.addEventListener("pointerdown", e => {
    if (allConnected) return;

    let x = e.clientX;
    let y = e.clientY;

    let target = constellationPixels[touchedIndex];

    let dist = Math.hypot(x - target.x, y - target.y);

    if (dist < 30) {
        touchedIndex++;

        if (touchedIndex === CONSTELLATION_POINTS.length) {
            allConnected = true;
            setTimeout(showMessage, 700);
            setTimeout(starExplosion, 2000);
        }
    }
});

// ===== TYPING MESSAGE =====
function showMessage() {
    const msg = document.getElementById("messageText");
    msg.style.opacity = 1;
}

// ===== STAR EXPLOSION =====
function starExplosion() {
    const flash = document.getElementById("flash");
    flash.style.opacity = 1;
    flash.style.transition = "opacity 0.6s ease";

    setTimeout(() => {
        window.location.href = "message.html";
    }, 800);
}

// ===== MAIN LOOP =====
function animate() {
    drawGalaxy();
    drawConstellation();
    requestAnimationFrame(animate);
}
animate();
