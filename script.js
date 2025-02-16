const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Chargement de l'image de fond
const backgroundImage = new Image();
backgroundImage.src = "fondBac.jpg";

// Définition du poisson
const poisson = {
  x: 50,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  dy: 0,
  gravity: 0.5,
  lift: -10,
};

const meduses = [];
const meduseWidth = 50;
const meduseHeight = 50;
const meduseGap = 150;
let meduseSpeed = 2;
let score = 0;

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Appliquer une opacité avec un rectangle semi-transparent
  ctx.globalAlpha = 0.2; // Réglage de l'opacité (0 = transparent, 1 = opaque)
  ctx.fillStyle = "white"; // Couleur du voile (peut être changé en "black" ou autre)
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1; // Réinitialiser l'opacité pour les autres éléments
}

function drawPoisson() {
  ctx.save();
  ctx.translate(poisson.x + poisson.width / 2, poisson.y + poisson.height / 2);
  ctx.scale(-1, 1);
  ctx.font = "50px Arial";
  ctx.fillText("🐠", -poisson.width / 2, poisson.height / 2);
  ctx.restore();
}

function drawMeduse(x, y) {
  ctx.save();
  ctx.translate(x + meduseWidth / 2, y + meduseHeight / 2);
  ctx.font = "50px Arial";
  ctx.fillText("🪼", -meduseWidth / 2, meduseHeight / 2);
  ctx.restore();
}

function update() {
  poisson.dy += poisson.gravity;
  poisson.y += poisson.dy;

  if (poisson.y + poisson.height > canvas.height) {
    poisson.y = canvas.height - poisson.height;
    poisson.dy = 0;
  } else if (poisson.y < 0) {
    poisson.y = 0;
    poisson.dy = 0;
  }

  for (let i = 0; i < meduses.length; i++) {
    meduses[i].x -= meduseSpeed;

    if (
      poisson.x < meduses[i].x + meduseWidth &&
      poisson.x + poisson.width > meduses[i].x &&
      poisson.y < meduses[i].y + meduseHeight &&
      poisson.y + poisson.height > meduses[i].y
    ) {
      alert("Game Over! Score: " + score);
      document.location.reload();
    }

    if (meduses[i].x + meduseWidth < 0) {
      score++;
      meduses.shift();
      meduseSpeed += 0.1;
    }
  }

  if (
    meduses.length === 0 ||
    meduses[meduses.length - 1].x < canvas.width - meduseGap
  ) {
    const meduseY = Math.floor(Math.random() * (canvas.height - meduseHeight));
    meduses.push({ x: canvas.width, y: meduseY });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPoisson();
  meduses.forEach((meduse) => drawMeduse(meduse.x, meduse.y));

  // Ajuster la taille du texte en fonction de la taille de l'écran
  const fontSize = Math.max(20, Math.min(canvas.width / 15, 40)); // Limite entre 20px et 40px
  ctx.fillStyle = "blue";
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillText("Score: " + score, 20, 50);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    poisson.dy = poisson.lift;
  }
});

document.addEventListener("touchstart", (e) => {
  e.preventDefault();
  poisson.dy = poisson.lift;
});

backgroundImage.onload = function () {
  loop();
};
