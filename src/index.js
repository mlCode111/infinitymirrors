import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color('lightblue');
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      var renderer = new THREE.WebGLRenderer();
      var controls = new OrbitControls(camera, renderer.domElement);

      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );  

      var geometry = new THREE.BoxGeometry(1,1,1);
      var material = new THREE.MeshStandardMaterial({color: 0x00ff00});
      var cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      camera.position.z = 5;
      controls.update();

      // Light bulb
      var bulbGeometry = new THREE.SphereBufferGeometry(0.15,16,32);
      var bulbMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xff0000,
        emissiveIntensity: 10,
        color: 0x00ff00
      });
      var bulbLight = new THREE.PointLight(0xff0000, 1, 100, 2);
      bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMaterial));
      bulbLight.position.set(0, 1.5, 0);
      bulbLight.castShadow = true;
      scene.add(bulbLight);

      // HemiLight
      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f0e0d, 0.8);
      scene.add(hemiLight);

      // Back mirror
      var geometry = new THREE.PlaneBufferGeometry(100, 100);
      var backMirror = new Reflector(geometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x777777,
        recursion: 1
      })
      backMirror.position.set(0, 0, -10);
      scene.add(backMirror);
      
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      animate();