import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

let scene, camera, renderer, controls, cube;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1e1e1e);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );

  renderer = new THREE.WebGLRenderer();
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild( renderer.domElement );  

  let geometry = new THREE.BoxGeometry(0.3,0.3,0.3);
  let material = new THREE.MeshStandardMaterial({color: 0xadd8e6});
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.set(-5.0, 0.0, 10);
  controls.update();

  // Light bulb
  let bulbGeometry = new THREE.SphereBufferGeometry(0.15,16,32);
  let bulbMaterial = new THREE.MeshStandardMaterial({
    emissive: 0x9B870C,
    emissiveIntensity: 10,
    color: 0x9B870C
  });
  let bulbLight = new THREE.PointLight(0x9B870C, 1, 100, 2);
  bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMaterial));
  bulbLight.position.set(0, 1.5, 0);
  bulbLight.castShadow = true;
  scene.add(bulbLight);

  // HemiLight
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f0e0d, 0.8);
  scene.add(hemiLight);

  mirror(20, "back");
  mirror(20, "front");
  mirror(20, "bottom");
  mirror(20, "top");
  mirror(20, "left");
  mirror(20, "right");
}


// Mirrors
function mirror(width, side) {
  let geometry = new THREE.PlaneBufferGeometry(width, width);
  let mirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777,
    recursion: 1
  })
  if (side === "back") {
    mirror.position.set(0, 0, -width/2);
  } else if (side === "front") {
    mirror.position.set(0,0, width/2);
    mirror.rotateX(Math.PI);
  } else if (side === "top") {
    mirror.position.set(0, width/2, 0);
    mirror.rotateX(Math.PI/2);
  } else if (side === "bottom") {
    mirror.position.set(0, -width/2, 0);
    mirror.rotateX(-Math.PI/2);
  } else if (side === "left") {
    mirror.position.set(-width/2, 0, 0);
    mirror.rotateY(Math.PI/2);
  } else if (side === "right") {
    mirror.position.set(width/2, 0, 0);
    mirror.rotateY(-Math.PI/2);
  }
  scene.add(mirror);
}



function animate() {
  requestAnimationFrame(animate);
  controls.update();
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

init();
animate();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  init();
  animate();
}
window.addEventListener('resize', onWindowResize);