// ======================================================
// UNIVERSE LEVEL 3 — CONSTELLATION + 3D GALAXY REVEAL
// ======================================================

// CANVAS + CTX
const canvas = document.getElementById("constellationCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ========================================
// 1. STARFIELD BACKGROUND
// ========================================
const STAR_COUNT = 220;
let stars = [];

function genStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 1.5 + 0.4,
            size: Math.random() * 1.3 + 0.4
        });
    }
}
genStars();

function drawStarfield() {
    stars.forEach(star => {
        star.y += 0.15 * star.z;
        if (star.y > canvas.height) star.y = 0;

        ctx.globalAlpha = star.z * 0.9;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// ========================================
// 2. CONSTELLATION LOGIC (Scorpio)
// ========================================
const CONSTELLATION = [
    { x: 0.38, y: 0.18 },
    { x: 0.45, y: 0.27 },
    { x: 0.50, y: 0.37 },
    { x: 0.54, y: 0.49 },
    { x: 0.48, y: 0.62 },
    { x: 0.42, y: 0.73 },
    { x: 0.50, y: 0.84 }
];

let points = [];
let progress = 0;
let done = false;

function calcPoints() {
    points = CONSTELLATION.map(p => ({
        x: p.x * canvas.width,
        y: p.y * canvas.height
    }));
}
calcPoints();

function drawConstellation() {
    // Stars
    points.forEach((p, i) => {
        ctx.fillStyle = "white";
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

    // Lines
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < progress - 1; i++) {
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
    }
    ctx.stroke();
}

// TOUCH
canvas.addEventListener("pointerdown", (e) => {
    if (done) return;

    const target = points[progress];
    const dist = Math.hypot(e.clientX - target.x, e.clientY - target.y);

    if (dist < 35) {
        progress++;

        if (progress === points.length) {
            done = true;
            startGalaxyReveal();
        }
    }
});

// ========================================
// 3. CINEMATIC TRANSITION TO 3D UNIVERSE
// ========================================
const flash = document.getElementById("flash");
const loadingText = document.getElementById("loadingText");
const ui = document.getElementById("ui");

function startGalaxyReveal() {
    ui.classList.add("hide");

    // Flash white
    setTimeout(() => {
        flash.style.opacity = 1;
    }, 300);

    // Loading text
    setTimeout(() => {
        loadingText.classList.add("show");
    }, 700);

    // Show 3D universe
    setTimeout(() => {
        flash.style.opacity = 0;
        loadingText.style.opacity = 0;
        document.getElementById("universe3D").style.display = "block";
        init3DUniverse();
    }, 1500);
}

// ========================================
// 4. REAL 3D UNIVERSE (Three.js)
// ========================================
let scene, camera, renderer, starGeo, starField;

function init3DUniverse() {
    const canvas3D = document.getElementById("universeCanvas");

    renderer = new THREE.WebGLRenderer({
        canvas: canvas3D,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Stars geometry
    starGeo = new THREE.BufferGeometry();
    const starCount = 4500;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.05,
        transparent: true,
        opacity: 0.9
    });

    starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);

    // Rotate galaxy
    starField.rotation.y += 0.0009;
    starField.rotation.x += 0.0003;

    renderer.render(scene, camera);
}

// ========================================
// MAIN ANIMATION LOOP (2D STARS)
// ========================================
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStarfield();
    drawConstellation();
    requestAnimationFrame(animate);
}
animate();
