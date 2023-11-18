
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { CSS2DRenderer, CSS2DObject } from '//cdn.rawgit.com/mrdoob/three.js/master/examples/jsm/renderers/CSS2DRenderer.js';

let scene, camera, renderer, sphere, particleSystem, controls, particlesData = [];
const particlesCount = 100;
const orbitParticlesCount = 100;
const particle_size = 0.005;
const orbital_radius = 4;

const orbits = []; // Array to store orbit properties

// Initialize random orbits for each satellite
for (let i = 0; i < orbitParticlesCount; i++) {
  const radius = Math.random() * 50 + 50; // Random radius for orbit
  const speed = Math.random() * 0.02 + 0.01; // Random speed of orbit
  const angle = Math.random() * Math.PI * 2; // Random starting angle
  orbits.push({ radius, speed, angle });
}

const trails = []; // Array to hold trail geometries
const trailLength = 3; // Number of segments in each trail

let lastTime = Date.now();

// Replace these values with the desired latitude, longitude, and radius
const latitude = 32.3936; // Example latitude (San Francisco)
const longitude = -119.4127; // Example longitude (San Francisco)

let dot; // Variable to hold the dot

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    // const cssRenderer = new CSS2DRenderer();
    // cssRenderer.setSize(window.innerWidth, window.innerHeight);

    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);




    // Load Earth texture
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('public/earth_texture.jpeg', function(texture) {
        // Apply anisotropy here
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });// Replace with the path to your Earth texture

    // Sphere setup with Earth texture
    const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 10, // Lower value for less shininess
        specular: new THREE.Color(0x111111) // Darker color for less specular highlight
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);


    // Dot on earth 
    const radius = 1.02; // Radius of the Earth's surface

    // Convert latitude and longitude to spherical coordinates
    const phi = (90 - latitude) * (Math.PI / 180); // Convert latitude to radians
    const theta = (120 - longitude) * (Math.PI / 180); // Convert longitude to radians
    
    // Calculate the position of the dot on the sphere
    const dotX = radius * Math.sin(phi) * Math.cos(theta);
    const dotY = radius * Math.cos(phi);
    const dotZ = radius * Math.sin(phi) * Math.sin(theta);

    // const dotVertices = new Float32Array([dotX, dotY, dotZ]);
    const dotGeometry = new THREE.SphereGeometry(0.02, 50, 50); // Adjust the size as needed
    // dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotVertices, 3));
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Set the color to yellow
    dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.set(dotX, dotY, dotZ); // Set the position of the dot
    sphere.add(dot); // Add the dot to the sphere

    // Add a label to the dot
    // Create a spherical label for the text
    const textDiv = document.createElement('div');
    textDiv.className = 'label';
    textDiv.textContent = 'You'; // Your text here
    textDiv.style.color = '#ffffff'; // Set the text color to white
    textDiv.style.fontSize = '1px'; // Set the font size to make it larger
    const textLabel = new CSS2DObject(textDiv);

    // Calculate the position of the label
    const labelX = dotX * 1.2; // Adjust the distance from the Earth's surface
    const labelY = dotY * 1.2; // Adjust the distance from the Earth's surface
    const labelZ = dotZ * 1.2; // Adjust the distance from the Earth's surface

    textLabel.position.set(labelX, labelY, labelZ);

    // Create a line geometry to connect the dot and the label
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = new Float32Array([dotX, dotY, dotZ, labelX, labelY, labelZ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));

    // Create a line material
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });

    // Create the line mesh
    const line = new THREE.Line(lineGeometry, lineMaterial);

    // Add the label and line to the sphere
    sphere.add(textLabel);
    // sphere.add(line);


    // Add a light source to enhance the sphere's appearance
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    // Particle setup with orbital and scattered particles
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const theta = Math.random() * 2 * Math.PI; // Random angle around the sphere
        const phi = Math.acos((Math.random() * 2) - 1); // Random angle from top to bottom of the sphere
    
        let radius;
        if (i < orbitParticlesCount) {
            // Orbital particles
            // Use a distribution that favors values close to a specific orbital radius
            radius = 2 + Math.random() * orbital_radius; // Adjust this formula as needed
        } else {
            // Scattered particles
            // Increase the chance of being close to the orbital radius, but allow for some to be further out
            const factor = Math.random();
            radius = factor < 0.75 ? (1.5 + Math.random() * orbital_radius) : (1.5 + Math.random() * 10);
        }
    
        posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = radius * Math.cos(phi);
    }
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.arc(8, 8, 8, 0, 2 * Math.PI);
    context.fillStyle = '#FFFFFF';
    context.fill();

    // Use the canvas as a texture
    const particleTexture = new THREE.Texture(canvas);
    particleTexture.needsUpdate = true;

    const particlesMaterial = new THREE.PointsMaterial({
        size: particle_size,
        map: particleTexture,
        transparent: true,
        alphaTest: 0.5
    });

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Create trails
    for (let i = 0; i < particlesCount; i++) {
        const trailGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(trailLength * 3); // x, y, z for each segment
        for (let j = 0; j < trailLength * 3; j++) {
            positions[j] = 0; // Initialize with 0 to avoid rendering initially
        }
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // make the trial beautiful and has a gradient transparent effect and white color
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            linewidth: 1,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
        });

        const trail = new THREE.Line(trailGeometry, trailMaterial);

        trails.push(trail);
        scene.add(trail);
    }

    // OrbitControls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    const polarAngle = Math.PI / 2; // Horizontal plane
    controls.minPolarAngle = polarAngle; // Set both min and max to the same value
    controls.maxPolarAngle = polarAngle;

    // Window resize handling
    window.addEventListener('resize', onWindowResize, false);
    
}

function animate() {

    requestAnimationFrame(animate);
    let currentTime = Date.now();
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Rotate orbital particles and update trail effect
    updateParticlesandTrials();
    sphere.rotation.y -= 0.005;

    renderer.render(scene, camera);
}


function updateParticlesandTrials(deltaTime) {
    const positionAttribute = particleSystem.geometry.attributes.position;

    for (let i = 0; i < particlesCount; i++) {
        // Update particle position
        let x, y, z, newX, newZ;
        if (i < orbitParticlesCount) {
            // Rotating orbital particles
            x = positionAttribute.getX(i);
            y = positionAttribute.getY(i);
            z = positionAttribute.getZ(i);

            // Simple rotation around the y-axis
            newX = x * Math.cos(0.01) - z * Math.sin(0.01);
            newZ = x * Math.sin(0.01) + z * Math.cos(0.01);

            positionAttribute.setXYZ(i, newX, y, newZ);
        } else {
            // For scattered particles, implement the logic for their movement
            // Currently, this part is missing or not defined
        }

        // Update trail for this particle
        const trail = trails[i];
        const trailPositions = trail.geometry.attributes.position.array;

        // Shift trail positions
        for (let j = (trailLength - 1) * 3; j >= 3; j -= 3) {
            trailPositions[j] = trailPositions[j - 3];
            trailPositions[j + 1] = trailPositions[j - 2];
            trailPositions[j + 2] = trailPositions[j - 1];
        }

        // Add new particle position to the start of the trail
        trailPositions[0] = positionAttribute.getX(i);
        trailPositions[1] = positionAttribute.getY(i);
        trailPositions[2] = positionAttribute.getZ(i);

        trail.geometry.attributes.position.needsUpdate = true;
    }

    positionAttribute.needsUpdate = true; // Ensure this is outside the loop
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

