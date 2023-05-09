import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//creating scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

//Creates renderer for the scene, also added change to overall gamma values in third line below
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE,THREE.sRGBEncoding;
camera.position.setZ(30);


//Earth Object and the textures
const earth_texture = new THREE.TextureLoader().load('earth_texture.jpg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(18,24,24),
  new THREE.MeshStandardMaterial({
    map: earth_texture,
  } )
);

let earthCenter = new THREE.Vector3(20, 0, -30)
earth.position.set(earthCenter.x, earthCenter.y, earthCenter.z)

scene.add(earth);


//Moon object for the giggles
const moon_texture = new THREE.TextureLoader().load('moon_texture.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4.5,24,24),
  new THREE.MeshStandardMaterial({
    map: moon_texture,
  } )
);

let radius = 38;
let angle = 0;
let orbitSpeed = .01;

scene.add(moon)

//Lighting objects
const ambientLight = new THREE.AmbientLight(0xcccccc);

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(16,0,5)

scene.add(ambientLight, pointLight)

//adding background to look as if we are in space
const spaceTexture = new THREE.TextureLoader().load('Ultra-Wide.jpg');
scene.background = spaceTexture

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  earth.position.y = -10 + 0.02 * t

  moon.position.y = -10 + 0.02 * t

  //Change camera position on scroll, +15 added to be further from origin of coordinates
  camera.position.y = t * 0.02 + 1;
  pointLight.position.y = t * 0.02 + 1;
  camera.lookAt()
}

document.body.onscroll = moveCamera

//This animates over time, reccursive function
function animate() {
  requestAnimationFrame( animate );

  earth.rotation.y += 0.01;
  moon.rotation.y += 0.01;
  angle += orbitSpeed

  moon.position.x = earthCenter.x - radius * Math.cos(angle)
  moon.position.z = earthCenter.z - radius * Math.sin(angle)

  renderer.render( scene, camera );
}

function figureEight( object, t ){

  object.position.y = 20 + .020 * t + .5 * Math.sin(.004 * t) / 2;
  object.position.x = 24 + Math.cos(.002 * t); 

 // object.position.y = 18+ .020 * t + .5 * Math.cos(.003 * t);
 // object.position.x = 22 + Math.sin(.003 * t); 
}

function spinMove( object, modifier){
  object.rotation.x += (0.0075 + .0075 * Math.random())* modifier;
  object.rotation.y += (0.0075 + .0075 * Math.random()) * modifier;
  object.rotation.z += (0.0075 + .0075 * Math.random()) * modifier;
}

animate();
