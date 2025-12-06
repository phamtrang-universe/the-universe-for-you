// === THREE.JS SCENE SETUP ===
let scene, camera, renderer, stars = [];

function initUniverse() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("universeCanvas"), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create stars
    createStars(800);

    // Start animation
    animate();
}

// === CREATE STAR FIELD ===
function createStars(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 30;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffffff
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);
}

// === ANIMATION LOOP ===
function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.0008;
    scene.rotation.x += 0.0003;
    renderer.render(scene, camera);
}

// === CLICK TO ENTER UNIVERSE ===
document.getElementById("connectBtn").addEventListener("click", () => {
    document.getElementById("connectScreen").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("connectScreen").style.display = "none";
        document.getElementById("universeCanvas").style.display = "block";
        initUniverse();
    }, 700);
});

// For responsiveness
window.addEventListener("resize", () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
