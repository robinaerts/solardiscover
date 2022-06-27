import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

const gui = new dat.GUI();
const cameraDebug = gui.addFolder("Camera");

// DOM ELEMENTS
const canvas = document.querySelector("canvas.webgl");
const loading = document.querySelector(".loading");
const loadingBar = document.querySelector(".loading-bar");
const innerCursor = document.querySelector(".cursor-inner");
const outerCursor = document.querySelector(".cursor-outer");
const hoverItems = document.getElementsByClassName("hover-text");

const domRotatingPlanets = document.querySelector("#rotating-planets-text");
const domGroupPlanets = document.querySelector("#group-planets");

const terrPlanets = document.querySelector("#terr-planets");
const gasGiants = document.querySelector("#gas-giants");
const iceGiants = document.querySelector("#ice-giants");

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

// Custom Cursor

for (const item of hoverItems) {
  item.onmouseover = () => {
    innerCursor.style.opacity = "0";
    outerCursor.style.background = "white";
    outerCursor.style.width = "90px";
    outerCursor.style.height = "90px";
    outerCursor.style.mixBlendMode = "difference";
  };
  item.onmouseleave = () => {
    innerCursor.style.opacity = "100%";
    outerCursor.style.background = "none";
    outerCursor.style.width = "50px";
    outerCursor.style.height = "50px";
    outerCursor.style.mixBlendMode = "normal";
  };
}

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;

  // Custom Cursor
  innerCursor.style.top = e.clientY + "px";
  innerCursor.style.left = e.clientX + "px";

  outerCursor.style.top = e.clientY + "px";
  outerCursor.style.left = e.clientX + "px";
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

const startX = 28.5;
const startY = 5;
const startZ = 145.5;

cameraDebug.add(camera.position, "x").min(-100).max(100).step(1);
cameraDebug.add(camera.position, "y").min(-100).max(100).step(1);
cameraDebug.add(camera.position, "z").min(-100).max(1000).step(1);
cameraDebug.add(camera.rotation, "x").min(-2000).max(2000).step(0.01);
cameraDebug.add(camera.rotation, "y").min(-2000).max(2000).step(0.01);
cameraDebug.add(camera.rotation, "z").min(-2000).max(2000).step(0.01);

camera.position.set(startX, startY, startZ);
scene.add(cameraGroup);
cameraGroup.add(camera);

let scroll;

window.addEventListener("scroll", () => {
  scroll = window.scrollY / sizes.height;
  if (scroll < 1) {
    camera.position.z = startZ + scroll * 500;
    camera.position.x = startX - scroll * 500;
    camera.position.y = startY + scroll * 500;
    camera.lookAt(originalEarthPosition);
  }
  if (scroll < 1.5) {
    if (scroll > 1) {
      camera.position.z = startZ + 1 * 500;
      camera.position.x = startX - 1 * 500;
      camera.position.y = startY + 1 * 500;
      camera.lookAt(originalEarthPosition);
    }
    orbitPlanetsAroundSun(scroll);
  }
  if (Math.round(scroll - 0.5) === 1) {
    camera.position.x = startX;
    camera.position.y = startY;
    camera.position.z = startZ;
    orbitPlanetsAroundSun(0);
    camera.lookAt(originalEarthPosition);
  }

  if (scroll > 3.5 && scroll < 4.9) {
    const sectionScroll = scroll - 3.5;
    camera.position.z = startZ - sectionScroll * 100;
    camera.position.y = startY - sectionScroll * 3.3;
    camera.position.x = startX - sectionScroll * 13;
  }

  if (scroll > 1.9 && scroll < 3.5) {
    terrPlanets.style.opacity = (scroll - 1.9) * 80 + "%";
    gasGiants.style.opacity = (scroll - 1.9) * 80 + "%";
    iceGiants.style.opacity = (scroll - 1.9) * 80 + "%";
    domGroupPlanets.style.position = "fixed";
  } else {
    domGroupPlanets.style.position = "relative";
    terrPlanets.style.opacity = 0 + "%";
    gasGiants.style.opacity = 0 + "%";
    iceGiants.style.opacity = 0 + "%";
    // terrPlanets.style.display = "none";
    // gasGiants.style.display = "none";
    // iceGiants.style.display = "none";
  }
  console.log(scroll);
});

