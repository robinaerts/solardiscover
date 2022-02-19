import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");

const textureLoader = new THREE.TextureLoader();

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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 5;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Planets

const divideRadiusBy = 15000;

const planetRadius = {
  sun: 696350 / divideRadiusBy,
  mercury: 2439.7 / divideRadiusBy,
  venus: 6052 / divideRadiusBy,
  earth: 6371 / divideRadiusBy,
  mars: 3389.5 / divideRadiusBy,
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
mercury.position.x = distanceFromSun.mercury;
venus.position.x = distanceFromSun.venus;
earth.position.x = distanceFromSun.earth;
mars.position.x = distanceFromSun.mars;
jupiter.position.x = distanceFromSun.jupiter;
saturn.position.x = distanceFromSun.saturn;
uranus.position.x = distanceFromSun.uranus;
neptune.position.x = distanceFromSun.neptune;

scene.add(sun, mercury, venus, earth, mars, jupiter, saturn, uranus);

const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
