<template>
  <div ref="canvasHost" class="butterfly-model" aria-hidden="true"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import butterflyModel from '../assets/models/ulysses_butterfly.glb?url';

const canvasHost = ref(null);
let renderer;
let scene;
let camera;
let butterfly;
let mixer;
let clock;
let visualModel;
let modelBasePosition;
let animationFrame;
let resizeObserver;
let modelUnitSize = 1;

let currentPoint = { x: 0, y: 0 };
let currentScale = 1;
let currentOpacity = 1;
let currentRotX = 0;
let currentRotY = 0;
let currentRotZ = 0;

const degToRad = (deg) => (deg * Math.PI) / 180;

// Los 4 ángulos de rotación para cada paso del scroll
const STEP_ANGLES = [
  degToRad(80),   // Paso 1: 80°
  degToRad(100),  // Paso 2: 100°
  degToRad(-180), // Paso 3: -180°
  degToRad(-80)   // Paso 4: -80°
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const mix = (from, to, progress) => from + (to - from) * progress;

// Interpolación cúbica suave (Hermite / Smoothstep)
const smoothMix = (from, to, t) => {
  const st = t * t * (3 - 2 * t);
  return from + (to - from) * st;
};

// Interpolación Catmull-Rom para curvas 100% continuas y sin mini saltos
const catmullRom = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
};

const keepInViewport = (point) => {
  const isMobile = window.innerWidth < 768;
  const safeEdgeX = isMobile ? 35 : 70;
  const safeEdgeY = isMobile ? 50 : 70;
  return {
    x: clamp(point.x, safeEdgeX, window.innerWidth - safeEdgeX),
    y: clamp(point.y, safeEdgeY, window.innerHeight - safeEdgeY)
  };
};

const getJourneyTarget = () => {
  const isMobile = window.innerWidth < 768;
  const startScaleSize = isMobile ? 32 : 46;
  const fullScaleSize = isMobile ? 150 : 225;

  const startEl = document.querySelector('.mariposa-ancla');
  const reservationEl = document.querySelector('.reservation-journey');
  const titleEl = document.querySelector('.reservation-journey__header');
  const slides = [...document.querySelectorAll('.reservation-slide')].slice(0, 4);

  if (!startEl || !reservationEl || slides.length < 4) {
    return {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      scale: (startScaleSize / modelUnitSize),
      opacity: 1,
      rotX: 0,
      rotY: 0,
      rotZ: 0
    };
  }

  const startBounds = startEl.getBoundingClientRect();
  const startPoint = {
    x: startBounds.left + startBounds.width * 0.5,
    y: startBounds.top + startBounds.height * 0.45
  };

  const scrollY = window.scrollY;

  // 1. INICIO: Quieta perfectamente sobre la letra 's'
  if (scrollY <= 2) {
    return {
      x: startPoint.x,
      y: startPoint.y,
      scale: startScaleSize / modelUnitSize,
      opacity: 1,
      rotX: 0.04,
      rotY: 0,
      rotZ: 0
    };
  }

  // Puntos del recorrido:
  // P0: Inicio ('s')
  // P1: Título de reservas (centro)
  // P2: Paso 1 (IZQUIERDA de la tarjeta 01)
  // P3: Paso 2 (DERECHA de la tarjeta 02)
  // P4: Paso 3 (IZQUIERDA de la tarjeta 03)
  // P5: Paso 4 (DERECHA de la tarjeta 04)

  const titleBounds = titleEl ? titleEl.getBoundingClientRect() : null;
  const p1 = titleBounds
    ? { x: titleBounds.left + titleBounds.width * 0.46, y: titleBounds.top + titleBounds.height * 0.5 }
    : { x: window.innerWidth * 0.48, y: window.innerHeight * 0.25 };

  const getCardBounds = (idx) => {
    const card = slides[idx].querySelector('.reservation-slide__card') || slides[idx];
    return card.getBoundingClientRect();
  };

  const b0 = getCardBounds(0);
  const p2 = {
    x: isMobile ? window.innerWidth * 0.18 : b0.left - 75,
    y: b0.top + b0.height * 0.35
  };

  const b1 = getCardBounds(1);
  const p3 = {
    x: isMobile ? window.innerWidth * 0.82 : b1.right + 75,
    y: b1.top + b1.height * 0.35
  };

  const b2 = getCardBounds(2);
  const p4 = {
    x: isMobile ? window.innerWidth * 0.18 : b2.left - 75,
    y: b2.top + b2.height * 0.35
  };

  const b3 = getCardBounds(3);
  const p5 = {
    x: isMobile ? window.innerWidth * 0.84 : b3.right + 80,
    y: b3.top + b3.height * 0.45
  };

  const resRect = reservationEl.getBoundingClientRect();
  const resTopDoc = resRect.top + scrollY;
  const heroEndScroll = Math.max(1, resTopDoc - window.innerHeight * 0.45);

  const slideTops = slides.map((s) => s.getBoundingClientRect().top + scrollY);
  const slideEndScroll = slideTops[3] + slides[3].offsetHeight * 0.35;

  // Si se supera el final del 4to paso, desvanecer y ocultar la mariposa suavemente
  let targetOpacity = 1;
  let targetScale = fullScaleSize / modelUnitSize;
  if (scrollY > slideEndScroll) {
    const fadeDistance = Math.max(1, window.innerHeight * 0.22);
    const exitProgress = clamp((scrollY - slideEndScroll) / fadeDistance, 0, 1);
    targetOpacity = 1 - exitProgress;
    targetScale = mix(fullScaleSize / modelUnitSize, 0, exitProgress);
  }

  // Trayecto 1: De la 's' (P0) pasando por el título (P1) hacia el Paso 1 (P2)
  if (scrollY < heroEndScroll) {
    const p = clamp(scrollY / heroEndScroll, 0, 1);
    const introScale = mix(startScaleSize, fullScaleSize, p) / modelUnitSize;
    const targetRotY = smoothMix(0, STEP_ANGLES[0], p);

    const cp0 = { x: startPoint.x + 30, y: startPoint.y - 40 };
    const ptX = catmullRom(cp0.x, startPoint.x, p1.x, p2.x, p);
    const ptY = catmullRom(cp0.y, startPoint.y, p1.y, p2.y, p);

    return {
      ...keepInViewport({ x: ptX, y: ptY }),
      scale: introScale,
      opacity: 1,
      rotX: 0.04,
      rotY: targetRotY,
      rotZ: 0
    };
  }

  // Trayecto 2: S-curve a través de los 4 pasos (Paso 1 Izq -> Paso 2 Der -> Paso 3 Izq -> Paso 4 Der)
  const trackProgress = clamp((scrollY - heroEndScroll) / Math.max(1, slideEndScroll - heroEndScroll), 0, 1);
  const stage = trackProgress * 3; // de 0 a 3 continuo
  const currentIdx = Math.min(2, Math.floor(stage));
  const nextIdx = currentIdx + 1;
  const frac = stage - currentIdx;

  const fromAngle = STEP_ANGLES[currentIdx];
  const toAngle = STEP_ANGLES[nextIdx];
  const targetRotY = smoothMix(fromAngle, toAngle, frac);

  const waypoints = [p2, p3, p4, p5];
  const wp0 = waypoints[Math.max(0, currentIdx - 1)];
  const wp1 = waypoints[currentIdx];
  const wp2 = waypoints[nextIdx];
  const wp3 = waypoints[Math.min(waypoints.length - 1, nextIdx + 1)];

  const ptX = catmullRom(wp0.x, wp1.x, wp2.x, wp3.x, frac);
  const ptY = catmullRom(wp0.y, wp1.y, wp2.y, wp3.y, frac);

  return {
    ...keepInViewport({ x: ptX, y: ptY }),
    scale: targetScale,
    opacity: targetOpacity,
    rotX: 0.04,
    rotY: targetRotY,
    rotZ: 0
  };
};

