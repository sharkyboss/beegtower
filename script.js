// Get the canvas element and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const canvasWidth = 800;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Player settings
const playerSize = 30;
let playerX = 100;
let playerY = canvasHeight - playerSize;
let playerSpeed = 5;
let jumpPower = -12;
let velocityY = 0;
let isJumping = false;

// Platform settings
const platformWidth = 150;
const platformHeight = 20;
const platforms = [
    { x: 50, y: canvasHeight - 50, width: platformWidth },
    { x: 250, y: canvasHeight - 150, width: platformWidth },
    { x: 450, y: canvasHeight - 250, width: platformWidth },
    { x: 650, y: canvasHeight - 350, width: platformWidth }
];

// Gravity constant
const gravity = 0.6;

// Event listeners for player movement
const keys = {
    left: false,
    right: false,
    up: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ' && !isJumping) keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.up = false;
});

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handleMovement();
    applyGravity();
    checkCollisions();
    drawGame();

    requestAnimationFrame(gameLoop);
}

function handleMovement() {
    if (keys.left) playerX -= playerSpeed;
    if (keys.right) playerX += playerSpeed;
    if (keys.up && !isJumping) {
        isJumping = true;
        velocityY = jumpPower;
    }
}

function applyGravity() {
    playerY += velocityY;
    velocityY += gravity;

    if (playerY > canvasHeight - playerSize) {
        playerY = canvasHeight - playerSize;
        velocityY = 0;
        isJumping = false;
    }
}

function checkCollisions() {
    for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];

        // Check if the player is landing on a platform
        if (playerY + playerSize <= platform.y && playerY + playerSize + velocityY >= platform.y &&
            playerX + playerSize > platform.x && playerX < platform.x + platform.width) {
            playerY = platform.y - playerSize;
            velocityY = 0;
            isJumping = false;
        }
    }
}

function drawGame() {
    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = "#7a7a7a";
        ctx.fillRect(platform.x, platform.y, platform.width, platformHeight);
    });

    // Draw player
    ctx.fillStyle = "#FF5733";
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
}

// Start the game
gameLoop();
