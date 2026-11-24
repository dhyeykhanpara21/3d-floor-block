import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createMaterials } from './materials.js';
import { createHouseArchitecture } from './house.js';
import { createKitchen } from './rooms/kitchen.js';
import { createDining } from './rooms/dining.js';
import { createSunroom } from './rooms/sunroom.js';
import { createStaircase } from './rooms/staircase.js';
import { createBathroom } from './rooms/bathroom.js';
import { createOffice } from './rooms/office.js';
import { createLiving } from './rooms/living.js';
import { createExterior } from './rooms/exterior.js';
import { createDimensionLabels } from './dimensions.js';
import { CameraLightingController } from './controls.js';
import { setupEnvironment, createPostProcessing } from './environment.js';
import { setupUI } from './ui.js';

// 1. RENDERER SETUP
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// 2. SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2d4718);

// Setup Photorealistic HDR Sky & Ground Environment Reflection
setupEnvironment(renderer, scene);

// 3. CAMERA SETUP
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 150);
camera.position.set(1.5, 24.0, 21.5);

// 4. CONTROLS SETUP
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 3;
controls.maxDistance = 60;
controls.target.set(-0.2, 0.4, 0.1);
controls.update();

// 5. ASSEMBLE ARCHITECTURE & ROOMS
const materials = createMaterials();

const house = createHouseArchitecture(materials);
scene.add(house.mesh);

const kitchen = createKitchen(materials);
scene.add(kitchen);

const dining = createDining(materials);
scene.add(dining);

const sunroom = createSunroom(materials);
scene.add(sunroom);

const staircase = createStaircase(materials);
scene.add(staircase);

const bathroom = createBathroom(materials);
scene.add(bathroom);

const office = createOffice(materials);
scene.add(office);

const living = createLiving(materials);
scene.add(living);

const exterior = createExterior(materials);
scene.add(exterior);

const dimLabels = createDimensionLabels();
dimLabels.visible = false;
scene.add(dimLabels);

// 6. CONTROLLER & CAMERA PRESETS
const controller = new CameraLightingController(scene, camera, controls, renderer);

// Upgrade sunlight shadow map resolution for architectural realism
if (controller.sunLight) {
  controller.sunLight.shadow.mapSize.width = 4096;
  controller.sunLight.shadow.mapSize.height = 4096;
  controller.sunLight.shadow.bias = -0.0002;
  controller.sunLight.shadow.radius = 2.0;
}

const cameraPresets = {
  iso: {
    name: 'Photo Isometric',
    icon: '📸',
    pos: { x: 1.5, y: 24.0, z: 21.5 },
    target: { x: -0.2, y: 0.4, z: 0.1 },
  },
  top: {
    name: '2D Floor Plan',
    icon: '📐',
    pos: { x: 0, y: 30, z: 0.01 },
    target: { x: 0, y: 0, z: 0 },
  },
  living: {
    name: 'Living Room',
    icon: '🛋️',
    pos: { x: 2.1, y: 4.8, z: 9.2 },
    target: { x: 2.1, y: 0.8, z: 4.0 },
  },
  kitchen: {
    name: 'Kitchen & Island',
    icon: '🍳',
    pos: { x: -3.3, y: 5.2, z: 0.8 },
    target: { x: -3.3, y: 0.9, z: -4.5 },
  },
  dining: {
    name: 'Dining Area',
    icon: '🍽️',
    pos: { x: -3.4, y: 4.5, z: 3.8 },
    target: { x: -3.4, y: 0.8, z: -0.1 },
  },
  sunroom: {
    name: 'Sunroom / Lounge',
    icon: '☀️',
    pos: { x: 3.4, y: 4.2, z: 0.2 },
    target: { x: 3.4, y: 0.8, z: -4.5 },
  },
  office: {
    name: 'Office & Closet',
    icon: '💻',
    pos: { x: -3.4, y: 4.2, z: 1.2 },
    target: { x: -3.4, y: 0.8, z: 4.8 },
  },
  patio: {
    name: 'West Patio',
    icon: '🌿',
    pos: { x: -12.5, y: 5.5, z: 4.2 },
    target: { x: -7.7, y: 0.6, z: -1.0 },
  },
  porch: {
    name: 'Front Veranda',
    icon: '🚪',
    pos: { x: 11.2, y: 5.2, z: 8.8 },
    target: { x: 6.7, y: 0.8, z: 3.8 },
  },
  fps: {
    name: 'Walkthrough FPS',
    icon: '🚶',
  },
};

// 7. SETUP POST-PROCESSING PIPELINE
const { composer, resize: resizePost } = createPostProcessing(renderer, scene, camera);

// 8. SETUP USER INTERFACE
setupUI({
  controller,
  house,
  dimLabels,
  cameraPresets,
  renderer,
  scene,
  camera,
});

// 9. RESIZE HANDLER
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  resizePost(w, h);
});

// 10. ANIMATION LOOP
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  controller.update(delta);

  if (!controller.isFPSMode && !controller.isAnimatingCamera) {
    controls.update();
  }

  // Render through cinematic post-processing pipeline
  composer.render();
}

animate();
