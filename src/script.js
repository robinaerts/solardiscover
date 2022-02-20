import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const canvas = document.querySelector("canvas.webgl");
const loading = document.querySelector(".loading");
const loadingBar = document.querySelector(".loading-bar");

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {
  loading.style.display = "flex";
  console.log("started");
};

loadingManager.onProgress = (item, loaded, total) => {
  const percentage = `${(loaded / total) * 100}%`;
  loadingBar.style.transform = `scaleX(${percentage})`;
};

loadingManager.onLoad = () => {
  loading.style.display = "none";
};

const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const jupiterTexture = textureLoader.load("/textures/2k_jupiter.jpg");
const saturnTexture = textureLoader.load("/textures/2k_saturn.jpg");
const uranusTexture = textureLoader.load("/textures/2k_uranus.jpg");
const neptuneTexture = textureLoader.load("/textures/2k_neptune.jpg");

const starTexture = textureLoader.load("/textures/2k_stars.jpg");

// Scene
const scene = new THREE.Scene();
scene.background = starTexture;

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const cameraGroup = new THREE.Group();

const camera = new THREE.PerspectiveCamera(
  20,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.set(28.5, 5, 145.5);
scene.add(cameraGroup);
cameraGroup.add(camera);

let scroll;
const moveCamera = gsap.to(camera.position, {
  x: 50,
  y: 50,
  paused: true,
  duration: 50,
});

window.addEventListener("scroll", () => {
  scroll = window.scrollY / sizes.height;
  if (scroll > 0.8) {
    moveCamera.progress(scroll / 0.8);
    console.log(moveCamera.progress());
  }
});

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Stars

// const starCount = 2000;
// const starPositions = new Float32Array(starCount * 3);
// const starGeometry = new THREE.BufferGeometry();

// for (let i = 0; i < starCount; i++) {
//   starPositions[i] = (Math.random() - 0.5) * 1000;
//   starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
//   starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
// }

// starGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(starPositions, 3)
// );

// const stars = new THREE.Points(
//   starGeometry,
//   new THREE.PointsMaterial({ color: 0xffffff })
// );

// scene.add(stars);

// Planets

const divideRadiusBy = 15000;

const planetRadius = {
  sun: 696350 / divideRadiusBy,
  mercury: (2 * 2439.7) / divideRadiusBy,
  venus: (2 * 6052) / divideRadiusBy,
  earth: (2 * 6371) / divideRadiusBy,
  mars: (2 * 3389.5) / divideRadiusBy,
  jupiter: 69910 / divideRadiusBy,
  saturn: 58230 / divideRadiusBy,
  uranus: 25362 / divideRadiusBy,
  neptune: 24622 / divideRadiusBy,
};

const distanceFromSun = {
  sun: -planetRadius.sun,
  mercury: (57.91 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  venus: (108.2 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  earth: (149.6 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  mars: (227.9 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  jupiter: (778.5 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  saturn: (1.434 * Math.pow(10, 9)) / divideRadiusBy / 3000,
  uranus: (2.871 * Math.pow(10, 9)) / divideRadiusBy / 3000,
  neptune: (4.495 * Math.pow(10, 9)) / divideRadiusBy / 3000,
};

const sun = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.sun, 32, 32),
  new THREE.MeshStandardMaterial({ map: sunTexture })
);

const mercury = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.mercury, 32, 32),
  new THREE.MeshStandardMaterial({ map: mercuryTexture })
);

const venus = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.venus, 32, 32),
  new THREE.MeshStandardMaterial({ map: venusTexture })
);

const earth = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.earth, 32, 32),
  new THREE.MeshStandardMaterial({ map: earthTexture })
);

const mars = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.mars, 32, 32),
  new THREE.MeshStandardMaterial({ map: marsTexture })
);

const jupiter = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.jupiter, 32, 32),
  new THREE.MeshStandardMaterial({ map: jupiterTexture })
);
const saturn = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.saturn, 32, 32),
  new THREE.MeshStandardMaterial({ map: saturnTexture })
);
const uranus = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.uranus, 32, 32),
  new THREE.MeshStandardMaterial({ map: uranusTexture })
);
const neptune = new THREE.Mesh(
  new THREE.SphereBufferGeometry(planetRadius.neptune, 32, 32),
  new THREE.MeshStandardMaterial({ map: neptuneTexture })
);

sun.position.x = distanceFromSun.sun;
mercury.position.x = 10;
venus.position.x = 10 * 2;
earth.position.x = 10 * 3;
mars.position.x = 10 * 4;
jupiter.position.x = 10 * 5;
saturn.position.x = 10 * 6;
uranus.position.x = 10 * 7;
neptune.position.x = 10 * 8;

scene.add(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);

pointLight.position.x = -planetRadius.sun;
scene.add(pointLight);
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  // Update Camera

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 15 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 15 * deltaTime;

  // controls.update(); // Update controls

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
