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


//saturn Object and the textures
const saturn_texture = new THREE.TextureLoader().load('saturn_texture.jpg');

const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(18,24,24),
  new THREE.MeshStandardMaterial({
    map: saturn_texture,
  } )
);

let saturnCenter = new THREE.Vector3(20, 0, -30)
saturn.position.set(saturnCenter.x, saturnCenter.y, saturnCenter.z)
saturn.rotation.x = .3;
saturn.rotation.z = .3;

scene.add(saturn);


//ring object for the giggles
const ring = new THREE.Mesh(
  new THREE.RingGeometry(24,36,30),
  new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    side: THREE.DoubleSide 
} )
)

ring.position.set(saturnCenter.x, saturnCenter.y, saturnCenter.z)
ring.rotation.x = 1.75;
ring.rotation.y = .3;

scene.add(ring)

//Lighting objects
const ambientLight = new THREE.AmbientLight(0xcccccc);

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(16,0,5)

scene.add(ambientLight, pointLight)

//adding background to look as if we are in space
const spaceTexture = new THREE.TextureLoader().load('Ultra-Wide.jpg');
scene.background = spaceTexture

//Adding orbit info for orbital movement
let radius = 38;
let angle = 0;
let orbitSpeed = .01;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  saturn.position.y = -10 + 0.02 * t

  ring.position.y = -10 + 0.02 * t

  //Change camera position on scroll, +15 added to be further from origin of coordinates
  camera.position.y = t * 0.02 + 1;
  pointLight.position.y = t * 0.02 + 1;
  camera.lookAt()
}

document.body.onscroll = moveCamera

//This animates over time, reccursive function
function animate() {
  requestAnimationFrame( animate );

  angle += orbitSpeed
  ring.position.x = saturnCenter.x - radius * Math.cos(angle)
  ring.position.z = saturnCenter.z - radius * Math.sin(angle)


  saturn.position.x = saturnCenter.x - radius * Math.cos(angle)
  saturn.position.z = saturnCenter.z - radius * Math.sin(angle)
  saturn.rotation.y += orbitSpeed

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
