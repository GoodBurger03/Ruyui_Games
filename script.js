// Set up canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fit the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game variables
let character = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    image: null,
    jumping: false,
    velocityY: 0,
};

let gravity = 0.5;
let obstacles = [];
let frames = 0;
let animeGlow = 0;
let score = 0;
let gameOver = false;

const obstacleImages = ["obstacle1.png", "obstacle2.png", "obstacle3.png"]; // Example obstacle images

const defaultCharacterImage = new Image();
defaultCharacterImage.src = 'loshmi.png'; // Replace with your default character image
character.image = defaultCharacterImage;

// Handle character upload
document.getElementById("character-upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadedImage = new Image();
            uploadedImage.src = e.target.result;
            uploadedImage.onload = () => {
                character.image = uploadedImage;
            };
        };
        reader.readAsDataURL(file);
    }
});

// Draw character
function drawCharacter() {
    if (character.image) {
        ctx.drawImage(character.image, character.x, character.y, character.width, character.height);
    } else {
        ctx.fillStyle = "#ff69b4";
        ctx.fillRect(character.x, character.y, character.width, character.height);
    }
    ctx.shadowColor = `rgba(255, 105, 180, ${animeGlow})`;
    ctx.shadowBlur = 20;
}

// Draw obstacles
function drawObstacles() {
    obstacles.forEach(obs => {
        const img = new Image();
        img.src = obs.image;
        ctx.drawImage(img, obs.x, obs.y, obs.width, obs.height);
    });
}

// Check collision
function checkCollision() {
    for (let obs of obstacles) {
        if (
            character.x < obs.x + obs.width &&
            character.x + character.width > obs.x &&
            character.y < obs.y + obs.height &&
            character.y + character.height > obs.y
        ) {
            return true;
        }
    }
    return false;
}

// Update game logic
function update() {
    frames++;
    animeGlow = (Math.sin(frames * 0.1) + 1) / 2;

    // Gravity
    character.velocityY += gravity;
    character.y += character.velocityY;

    // Prevent going below ground
    if (character.y > canvas.height - 150) {
        character.y = canvas.height - 150;
        character.jumping = false;
    }

    // Obstacles
    if (frames % 120 === 0) {
        const obstacleHeight = Math.random() * 50 + 30;
        const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 150,
            width: 50,
            height: obstacleHeight,
            image: randomImage,
        });
        score++;
    }

    obstacles.forEach((obs, index) => {
        obs.x -= 5;
        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    // Check collision
    if (checkCollision()) {
        gameOver = true;
        document.getElementById("game-over").style.display = "block";
        document.getElementById("score").innerText = `Walls jumped: ${score}`;
        return;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        drawCharacter();
        drawObstacles();
        update();
        requestAnimationFrame(gameLoop);
    }
}

// Jump functionality (keyboard)
window.addEventListener("keydown", e => {
    if (e.code === "Space" && !character.jumping) {
        character.jumping = true;
        character.velocityY = -10;
    }
});

// Jump functionality (touch)
document.getElementById("jump-button").addEventListener("click", () => {
    if (!character.jumping) {
        character.jumping = true;
        character.velocityY = -10;
    }
});

// Restart game
document.getElementById("try-again").addEventListener("click", () => {
    gameOver = false;
    character.y = canvas.height - 150;
    character.velocityY = 0;
    obstacles = [];
    frames = 0;
    score = 0;
    document.getElementById("game-over").style.display = "none";
    gameLoop();
});

// Quit game
document.getElementById("quit").addEventListener("click", () => {
    alert(`You jumped over ${score} walls!`);
});

// Start game
gameLoop();
