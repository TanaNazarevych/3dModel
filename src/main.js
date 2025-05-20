import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// **Scene setup**
const scene = new THREE.Scene();

// **Camera setup**
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-1.5, 0, 4);  // Move camera left and further back

// **Renderer setup** (Transparent background)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Ensure transparency
document.body.appendChild(renderer.domElement);

// **Lighting setup**
const light = new THREE.DirectionalLight(0xffffff, 2); // Brighter light
light.position.set(-3, 2, 5).normalize();
scene.add(light);

// **Load 3D Heart Model**
const loader = new GLTFLoader();
let heart;

loader.load('/models/heart.glb', (gltf) => {
    heart = gltf.scene;
    heart.scale.set(0.5, 0.5, 0.5);  // Adjust size
    heart.position.set(1, 0, 0);  // Move heart slightly to the right
    scene.add(heart);
}, undefined, (error) => {
    console.error('Error loading the heart model:', error);
});

// **Mouse hover detection**
let isHovered = false;

window.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    if (mouseX > 0.2) {
        isHovered = true;
    } else {
        isHovered = false;
    }
});

// **Heartbeat Animation Variables**
let bpm = 60; // Default BPM
let isBeating = false;
let scaleFactor = 0.5;
let growing = true;
let lastUpdateTime = Date.now();
let interval = (60 / bpm) * 1000 / 2; // Half-beat interval

// **Function to simulate heartbeat animation**
function startBeating() {
    if (!isBeating) return;

    let currentTime = Date.now();
    if (heart && currentTime - lastUpdateTime >= interval) {
        if (growing) {
            heart.scale.set(scaleFactor * 1.1, scaleFactor * 1.1, scaleFactor * 1.1);
        } else {
            heart.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }
        growing = !growing;
        lastUpdateTime = currentTime;
    }

    setTimeout(startBeating, interval);
}

// **Start & Stop Buttons**
document.getElementById("start").addEventListener("click", () => {
    isBeating = true;
    startBeating();
});

document.getElementById("stop").addEventListener("click", () => {
    isBeating = false;
    if (heart) {
        heart.scale.set(scaleFactor, scaleFactor, scaleFactor);  // Reset to normal size
    }
});

// **Age Group BPM Buttons**
document.querySelectorAll(".bpm-btn").forEach(button => {
    button.addEventListener("click", (event) => {
        bpm = parseInt(event.target.getAttribute("data-bpm"));
        interval = (60 / bpm) * 1000 / 2; // Update interval based on BPM
    });
});

// **Custom BPM Input**
document.getElementById("set-bpm").addEventListener("click", () => {
    let inputBpm = parseInt(document.getElementById("custom-bpm").value);
    if (inputBpm > 0) {
        bpm = inputBpm;
        interval = (60 / bpm) * 1000 / 2;
    }
});

// **Animation Loop (Handles rotation & rendering)**
function animate() {
    requestAnimationFrame(animate);

    if (heart) {
        if (isHovered) {
            heart.rotation.y += 0.02; // Rotate when hovered
        }
    }

    renderer.render(scene, camera);
}
animate();
