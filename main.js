import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

// basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xffffff));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// loader
const loader = new GLTFLoader();
let capy;
loader.load(
    '/capybara.glb',
    function (gltf) {
        capy = gltf.scene;
        capy.scale.set(2, 2, 2);
        scene.add(capy);

        camera.position.set(12, 14, 16); 
        camera.lookAt(shiba.position); 
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

camera.position.z = 5;

// ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x659053, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2;
ground.position.y = -0.05;
scene.add(ground);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// jumping
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0 && intersects[0].object === capy) {
    const jumpHeight = 1.5;
    const jumpDuration = 0.4;
    gsap.to(capy.position, { y: jumpHeight, duration: jumpDuration, yoyo: true, repeat: 1, ease: "power1.inOut" });
  }
}
document.addEventListener('mousedown', onDocumentMouseDown, false);

animate();