import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Lorenz attractor particle background for the home page.
//
// Design notes
// - With fixed parameters every particle ends up on the same butterfly-shaped
//   attractor and the picture stops changing. Two things keep it alive:
//   1. Particles are (re)born in coherent bursts: a tight blob that stretches
//      into thin sweeping filaments, then slowly mixes into the attractor and
//      fades out. Several generations are on screen at once.
//   2. sigma / rho / beta drift along sums of sines with unrelated periods, so
//      the attractor itself keeps morphing and never repeats.
// - Colour comes from each particle's speed (computed on the GPU straight from
//   the Lorenz equations), and points are blended additively so dense
//   filaments glow.

const NUM_PARTICLES = 70000;
const NUM_BURSTS = 8;          // particle generations alive at once
const BURST_INTERVAL = 3;      // seconds between bursts
const LIFETIME = NUM_BURSTS * BURST_INTERVAL;
const BURST_SIZE = Math.floor(NUM_PARTICLES / NUM_BURSTS);
const FADE_IN = 2.5;           // seconds; fresh bursts are dense, so let them appear gently
const FADE_OUT = 3.0;          // seconds

const POINT_SIZE = 0.13;       // world units
const OPACITY = 0.6;
const COLOR_SLOW = new THREE.Color(0x1b3fd8);
const COLOR_MID = new THREE.Color(0x50e0ff);
const COLOR_FAST = new THREE.Color(0xa8eeff);

// The page opens like the original: one blob pre-stretched with these parameters.
const WARMUP_STEPS = 150;
const WARMUP_DT = 0.01;
const WARMUP_PARAMS = { sigma: 20, rho: 40, beta: 4 / 3 };

// rho stays above ~24.7 so the system never collapses onto its fixed points.
function driftParams(t, out) {
    out.sigma = 10 + 2.0 * Math.sin(0.071 * t + 0.5) + 1.0 * Math.sin(0.0233 * t + 2.0);
    out.rho = 32 + 4.5 * Math.sin(0.053 * t) + 2.0 * Math.sin(0.0171 * t + 1.3);
    out.beta = 2.2 + 0.5 * Math.sin(0.0617 * t + 2.1) + 0.25 * Math.sin(0.0197 * t + 0.4);
    return out;
}

const SPEED = 0.6;           // simulation time per real second
const MAX_FRAME_DT = 1 / 30; // a slow or background frame can't blow up the integration

// Camera slowly drifts around the attractor; after a drag it glides back onto this path.
const CAMERA_DISTANCE = 62;
const RETURN_RATE = 1.5;
function homePosition(t, out) {
    const azimuth = 0.55 * Math.sin(0.043 * t) + 0.2 * Math.sin(0.017 * t + 1.0);
    const elevation = 0.18 + 0.12 * Math.sin(0.029 * t + 0.7);
    return out.set(
        CAMERA_DISTANCE * Math.cos(elevation) * Math.sin(azimuth),
        CAMERA_DISTANCE * Math.sin(elevation),
        CAMERA_DISTANCE * Math.cos(elevation) * Math.cos(azimuth),
    );
}

const canvas = document.getElementById('myCanvas');

// index.html removes the canvas on small screens; don't spin up WebGL there.
if (canvas && screen.width > 699) {
    start();
}

