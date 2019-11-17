import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

let scene, camera, renderer, controls;
let stars =[];
let planets =[];
let colors = [0x89b8e8, 0x3250a8, 0xccb116, 0xd9910d]

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x59615b);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  controls = new OrbitControls(camera, renderer.domElement);

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild( renderer.domElement );  

  camera.position.set(0.0, 0.0, 150);
  controls.update();

  // HemiLight
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f0e0d, 4);
  scene.add(hemiLight);
  
  // Create stars and planets
  createStars(50);
  createPlanets(300);
  //Create mirrors 
  mirror(200, "back");
  mirror(200, "front");
  mirror(200, "bottom");
  mirror(200, "top");
  mirror(200, "left");
  mirror(200, "right");
}

// Create one star
 function createStars(n) {
  for (let i=0; i<n; i++) {
    let bulbGeometry = new THREE.IcosahedronBufferGeometry(Math.random()*3);
    let theColor = colors[Math.floor(Math.random()*colors.length)];
    let bulbMaterial = new THREE.MeshStandardMaterial({
      emissive: theColor,
      emissiveIntensity: 0.7,
      color: theColor
    });
    let bulbLight = new THREE.PointLight(theColor, 0.4, 5, 2);
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMaterial));
    bulbLight.castShadow = true;
    scene.add(bulbLight);
    stars.push(bulbLight);
    let x = Math.random()*200 - 100;
    let y = Math.random()*200 - 100;
    let z = Math.random()*200 - 100;
    bulbLight.position.set(x, y, z);
  }
 } 

//  Create one planet
function createPlanets(n) {
  for (let i=0; i<n; i++) {
    let geometry = new THREE.OctahedronBufferGeometry(Math.random()* 1);
    let theColor = colors[Math.floor(Math.random()*colors.length)];
    let material = new THREE.MeshStandardMaterial({color: theColor});
    let octahedron = new THREE.Mesh(geometry, material);
    scene.add(octahedron);
    planets.push(octahedron);
    let x = Math.random()*200 - 100;
    let y = Math.random()*200 - 100;
    let z = Math.random()*200 - 100;
    octahedron.position.set(x, y, z);
  }
}
  
// Mirrors
function mirror(width, side) {
  let geometry = new THREE.PlaneBufferGeometry(width, width);
  let mirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x5d5d5d,
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

function update() {
  stars.map(star => {
    star.rotation.x += Math.random() * 0.1;
    star.rotation.y += Math.random() * 0.1;
  });
  planets.map(planet=> {
    planet.rotation.x += Math.random() * 0.1;
    planet.rotation.y += Math.random() * 0.2;
  })  
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  renderer.setAnimationLoop(() => {
    update();
    controls.update();
    render();
  });
}

init();
animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);