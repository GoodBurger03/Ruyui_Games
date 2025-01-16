const game = document.getElementById("game");
const character = document.getElementById("character");
const starsContainer = document.getElementById("stars");
const scoreDisplay = document.getElementById("score");
const catchSound = document.getElementById("catchSound");
const bgMusic = document.getElementById("bgMusic");

let score = 0;
let characterPosition = window.innerWidth / 2;

// Play background music
bgMusic.volume = 0.2;
bgMusic.play();

// Move the character
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && characterPosition > 0) {
    characterPosition -= 30;
    character.style.left = `${characterPosition}px`;
    character.classList.add("run");
  } else if (
    e.key === "ArrowRight" &&
    characterPosition < window.innerWidth - 100
  ) {
    characterPosition += 30;
    character.style.left = `${characterPosition}px`;
    character.classList.add("run");
  }
});

document.addEventListener("keyup", () => {
  character.classList.remove("run");
});

// Spawn and animate stars
function spawnStar() {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
  starsContainer.appendChild(star);

  let fallInterval = setInterval(() => {
    const starTop = parseInt(window.getComputedStyle(star).top);
    const starLeft = parseInt(window.getComputedStyle(star).left);

    if (
      starTop > window.innerHeight - 50 &&
      starLeft > characterPosition &&
      starLeft < characterPosition + 100
    ) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      star.remove();
      clearInterval(fallInterval);

      // Play catch sound and show flash effect
      catchSound.currentTime = 0;
      catchSound.play();
      const flash = document.createElement("div");
      flash.classList.add("flash");
      flash.textContent = "Nice!";
      flash.style.left = `${characterPosition}px`;
      flash.style.bottom = "80px";
      game.appendChild(flash);
      setTimeout(() => flash.remove(), 1000);
    } else if (starTop > window.innerHeight) {
      star.remove();
      clearInterval(fallInterval);
    } else {
      star.style.top = `${starTop + 10}px`;
    }
  }, 50);
}

setInterval(spawnStar, 1000);