const animate = () => {
  const target = getJourneyTarget();
  if (target && butterfly) {
    currentPoint.x += (target.x - currentPoint.x) * 0.1;
    currentPoint.y += (target.y - currentPoint.y) * 0.1;
    currentScale += (target.scale - currentScale) * 0.1;
    currentOpacity += (target.opacity - currentOpacity) * 0.12;
    currentRotY += (target.rotY - currentRotY) * 0.08;
    currentRotX += (target.rotX - currentRotX) * 0.08;
    currentRotZ += (target.rotZ - currentRotZ) * 0.08;

    if (canvasHost.value) {
      canvasHost.value.style.opacity = Math.max(0, currentOpacity).toFixed(3);
      canvasHost.value.style.visibility = currentOpacity <= 0.01 ? 'hidden' : 'visible';
    }

    butterfly.position.set(
      currentPoint.x - window.innerWidth / 2,
      window.innerHeight / 2 - currentPoint.y,
      0
    );
    butterfly.rotation.set(currentRotX, currentRotY, currentRotZ);
    butterfly.scale.setScalar(Math.max(0.001, currentScale));
  }

  mixer?.update(clock.getDelta());
  visualModel?.position.copy(modelBasePosition);
  renderer.render(scene, camera);
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  const host = canvasHost.value;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera();
  camera.position.z = 500;
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x55736b, 2.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(240, 320, 500);
  scene.add(keyLight);

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.near = -1000;
    camera.far = 1000;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  new GLTFLoader().load(butterflyModel, (gltf) => {
    butterfly = new THREE.Group();
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    modelUnitSize = Math.max(size.x, size.y, size.z) || 1;

    model.rotation.set(0.08, -0.5, 0.04);
    const normalizedCenter = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
    model.position.sub(normalizedCenter);
    visualModel = model;
    modelBasePosition = model.position.clone();
    butterfly.add(model);
    scene.add(butterfly);

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }

    const initTarget = getJourneyTarget();
    currentPoint = { x: initTarget.x, y: initTarget.y };
    currentScale = initTarget.scale;
    currentOpacity = initTarget.opacity;
    currentRotX = initTarget.rotX;
    currentRotY = initTarget.rotY;
    currentRotZ = initTarget.rotZ;

    butterfly.position.set(
      currentPoint.x - window.innerWidth / 2,
      window.innerHeight / 2 - currentPoint.y,
      0
    );
    butterfly.rotation.set(currentRotX, currentRotY, currentRotZ);
    butterfly.scale.setScalar(currentScale);

    clock = new THREE.Clock();
    animate();
  });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  renderer?.dispose();
});
</script>

<style scoped>
.butterfly-model {
  inset: 0;
  overflow: visible;
  pointer-events: none;
  position: fixed;
  z-index: 20;
  transition: opacity 0.2s ease;
}

.butterfly-model :deep(canvas) {
  display: block;
  height: 100%;
  width: 100%;
}
</style>