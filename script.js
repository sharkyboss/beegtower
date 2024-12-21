document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    const numberOfPlatforms = 100;
    
    // Create 100 platforms dynamically
    for (let i = 1; i <= numberOfPlatforms; i++) {
        const platform = document.createElement('div');
        platform.classList.add('platform');
        platform.id = `platform-${i}`;
        container.appendChild(platform);
    }

    // Example platform random position
    const platforms = document.querySelectorAll('.platform');
    platforms.forEach(platform => {
        const randomTop = Math.random() * 500; // Random top position
        const randomLeft = Math.random() * (window.innerWidth - 100); // Random left position
        platform.style.top = `${randomTop}px`;
        platform.style.left = `${randomLeft}px`;
    });

    // Player setup
    const player = document.createElement('div');
    player.classList.add('player');
    container.appendChild(player);

    let playerPosX = window.innerWidth / 2;
    let playerPosY = window.innerHeight - 50; // Start at the bottom of the screen
    let velocityY = 0;
    let gravity = 1;

    // Player movement setup
    let moveLeft = false;
    let moveRight = false;

    // Listen for key events
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveLeft = true;
        if (e.key === 'ArrowRight') moveRight = true;
        if (e.key === ' ' && playerPosY === window.innerHeight - 50) {
            velocityY = -15; // Jump
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') moveLeft = false;
        if (e.key === 'ArrowRight') moveRight = false;
    });

    // Game loop
    function gameLoop() {
        // Apply gravity
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

        // Call the game loop again
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();
});
