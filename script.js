// =========================
// CANVAS SETUP
// =========================
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =========================
// SCORPIO STARS (RELATIVE POSITION)
// =========================
// Tọa độ theo % để auto scale đẹp ở mọi màn hình
const stars = [
    { x: 0.52, y: 0.12 },
    { x: 0.65, y: 0.20 },
    { x: 0.70, y: 0.30 },
    { x: 0.63, y: 0.42 },
    { x: 0.58, y: 0.55 },
    { x: 0.60, y: 0.68 },
    { x: 0.55, y: 0.80 },
];

// Convert star % → pixel
function scaledStars() {
    return stars.map(s => ({
        x: s.x * canvas.width,
        y: s.y * canvas.height
    }));
}

// =========================
// DRAW STARS
// =========================
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pts = scaledStars();

    pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#88c0ff";
        ctx.fill();
    });
}

drawStars();

// =========================
// CONNECT LINES ON TAP
// =========================
let connected = false;

function connectStars() {
    if (connected) return;
    connected = true;

    const pts = scaledStars();
    let index = 0;

    function drawNext() {
        if (index >= pts.length - 1) {
            showMessage();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(pts[index].x, pts[index].y);
        ctx.lineTo(pts[index + 1].x, pts[index + 1].y);
        ctx.strokeStyle = "#7ab8ff";
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#7ab8ff";
        ctx.stroke();

        index++;
        setTimeout(drawNext, 350);
    }

    drawNext();
}

// =========================
// FINAL MESSAGE
// =========================
function showMessage() {
    const msg = document.getElementById("finalMessage");
    msg.style.opacity = 1;
    msg.style.transform = "translateY(0)";
}

// =========================
// TAP / CLICK EVENT
// =========================
canvas.addEventListener("click", connectStars);
canvas.addEventListener("touchstart", connectStars);