const orbitPlanetsAroundSun = (rotationScroll) => {
  mercuryParent.rotation.y = ((rotationScroll * 8) / 2) * Math.PI;
  venusParent.rotation.y = ((rotationScroll * 7) / 2) * Math.PI;
  earthParent.rotation.y = ((rotationScroll * 6) / 2) * Math.PI;
  marsParent.rotation.y = ((rotationScroll * 5) / 2) * Math.PI;
  jupiterParent.rotation.y = ((rotationScroll * 4) / 2) * Math.PI;
  saturnParent.rotation.y = ((rotationScroll * 3) / 2) * Math.PI;
  uranusParent.rotation.y = ((rotationScroll * 2) / 2) * Math.PI;
  neptuneParent.rotation.y = ((rotationScroll * 1) / 2) * Math.PI;
};

terrPlanets.onmouseover = () => {
  gasGiants.style.visibility = "hidden";
  iceGiants.style.visibility = "hidden";
};

terrPlanets.onmouseleave = () => {
  gasGiants.style.visibility = "visible";
  iceGiants.style.visibility = "visible";
};
gasGiants.onmouseover = () => {
  terrPlanets.style.visibility = "hidden";
  iceGiants.style.visibility = "hidden";
};

gasGiants.onmouseleave = () => {
  terrPlanets.style.visibility = "visible";
  iceGiants.style.visibility = "visible";
};
iceGiants.onmouseover = () => {
  gasGiants.style.visibility = "hidden";
  terrPlanets.style.visibility = "hidden";
};

iceGiants.onmouseleave = () => {
  gasGiants.style.visibility = "visible";
  terrPlanets.style.visibility = "visible";
};

// const axesHelper = new THREE.AxesHelper(200, 200);
// scene.add(axesHelper);

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
  mercury: planetRadius.sun + (57.91 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  venus: planetRadius.sun + (108.2 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  earth: planetRadius.sun + (149.6 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  mars: planetRadius.sun + (227.9 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  jupiter: planetRadius.sun + (778.5 * Math.pow(10, 6)) / divideRadiusBy / 3000,
  saturn: planetRadius.sun + (1.434 * Math.pow(10, 9)) / divideRadiusBy / 3000,
  uranus: planetRadius.sun + (2.871 * Math.pow(10, 9)) / divideRadiusBy / 3000,
  neptune: planetRadius.sun + (4.495 * Math.pow(10, 9)) / divideRadiusBy / 3000,
};

const mercuryParent = new THREE.Object3D();
const venusParent = new THREE.Object3D();
const earthParent = new THREE.Object3D();
const marsParent = new THREE.Object3D();
const jupiterParent = new THREE.Object3D();
const saturnParent = new THREE.Object3D();
const uranusParent = new THREE.Object3D();
const neptuneParent = new THREE.Object3D();

mercuryParent.position.x = distanceFromSun.sun;
venusParent.position.x = distanceFromSun.sun;
earthParent.position.x = distanceFromSun.sun;
marsParent.position.x = distanceFromSun.sun;
jupiterParent.position.x = distanceFromSun.sun;
saturnParent.position.x = distanceFromSun.sun;
uranusParent.position.x = distanceFromSun.sun;
neptuneParent.position.x = distanceFromSun.sun;

scene.add(
  mercuryParent,
  venusParent,
  earthParent,
  marsParent,
  jupiterParent,
  saturnParent,
  uranusParent,
  neptuneParent
);

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
mercury.position.x = 10 + planetRadius.sun;
venus.position.x = 10 * 2 + planetRadius.sun;
earth.position.x = 10 * 3 + planetRadius.sun;
mars.position.x = 10 * 4 + planetRadius.sun;
jupiter.position.x = 10 * 5 + planetRadius.sun;
saturn.position.x = 10 * 6 + planetRadius.sun;
uranus.position.x = 10 * 7 + planetRadius.sun;
neptune.position.x = 10 * 8 + planetRadius.sun;

const originalEarthPosition = new THREE.Vector3(planetRadius.sun - 20, 0, 0);

mercuryParent.add(mercury);
venusParent.add(venus);
earthParent.add(earth);
marsParent.add(mars);
jupiterParent.add(jupiter);
saturnParent.add(saturn);
uranusParent.add(uranus);
neptuneParent.add(neptune);

scene.add(sun);

camera.lookAt(originalEarthPosition);

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

  //
  sun.rotation.y = elapsedTime / 15;
  mercury.rotation.y = elapsedTime / 5;
  mars.rotation.y = elapsedTime / 5;
  earth.rotation.y = elapsedTime / 5;
  venus.rotation.y = elapsedTime / 5;
  jupiter.rotation.y = elapsedTime / 5;
  uranus.rotation.y = elapsedTime / 5;
  neptune.rotation.y = elapsedTime / 5;
  saturn.rotation.y = elapsedTime / 5;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
