<template>
  <canvas ref="canvas" class="starfield"></canvas>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";

const canvas = ref(null);
let ctx;
let stars = [];
let comets = [];
let animationFrameId;
const STAR_COUNT = 200;
const COMET_INTERVAL = 5000; // каждые 5 секунд

function createStars(width, height) {
  stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.1 + 0.1,
    delta: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
  }));
}

function spawnComet(width, height) {
  comets.push({
    x: Math.random() * width,
    y: 0,
    vx: Math.random() * 0.5 + 0.5,
    vy: Math.random() * 1.2 + 0.8,
    length: Math.random() * 30 + 30,
    opacity: 1,
  });
}

function drawStars(width, height) {
  ctx.clearRect(0, 0, width, height);
  for (const star of stars) {
    star.opacity += star.delta;
    if (star.opacity <= 0.2 || star.opacity >= 1) star.delta *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();
  }
}

function drawComets(width, height) {
  for (let i = comets.length - 1; i >= 0; i--) {
    const comet = comets[i];
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(
      comet.x,
      comet.y,
      comet.x - comet.vx * comet.length,
      comet.y - comet.vy * comet.length
    );
    gradient.addColorStop(0, `rgba(255,255,255,${comet.opacity})`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.moveTo(comet.x, comet.y);
    ctx.lineTo(
      comet.x - comet.vx * comet.length,
      comet.y - comet.vy * comet.length
    );
    ctx.stroke();

    // update position
    comet.x += comet.vx;
    comet.y += comet.vy;
    comet.opacity -= 0.01;

    // remove if faded or out of screen
    if (comet.opacity <= 0 || comet.x > width || comet.y > height) {
      comets.splice(i, 1);
    }
  }
}

function animate() {
  const width = canvas.value.width;
  const height = canvas.value.height;
  drawStars(width, height);
  drawComets(width, height);
  animationFrameId = requestAnimationFrame(animate);
}

onMounted(() => {
  const c = canvas.value;
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  ctx = c.getContext("2d");

  createStars(c.width, c.height);
  animate();

  // Запускаем кометы периодически
  const cometTimer = setInterval(() => {
    spawnComet(c.width, c.height);
  }, COMET_INTERVAL);

  // очистка
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
    clearInterval(cometTimer);
  });
});
</script>

<style scoped>
.starfield {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 50% 200%, #2d1054, #040409);
}
</style>
