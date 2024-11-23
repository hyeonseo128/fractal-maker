const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");

const depthInput = document.getElementById("depth");
const fractalTypeSelect = document.getElementById("fractalType");

// Track scaling and pan offset
let scale = 1;

// Clear canvas
function clearCanvas() {
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/** Sierpinski Triangle */
function drawTriangle(x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

function sierpinski(x1, y1, x2, y2, x3, y3, depth) {
  if (depth === 0) {
    drawTriangle(x1, y1, x2, y2, x3, y3);
    return;
  }

  const midX1 = (x1 + x2) / 2;
  const midY1 = (y1 + y2) / 2;

  const midX2 = (x2 + x3) / 2;
  const midY2 = (y2 + y3) / 2;

  const midX3 = (x1 + x3) / 2;
  const midY3 = (y1 + y3) / 2;

  sierpinski(x1, y1, midX1, midY1, midX3, midY3, depth - 1);
  sierpinski(midX1, midY1, x2, y2, midX2, midY2, depth - 1);
  sierpinski(midX3, midY3, midX2, midY2, x3, y3, depth - 1);
}

/** Menger Sponge */
function menger(x, y, size, depth) {
  if (depth === 0) {
    ctx.fillRect(x, y, size, size);
    return;
  }

  const newSize = size / 3;
  if (newSize < 1) return;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === 1 && j === 1) continue; // Skip center
      menger(x + i * newSize, y + j * newSize, newSize, depth - 1);
    }
  }
}

function drawFractal() {
  const depth = parseInt(depthInput.value, 10);
  const fractalType = fractalTypeSelect.value;

  const maxDepth = fractalType === "sierpinski" ? 10 : 5;

  if (isNaN(depth) || depth < 0 || depth > maxDepth) {
    alert(`Please enter a depth between 0 and ${maxDepth}.`);
    return;
  }

  clearCanvas();

  // Translate to center-top and apply scaling
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 4); // 기준 축을 중앙의 위쪽으로 이동
  ctx.scale(scale, scale);
  ctx.translate(-canvas.width / 2, -canvas.height / 4); // 확대 후 원래 위치로 복귀

  if (fractalType === "sierpinski") {
    const x1 = canvas.width / 2;
    const y1 = 50;
    const x2 = 50;
    const y2 = canvas.height - 50;
    const x3 = canvas.width - 50;
    const y3 = canvas.height - 50;
    ctx.fillStyle = "#94d2bd";
    sierpinski(x1, y1, x2, y2, x3, y3, depth);
  } else if (fractalType === "menger") {
    const size = canvas.width * 0.8;
    const startX = (canvas.width - size) / 2;
    const startY = (canvas.height - size) / 2;
    ctx.fillStyle = "#ee9b00";
    menger(startX, startY, size, depth);
  }

  ctx.restore();
}

function zoomIn() {
  scale *= 1.2;
  drawFractal();
}

function zoomOut() {
  scale /= 1.2;
  drawFractal();
}

function resetZoom() {
  scale = 1;
  drawFractal();
}

// Update depth input max value based on fractal type
fractalTypeSelect.addEventListener("change", () => {
  const fractalType = fractalTypeSelect.value;
  depthInput.max = fractalType === "sierpinski" ? 10 : 5;
  depthInput.value = Math.min(depthInput.value, depthInput.max); // Prevent invalid values
});
