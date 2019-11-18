import * as THREE from 'three';
import * as dat from 'dat.gui';
import OrbitControls from 'three-orbitcontrols';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

let scene, camera, renderer, controls;
let stars =[];
let planets =[];
let colors = [0x89b8e8, 0x3250a8, 0xccb116, 0xd9910d];
let starColors = [0x5e2eab, 0x14353b, 0x573d3d];

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x59615b);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  controls = new OrbitControls(camera, renderer.domElement);

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild( renderer.domElement );  

  camera.position.set(0.0, 0.0, 150);
  controls.update();

  // HemiLight
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f0e0d, 2);
  // scene.add(hemiLight);
  
  // Create stars and planets
  createStars(30);
  createPlanets(300);
  //Create mirrors 
  mirror(200, "back");
  mirror(200, "front");
  mirror(200, "bottom");
  mirror(200, "top");
  mirror(200, "left");
  mirror(200, "right");

  wall(200, "back");
  wall(200, "front");
  wall(200, "bottom");
  wall(200, "top");
  wall(200, "left");
  wall(200, "right");
}

// Create one star
 function createStars(n) {
  for (let i=0; i<n; i++) {
    let bulbGeometry = new THREE.IcosahedronBufferGeometry(Math.random()*0.5);
    let theColor = starColors[Math.floor(Math.random()*colors.length)];
    let bulbMaterial = new THREE.MeshStandardMaterial({
      color: theColor
    });
    let bulbLight = new THREE.PointLight(theColor, 1, 200, 2);
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
    let geometry = new THREE.OctahedronBufferGeometry(Math.random()* 2);
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
    mirror.position.set(0, 0, -width/2 + 0.1);
  } else if (side === "front") {
    mirror.position.set(0,0, width/2 - 0.1);
    mirror.rotateX(Math.PI);
  } else if (side === "top") {
    mirror.position.set(0, width/2 - 0.1 , 0);
    mirror.rotateX(Math.PI/2);
  } else if (side === "bottom") {
    mirror.position.set(0, -width/2 + 0.1, 0);
    mirror.rotateX(-Math.PI/2);
  } else if (side === "left") {
    mirror.position.set(-width/2 + 0.1, 0, 0);
    mirror.rotateY(Math.PI/2);
  } else if (side === "right") {
    mirror.position.set(width/2 - 0.1, 0, 0);
    mirror.rotateY(-Math.PI/2);
  }
  scene.add(mirror);
}

// Walls behind mirrors
function wall(width, side) {
  let geometry = new THREE.PlaneGeometry(width, width);
  let wall = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x292b29}));
  if (side === "back") {
    wall.position.set(0, 0, -width/2);
  } else if (side === "front") {
    wall.position.set(0,0, width/2);
    wall.rotateX(Math.PI);
  } else if (side === "top") {
    wall.position.set(0, width/2, 0);
    wall.rotateX(Math.PI/2);
  } else if (side === "bottom") {
    wall.position.set(0, -width/2, 0);
    wall.rotateX(-Math.PI/2);
  } else if (side === "left") {
    wall.position.set(-width/2, 0, 0);
    wall.rotateY(Math.PI/2);
  } else if (side === "right") {
    wall.position.set(width/2, 0, 0);
    wall.rotateY(-Math.PI/2);
  }
  scene.add(wall);
}

function update() {
  stars.map(star => {
    star.rotation.x += Math.random() * 0.3;
    star.rotation.y += Math.random() * 0.5;
  });
  planets.map(planet=> {
    planet.rotation.x += Math.random() * 0.4;
    planet.rotation.y += Math.random() * 0.5;
    planet.rotation.z += Math.random() * 0.3;
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


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initGUI() {
  let settings = {
    starColor: {
      Star1: "#5e2eab",
      Star2: "#14353b",
      Star3: "#573d3d"
    }
  };
  let gui = new dat.GUI();
  let starFolder = gui.addFolder('Star Colors');
  let star1Controller = starFolder.addColor(settings.starColor, 'Star1');
  let star2Controller = starFolder.addColor(settings.starColor, 'Star2');
  let star3Controller = starFolder.addColor(settings.starColor, 'Star3');
  
  star1Controller.onChange((value) => {
    value = value.replace('#', '0x');
    starColors[0] = parseInt(value);
    createStars(stars.length);
  });
  star2Controller.onChange((value) => {
    value = value.replace('#', '0x');
    starColors[1] = parseInt(value);
    createStars(stars.length);
  });
  star3Controller.onChange((value) => {
    value = value.replace('#', '0x');
    starColors[2] = parseInt(value);
    createStars(stars.length);
  });
}
init();
animate();
initGUI();
window.addEventListener('resize', onWindowResize);