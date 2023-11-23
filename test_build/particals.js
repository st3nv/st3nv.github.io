import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;
let object;

const particlesCount = 1000;
let particles;

const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    color: 0x50e0ff, transparent: true, opacity: 0.8
});

init();
// animate();

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20);
    camera.position.z = 2.5;

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 15);
    camera.add(pointLight);
    scene.add(camera);


    const loader = new OBJLoader();
    loader.load('3d/Formula 1 mesh.obj', function (obj) {
        object = obj;
        object.position.y = -0.25;
        object.scale.setScalar(0.004);
        scene.add(object);
        generate_particles(object);
        render();
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.addEventListener( 'change', render );

    window.addEventListener('resize', onWindowResize);
}


function generate_particles(object) {
    // const particlesPositions = new Float32Array(particlesCount * 3);
    // for (let i = 0; i < particlesCount; i++) {
    //     // randomly generate a point in the space around the object
    //     const theta = Math.random() * Math.PI * 2;
    //     const phi = Math.random() * Math.PI * 2;
    //     const radius = 1;
    //     const x = radius * Math.cos(theta) * Math.sin(phi);
    //     const y = radius * Math.sin(theta) * Math.sin(phi);
    //     const z = radius * Math.cos(phi);
    //     particlesPositions[i * 3] = x;
    //     particlesPositions[i * 3 + 1] = y;
    //     particlesPositions[i * 3 + 2] = z;
    // }
    // particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    // particles = new THREE.Points(particlesGeometry, particlesMaterial);
    // scene.add(particles);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    // Rotate the particles around the Y-axis
    particles.rotation.y += 0.005;
    object.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function render() {
    renderer.render( scene, camera );
}