function start() {
    const renderer = new THREE.WebGLRenderer({ canvas, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.5, 1000);

    // --- particles -------------------------------------------------------
    const positions = new Float32Array(NUM_PARTICLES * 3);
    const births = new Float32Array(NUM_PARTICLES);
    const deaths = new Float32Array(NUM_PARTICLES);

    seedBlob(positions, 1);
    for (let s = 0; s < WARMUP_STEPS; s++) step(positions, WARMUP_PARAMS, WARMUP_DT);
    // First generation is staggered so it thins out gradually as bursts take over.
    for (let b = 0; b < NUM_BURSTS; b++) {
        deaths.fill((b + 1) * BURST_INTERVAL, b * BURST_SIZE, (b + 1) * BURST_SIZE);
    }
    deaths.fill(NUM_BURSTS * BURST_INTERVAL, NUM_BURSTS * BURST_SIZE);

    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
    const birthAttr = new THREE.BufferAttribute(births, 1);
    const deathAttr = new THREE.BufferAttribute(deaths, 1);
    geometry.setAttribute('position', positionAttr);
    geometry.setAttribute('aBirth', birthAttr);
    geometry.setAttribute('aDeath', deathAttr);

    const params = driftParams(0, {});
    const uniforms = {
        uTime: { value: 0 },
        uSigma: { value: params.sigma },
        uRho: { value: params.rho },
        uBeta: { value: params.beta },
        uSize: { value: POINT_SIZE },
        uScale: { value: 1 },
        uOpacity: { value: OPACITY },
        uSlow: { value: COLOR_SLOW },
        uMid: { value: COLOR_MID },
        uFast: { value: COLOR_FAST },
    };
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: /* glsl */ `
            uniform float uTime, uSigma, uRho, uBeta, uSize, uScale;
            uniform vec3 uSlow, uMid, uFast;
            attribute float aBirth;
            attribute float aDeath;
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
                vec3 p = position;
                vec3 v = vec3(uSigma * (p.y - p.x), p.x * (uRho - p.z) - p.y, p.x * p.y - uBeta * p.z);
                float s = clamp(length(v) / 220.0, 0.0, 1.0);
                vColor = mix(mix(uSlow, uMid, smoothstep(0.0, 0.45, s)), uFast, smoothstep(0.45, 1.0, s));
                // Slow particles bunch up (density ~ 1/speed), so dim them to keep
                // the wing centres from piling up into white blobs.
                vAlpha = smoothstep(0.0, ${FADE_IN.toFixed(2)}, uTime - aBirth)
                       * smoothstep(0.0, ${FADE_OUT.toFixed(2)}, aDeath - uTime)
                       * mix(0.55, 1.0, smoothstep(0.0, 0.5, s));
                vec4 mv = modelViewMatrix * vec4(p, 1.0);
                gl_PointSize = clamp(uSize * uScale / -mv.z, 1.0, 10.0);
                gl_Position = projectionMatrix * mv;
            }`,
        fragmentShader: /* glsl */ `
            uniform float uOpacity;
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
                vec2 c = gl_PointCoord - 0.5;
                float d = dot(c, c) * 4.0;
                if (d > 1.0) discard;
                gl_FragColor = vec4(vColor, (1.0 - d) * vAlpha * uOpacity);
            }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false; // particles move every frame; bounding sphere would go stale
    // Stand the butterfly upright (Lorenz z → screen up) and centre it at the origin.
    const attractor = new THREE.Group();
    attractor.rotation.x = -Math.PI / 2;
    attractor.add(points);
    scene.add(attractor);

    // --- camera & controls ----------------------------------------------
    let elapsed = Math.random() * 600; // start somewhere different on each visit
    const home = homePosition(elapsed, new THREE.Vector3());
    camera.position.copy(home);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;

    let isUserInteracting = false;
    controls.addEventListener('start', () => { isUserInteracting = true; });
    controls.addEventListener('end', () => { isUserInteracting = false; });

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.uScale.value = renderer.getPixelRatio() * window.innerHeight
            / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    }
    resize();
    window.addEventListener('resize', resize);

    // --- animation loop --------------------------------------------------
    const clock = new THREE.Clock();
    let now = 0;
    let sinceBurst = 0;
    let nextBurst = 0;

    function frame() {
        const dt = Math.min(clock.getDelta(), MAX_FRAME_DT);
        now += dt;
        elapsed += dt;

        driftParams(elapsed, params);
        uniforms.uTime.value = now;
        uniforms.uSigma.value = params.sigma;
        uniforms.uRho.value = params.rho;
        uniforms.uBeta.value = params.beta;
        points.position.z = 1 - params.rho; // attractor centre sits at z ≈ rho - 1

        sinceBurst += dt;
        if (sinceBurst >= BURST_INTERVAL) {
            sinceBurst -= BURST_INTERVAL;
            const from = nextBurst * BURST_SIZE;
            seedBlob(positions.subarray(from * 3, (from + BURST_SIZE) * 3), 0.8 + Math.random() * 1.2);
            births.fill(now, from, from + BURST_SIZE);
            deaths.fill(now + LIFETIME, from, from + BURST_SIZE);
            birthAttr.needsUpdate = true;
            deathAttr.needsUpdate = true;
            nextBurst = (nextBurst + 1) % NUM_BURSTS;
        }

        step(positions, params, dt * SPEED);
        positionAttr.needsUpdate = true;

        homePosition(elapsed, home);
        if (!isUserInteracting) {
            camera.position.lerp(home, 1 - Math.exp(-RETURN_RATE * dt));
        }
        controls.update();

        renderer.render(scene, camera);
    }

    // Only animate while the canvas is on screen.
    let running = false;
    function setRunning(on) {
        if (on === running) return;
        running = on;
        if (on) clock.getDelta(); // drop the time spent paused
        renderer.setAnimationLoop(on ? frame : null);
    }
    new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting)).observe(canvas);
    setRunning(true);
}

// Fill `p` with a tight random blob near the origin (slightly off-centre, so
// successive bursts favour different wings and trace different filaments).
function seedBlob(p, spread) {
    const cx = (Math.random() - 0.5) * 3;
    const cy = (Math.random() - 0.5) * 3;
    const cz = (Math.random() - 0.5) * 3;
    for (let i = 0; i < p.length; i += 3) {
        p[i] = cx + (Math.random() - 0.5) * 2 * spread;
        p[i + 1] = cy + (Math.random() - 0.5) * 2 * spread;
        p[i + 2] = cz + (Math.random() - 0.5) * 2 * spread;
    }
}

// One explicit-Euler step of the Lorenz system for every particle.
function step(p, { sigma, rho, beta }, dt) {
    for (let i = 0; i < p.length; i += 3) {
        const x = p[i], y = p[i + 1], z = p[i + 2];
        const nx = x + sigma * (y - x) * dt;
        if (!(Math.abs(nx) < 1e3)) { // diverged (or NaN): drop it back near the origin
            p[i] = Math.random() - 0.5; p[i + 1] = Math.random() - 0.5; p[i + 2] = Math.random() - 0.5;
            continue;
        }
        p[i] = nx;
        p[i + 1] = y + (x * (rho - z) - y) * dt;
        p[i + 2] = z + (x * y - beta * z) * dt;
    }
}
