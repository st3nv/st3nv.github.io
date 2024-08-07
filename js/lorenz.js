import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer;
let particles = [];
const numParticles = 15000;
const lorenzParams = { sigma: 20, rho: 40, beta: 4 / 3 };
const dt = 0.01;

let controls


const particle_size = 0.045;
let warmup = 150;
const numGroups = 1;
const lorenzParamsGroup1 = { sigma: 10, rho: 28, beta: 5 / 3,  startX : 0, startY : 0, startZ : 0};
const lorenzParamsGroup2 = { sigma: 10, rho: 28, beta: 5 / 3 , startX : 0, startY : 0, startZ : 0};
const lorenzParamsGroup3 = { sigma: 10, rho: 28, beta: 5 / 3 , startX : 0, startY : 0, startZ : 0};
const lorenzParamsGroup4 = { sigma: 10, rho: 28, beta: 5 / 3 , startX : 0, startY : 0, startZ : 0};
const clock = new THREE.Clock();
const canvas = document.getElementById('myCanvas');

let isUserInteracting = false;
let originalPosition, originalRotation;


init();
animate();

function init() {
    const canvas = document.getElementById('myCanvas');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 1000);
    camera.position.z = 50;

    // Set the original position and rotation
    originalPosition = camera.position.clone();
    originalRotation = camera.quaternion.clone();

    // Initialize the WebGLRenderer with the canvas element
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Other initialization code (like adding objects to the scene, etc.)

    // Ensure the canvas is resized correctly initially
    onWindowResize();

    // Create particles
    for (let i = 0; i < numParticles; i++) {
        let group = Math.floor(i / (numParticles / numGroups));
        let groupParams;
        if (group === 0) {
            groupParams = lorenzParamsGroup1;
        } else if (group === 1) {
            groupParams = lorenzParamsGroup2;
        } else if (group === 2) {
            groupParams = lorenzParamsGroup3;
        } else {
            groupParams = lorenzParamsGroup4;
        }

        let particle = new THREE.Vector3(
            (Math.random() - 0.5) * 2 + groupParams.startX,
            (Math.random() - 0.5) * 2 + groupParams.startY,
            (Math.random() - 0.5) * 2 + groupParams.startZ
        );
        particles.push(particle);
    }

    preCalculatePositions(warmup);

    // controls to rotate around the scene
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.05;
    controls.enableZoom = false;
    controls.zoomSpeed = 0.5;
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    controls.screenSpacePanning = true;
    controls.minDistance = 0;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    controls.addEventListener('start', function() {
        isUserInteracting = true;
    });

    controls.addEventListener('end', function() {
        isUserInteracting = false;
    });


    // Window resize handling
    window.addEventListener('resize', onWindowResize, false);
}


function preCalculatePositions(iterations) {
    for (let i = 0; i < iterations; i++) {
        particles.forEach(particle => {
            const dx = lorenzParams.sigma * (particle.y - particle.x) * dt;
            const dy = (particle.x * (lorenzParams.rho - particle.z) - particle.y) * dt;
            const dz = (particle.x * particle.y - lorenzParams.beta * particle.z) * dt;

            particle.x += dx;
            particle.y += dy;
            particle.z += dz;
        });
    }
}

function animate() {
    let timeDelta = clock.getDelta();
    timeDelta = timeDelta * 0.6;
    requestAnimationFrame(animate);
    
    TWEEN.update(); // Make sure to update TWEEN

    if (!isUserInteracting) {
        returnCameraToOrigin();
    }

    // Update each particle's position based on Lorenz attractor equations
    particles.forEach(particle => {
        let group = Math.floor(particles.indexOf(particle) / (numParticles / numGroups));
        let groupParams;
        if (group === 0) {
            groupParams = lorenzParamsGroup1;
        } else if (group === 1) {
            groupParams = lorenzParamsGroup2;
        } else if (group === 2) {
            groupParams = lorenzParamsGroup3;
        } else {
            groupParams = lorenzParamsGroup4;
        }

        const dx = groupParams.sigma * (particle.y - particle.x) * timeDelta;
        const dy = (particle.x * (groupParams.rho - particle.z) - particle.y) * timeDelta;
        const dz = (particle.x * particle.y - groupParams.beta * particle.z) * timeDelta;

        particle.x += dx;
        particle.y += dy;
        particle.z += dz;
    });

    renderParticles();
}

function renderParticles() {
    // Clear the previous frame
    while (scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }

    // Prepare BufferGeometry for updated particles
    let geometry = new THREE.BufferGeometry();
    let positions = new Float32Array(particles.length * 3);
    particles.forEach((particle, i) => {
        positions[i * 3] = particle.x;
        positions[i * 3 + 1] = particle.y;
        positions[i * 3 + 2] = particle.z;
    });
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    let material = new THREE.PointsMaterial({ size: particle_size, color: 0x50e0ff, transparent: true, opacity: 0.8});
    let points = new THREE.Points(geometry, material);
    scene.add(points);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function returnCameraToOrigin() {
    const threshold = 0.5; // A threshold to prevent small discrepancies from triggering the transition

    // Check if the camera is significantly far from the original position and rotation
    if (camera.position.distanceTo(originalPosition) > threshold || 
        camera.quaternion.angleTo(originalRotation) > threshold) {

        controls.enabled = false; // Disable OrbitControls to prevent interference during transition

        // Smooth transition to the original position
        new TWEEN.Tween(camera.position)
            .to({
                x: originalPosition.x, 
                y: originalPosition.y, 
                z: originalPosition.z
            }, 2000) // Duration of the transition in milliseconds
            .easing(TWEEN.Easing.Quadratic.Out) // Easing function for smoothness
            .onUpdate(() => {
                camera.updateProjectionMatrix(); // Update projection matrix during transition
            })
            .onComplete(() => {
                controls.enabled = true; // Re-enable OrbitControls after transition
            })
            .start();

        // Smooth transition to the original rotation
        new TWEEN.Tween(camera.quaternion)
            .to({
                x: originalRotation.x, 
                y: originalRotation.y, 
                z: originalRotation.z, 
                w: originalRotation.w
            }, 2000) // Matching duration for rotation transition
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                originalPosition = camera.position.clone(); // Update original position
                originalRotation = camera.quaternion.clone(); // Update original rotation
                controls.enabled = true; // Ensure controls are re-enabled after rotation transition
                // The position and rotation are already updated in the position tween's onComplete
            })
            .start();
    }
}