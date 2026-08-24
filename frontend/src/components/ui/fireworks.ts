/**
 * Lightweight canvas fireworks effect for celebratory triggers.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

const COLORS = [
  "#ec4899", // pink
  "#f472b6", // light pink
  "#a855f7", // purple
  "#c084fc", // light purple
  "#eab308", // gold
  "#38bdf8", // cyan
  "#34d399", // emerald
  "#f97316", // orange
  "#ffffff", // white sparkle
];

export function launchFireworks(originX?: number, originY?: number, burstCount = 60) {
  if (typeof window === "undefined") return;

  let canvas = document.getElementById("fireworks-canvas") as HTMLCanvasElement;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "fireworks-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const targetX = originX ?? canvas.width / 2;
  const targetY = originY ?? canvas.height / 2;

  const particles: Particle[] = [];

  for (let i = 0; i < burstCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    particles.push({
      x: targetX,
      y: targetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 4 + 2,
      decay: Math.random() * 0.015 + 0.015,
    });
  }

  let animationFrameId: number;

  function render() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    for (const p of particles) {
      if (p.alpha <= 0) continue;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravity
      p.vx *= 0.98; // air resistance
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        activeParticles++;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, p.alpha);
        ctx!.fillStyle = p.color;
        ctx!.shadowColor = p.color;
        ctx!.shadowBlur = 8;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  render();
}
