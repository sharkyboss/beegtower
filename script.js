document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    const numberOfPlatforms = 100;

    // Variables for player movement and jump
    let playerPosX = window.innerWidth / 2 - 25; // Start horizontally centered
    let playerPosY = window.innerHeight - 50; // Start at the bottom of the screen
    let velocityY = 0;
    let gravity = 1;
    let jumpHeight = -15; // Control the height of the jump
    let moveLeft = false;
    let moveRight = false;

    // Create 100 platforms dynamically
    for (let i = 1; i <= numberOfPlatforms; i++) {
        const platform = document.createElement('div');
        platform.classList.add('platform');
        platform.id = `platform-${i}`;
        container.appendChild(platform);
    }

    const platforms = document.querySelectorAll('.platform');
    
    // Randomly position the platforms with more vertical spacing
    platforms.forEach(platform => {
        const randomTop = Math.random() * (window.innerHeight * 2); // Spread vertically
        const randomLeft = Math.random() * (window.innerWidth - 100); // Spread horizontally
        platform.style.top = `${randomTop}px`;
        platform.style.left = `${randomLeft}px`;
    });

    // Player setup
    const player = document.createElement('div');
    player.classList.add('player');
    container.appendChild(player);

    // Camera setup (tracks player position)
    let cameraOffsetX = 0;
    let cameraOffsetY = 0;
    const cameraSpeed = 8; // Control the speed of camera movement
    const margin = 100; // Dead zone where the camera doesn't move unless the player is beyond this distance

    // Listen for key events
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveLeft = true;
        if (e.key === 'ArrowRight') moveRight = true;
        if (e.key === ' ' && playerPosY === window.innerHeight - 50) {
            velocityY = jumpHeight; // Jump
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') moveLeft = false;
        if (e.key === 'ArrowRight') moveRight = false;
    });

    // Game loop
    function gameLoop() {
        // Apply gravity to the player
        velocityY += gravity;
        playerPosY += velocityY;

        // Prevent the player from falling through the floor
        if (playerPosY > window.innerHeight - 50) {
            playerPosY = window.innerHeight - 50;
            velocityY = 0;
        }

        // Move player left or right
        if (moveLeft) playerPosX -= 5;
        if (moveRight) playerPosX += 5;

        // Keep the player within the window bounds
        if (playerPosX < 0) playerPosX = 0;
        if (playerPosX > window.innerWidth - 50) playerPosX = window.innerWidth - 50;

        // Update player position
        player.style.left = `${playerPosX}px`;
        player.style.top = `${playerPosY}px`;

        // Check for collisions with platforms (simple example)
        platforms.forEach(platform => {
            const platformRect = platform.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            // Simple collision detection (if player touches platform)
            if (playerRect.bottom <= platformRect.top && playerRect.right >= platformRect.left && playerRect.left <= platformRect.right) {
                // If falling and on top of the platform, stop falling
                if (velocityY > 0) {
                    playerPosY = platformRect.top - 50; // Place player on top of platform
                    velocityY = 0;
                }
            }
        });

        // Camera follow player (smooth tracking)
        // Horizontal camera movement
        if (playerPosX - cameraOffsetX > window.innerWidth / 2 - margin) {
            cameraOffsetX += cameraSpeed; // Move right
        } else if (playerPosX - cameraOffsetX < window.innerWidth / 2 - margin) {
            cameraOffsetX -= cameraSpeed; // Move left
        }

        // Vertical camera movement
        if (playerPosY - cameraOffsetY > window.innerHeight / 2 - margin) {
            cameraOffsetY += cameraSpeed; // Move down
        } else if (playerPosY - cameraOffsetY < window.innerHeight / 2 - margin) {
            cameraOffsetY -= cameraSpeed; // Move up
        }

        // Apply camera offset to the game container to simulate camera movement
        container.style.transform = `translate(${-cameraOffsetX}px, ${-cameraOffsetY}px)`;

        // Call the game loop again
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();
});
