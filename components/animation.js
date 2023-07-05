import "../style.css";

import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";

// Loaders
const loader = new THREE.TextureLoader();
const circle = loader.load("circle.png");
const circleGreen = loader.load("circle-green.png");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

/**
 * geometry
 */

// particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 500;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const pointMaterial = new THREE.PointsMaterial({
  scales: 0.002,
  map: circle,
  transparent: true,
});
const pointMesh = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(pointMesh);

// 3d text
const ttfLoader = new TTFLoader();
const fontLoader = new FontLoader();
ttfLoader.load("fonts/Kanit-Bold.ttf", (json) => {
  const kanit = fontLoader.parse(json);
  const textGeometry = new TextGeometry("TODOS", {
    height: 0.5,
    size: 0.3,
    font: kanit,
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -0.8;
  textMesh.position.y = 1.6;
  textMesh.position.z = 0;

  textMesh.lookAt(-0.7, 0, 4);
  scene.add(textMesh);
});
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
scene.background = new THREE.Color("rgba(247,247,247,255)");

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;
let mouse = {
  x: 0,
  y: 0,
};
window.addEventListener(
  "mousemove",
  (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  },
  false
);
taskList.addEventListener("click", (e) => {
  if (
    e.target.classList == "fake-checked" &&
    !e.target.closest("li").querySelector("input").checked
  ) {
    pointMaterial.map = circleGreen;
  }
});

setInterval(() => {
  pointMaterial.map = circle;
}, 3000);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;
  camera.position.x += (mouse.x / 2 - camera.position.x) * 0.05;
  camera.position.y += (mouse.y / 2 - camera.position.y) * 0.05;

  camera.lookAt(0, 0, 0);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
