import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer;
let particles = [];
const numParticles = 10000;
const lorenzParams = { sigma: 10, rho: 28, beta: 8 / 3 };
const dt = 0.01;

const particle_size = 0.005;
let warmup = 100;
const numGroups = 4;
const lorenzParamsGroup1 = { sigma: 10, rho: 30, beta: 8 / 3 };
const lorenzParamsGroup2 = { sigma: 12, rho: 40, beta: 8 / 3 };
const lorenzParamsGroup3 = { sigma: 9, rho: 50, beta: 8 / 3 };
const lorenzParamsGroup4 = { sigma: 11, rho: 60, beta: 8 / 3 };

init();
animate();

function init() {
    // Basic Three.js setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //add child in the beginning instead of appending
    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    // Create particles
    for (let i = 0; i < numParticles; i++) {
        let group = Math.floor(i / (numParticles / numGroups));
        let groupX, groupY, groupZ;

        if (group === 0) {
            groupX = -10;
            groupY = 0;
            groupZ = 10;
        } else if (group === 1) {
            groupX = 0;
            groupY = 10;
            groupZ = 0;
        }
        else if (group === 2) {
            groupX = 10;
            groupY = 0;
            groupZ = 0;
        }else {
            groupX = 0;
            groupY = 10;
            groupZ = 10;
        }

        let particle = new THREE.Vector3(
            (Math.random() - 0.5) * 2 + groupX,
            (Math.random() - 0.5) * 2 + groupY,
            (Math.random() - 0.5) * 2 + groupZ
        );
        particles.push(particle);
    }

    preCalculatePositions(warmup);

    // // Orbit controls
    // let controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableZoom = false;
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 1;


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
    requestAnimationFrame(animate);

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

        const dx = groupParams.sigma * (particle.y - particle.x) * dt;
        const dy = (particle.x * (groupParams.rho - particle.z) - particle.y) * dt;
        const dz = (particle.x * particle.y - groupParams.beta * particle.z) * dt;

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

    let material = new THREE.PointsMaterial({ size: particle_size, color: 0xffffff });
    let points = new THREE.Points(geometry, material);
    scene.add(points);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
