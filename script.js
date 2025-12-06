// ----------------------
// 1. Typing Effect
// ----------------------
const text = "This universe was created just for you.";
const speed = 70;
let i = 0;

function typeEffect() {
    if (i < text.length) {
        document.getElementById("typing-text").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeEffect, speed);
    }
}
typeEffect();

// ----------------------
// 2. Play music on tap (mobile safe)
// ----------------------
document.addEventListener("click", () => {
    const music = document.getElementById("bgmusic");
    music.play();
}, { once: true });

// ----------------------
// 3. Three.js Galaxy Scene
// ----------------------
const canvas = document.getElementById("universe");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 50;

// Starfield
const starsGeometry = new THREE.BufferGeometry();
const starCount = 8000;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 600;
}
starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
    color: 0x8899ff,
    size: 0.7,
    transparent: true,
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Nebula glow
const nebulaGeometry = new THREE.SphereGeometry(80, 32, 32);
const nebulaMaterial = new THREE.MeshBasicMaterial({
    color: 0x3344ff,
    transparent: true,
    opacity: 0.15,
});
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// ----------------------
// 4. Scorpius Constellation (Bọ Cạp)
// ----------------------
const scorpiusPoints = [
    new THREE.Vector3(-10, 5, 0),
    new THREE.Vector3(-8, 2, 1),
    new THREE.Vector3(-6, -2, 0),
    new THREE.Vector3(-4, -5, -1),
    new THREE.Vector3(-2, -7, 0),
    new THREE.Vector3(0, -9, 1),
    new THREE.Vector3(2, -10, 0),
];

const lineGeometry = new THREE.BufferGeometry().setFromPoints(scorpiusPoints);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x99bbff });
const scorpiusLine = new THREE.Line(lineGeometry, lineMaterial);
scorpiusLine.position.set(20, -10, -10);
scene.add(scorpiusLine);

// ----------------------
// 5. Animation Loop
// ----------------------
function animate() {
    requestAnimationFrame(animate);

    starField.rotation.y += 0.0007;
    nebula.rotation.y += 0.0002;
    scorpiusLine.rotation.y += 0.001;

    renderer.render(scene, camera);
}

animate();

// ----------------------
// 6. Resize Handler
// ----------------------
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
