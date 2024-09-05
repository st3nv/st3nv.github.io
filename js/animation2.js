import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let balls = [];
const numBalls = 1000; // Increased number of balls
const pegs = [];
const rows = 50; // Increased number of rows
const cols = 50; // Increased number of columns
const ballRadius = 0.1; // Smaller ball radius
const pegRadius = 0.05; // Smaller peg radius
const gravity = 0.005; // Reduced gravity for smoother fall
const friction = 0.98; // Slightly increased friction for more stability

// Add this constant for the starting position of balls
const ballStartY = rows / 2 + 5;

const columnWidth = 0.5; // Reduced column width
const bottomY = -rows / 2;
const leftmostX = -cols * columnWidth / 2;
const rightmostX = cols * columnWidth / 2;

// Add this new array to keep track of stacked balls
let stackedBalls = new Array(cols).fill(0);

// Add this constant for maximum height difference between adjacent columns
const maxHeightDifference = 3;

init();
animate();

function init() {
    const canvas = document.getElementById('myCanvas');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40; // Adjusted to show the larger grid

    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = false;

    createPlinkoBoard();
    createBalls(numBalls);

    window.addEventListener('resize', onWindowResize, false);

    // Add this line to set up the button click event
    document.getElementById('addBallsButton').addEventListener('click', () => createBalls(100));
}

function createPlinkoBoard() {
    const pegGeometry = new THREE.SphereGeometry(pegRadius, 32, 32);
    const pegMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const peg = new THREE.Mesh(pegGeometry, pegMaterial);
            peg.position.set(col * columnWidth - (cols * columnWidth / 2) + columnWidth / 2, row - rows / 2 + 0.5, 0);
            scene.add(peg);
            pegs.push(peg);
        }
    }
}

// Modify createBalls function to accept a parameter
function createBalls(count) {
    const maxBalls = 5000; // Set a maximum number of balls
    const ballsToCreate = Math.min(count, maxBalls - balls.length);
    
    const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    for (let i = 0; i < ballsToCreate; i++) {
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(0, ballStartY, 0);
        ball.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.05, 0, 0);
        ball.isStacked = false;
        scene.add(ball);
        balls.push(ball);
    }

    if (balls.length >= maxBalls) {
        const addBallsButton = document.querySelector('button');
        if (addBallsButton) {
            addBallsButton.disabled = true;
            addBallsButton.textContent = 'Max Balls Reached';
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    balls.forEach(ball => {
        if (!ball.isStacked) {
            ball.velocity.y -= gravity;
            ball.position.add(ball.velocity);

            // Collision with pegs
            pegs.forEach(peg => {
                const dist = ball.position.distanceTo(peg.position);
                if (dist < ballRadius + pegRadius) {
                    const collisionNormal = ball.position.clone().sub(peg.position).normalize();
                    ball.velocity.reflect(collisionNormal);
                    ball.velocity.multiplyScalar(0.5);
                    ball.velocity.x += (Math.random() - 0.5) * 0.05;
                }
            });

            // Check for stacking or side boundaries
            const column = Math.round((ball.position.x - leftmostX) / columnWidth);
            if (column >= 0 && column < cols) {
                const stackHeight = stackedBalls[column] * (ballRadius * 2);
                const leftHeight = column > 0 ? stackedBalls[column - 1] : 0;
                const rightHeight = column < cols - 1 ? stackedBalls[column + 1] : 0;
                const maxNeighborHeight = Math.max(leftHeight, rightHeight);

                if (ball.position.y - ballRadius <= bottomY + stackHeight &&
                    stackedBalls[column] <= maxNeighborHeight + maxHeightDifference) {
                    ball.position.y = bottomY + stackHeight + ballRadius;
                    ball.position.x = leftmostX + (column + 0.5) * columnWidth;
                    ball.isStacked = true;
                    stackedBalls[column]++;
                    ball.velocity.set(0, 0, 0);
                } else if (ball.position.y - ballRadius <= bottomY + stackHeight) {
                    // If the stack is too high, let the ball bounce off
                    ball.velocity.y = Math.abs(ball.velocity.y) * 0.5;
                    ball.position.y = bottomY + stackHeight + ballRadius;
                }
            }

            // Prevent leaking to the sides
            if (ball.position.x < leftmostX + ballRadius) {
                ball.position.x = leftmostX + ballRadius;
                ball.velocity.x *= -0.5;
            } else if (ball.position.x > rightmostX - ballRadius) {
                ball.position.x = rightmostX - ballRadius;
                ball.velocity.x *= -0.5;
            }

            // Add this block to prevent balls from falling through the bottom
            if (ball.position.y < bottomY + ballRadius) {
                ball.position.y = bottomY + ballRadius;
                ball.velocity.y = 0;
                ball.isStacked = true;
                const column = Math.round((ball.position.x - leftmostX) / columnWidth);
                if (column >= 0 && column < cols) {
                    stackedBalls[column]++;
                }
            }
        }

        // Remove slight movement at the bottom for stacked balls
        if (ball.isStacked) {
            ball.velocity.set(0, 0, 0);
        }
    });

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}