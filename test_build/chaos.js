let scene, camera, renderer, particleSystem;

let lastTime = 0; // Declare lastTime at the top
const block_size = 2;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Particle system setup
    let particleGeometry = new THREE.BufferGeometry();
    let particlesCount = 5000;
    let posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * block_size;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    let particleMaterial = new THREE.PointsMaterial({ size: 0.005, color: 0xffffff });
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Responsive canvas
    window.addEventListener('resize', onWindowResize, false);
}


function animate(time) {
    requestAnimationFrame(animate);
    let deltaTime = time - lastTime;
    lastTime = time;

    // Adjust your animation based on deltaTime
    // This ensures frame rate independence
    if (deltaTime > 0.01) { // You can set a threshold value
        particleSystem.rotation.y += 0.001 * deltaTime;
    }

    render();
}


function render() {
    particleSystem.rotation.y += 0.001;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
