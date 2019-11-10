import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e1e);
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );

var renderer = new THREE.WebGLRenderer();
var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );  

var geometry = new THREE.BoxGeometry(0.3,0.3,0.3);
var material = new THREE.MeshStandardMaterial({color: 0xadd8e6});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.set(-5.0, 0.0, 10);
controls.update();

// Light bulb
var bulbGeometry = new THREE.SphereBufferGeometry(0.15,16,32);
var bulbMaterial = new THREE.MeshStandardMaterial({
  emissive: 0x9B870C,
  emissiveIntensity: 10,
  color: 0x9B870C
});
var bulbLight = new THREE.PointLight(0x9B870C, 1, 100, 2);
bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMaterial));
bulbLight.position.set(0, 1.5, 0);
bulbLight.castShadow = true;
scene.add(bulbLight);

// HemiLight
var hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f0e0d, 0.8);
scene.add(hemiLight);

// Mirrors
function mirror(width, side) {
  var geometry = new THREE.PlaneBufferGeometry(width, width);
  var mirror = new Reflector(geometry, {
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

mirror(20, "back");
mirror(20, "front");
mirror(20, "bottom");
mirror(20, "top");
mirror(20, "left");
mirror(20, "right");

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();