import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 90;
const MAX_DIST = 130;
const SPEED = 0.35;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    // Resize canvas to fill parent
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Build particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  randomBetween(0, canvas.width),
      y:  randomBetween(0, canvas.height),
      vx: randomBetween(-SPEED, SPEED),
      vy: randomBetween(-SPEED, SPEED),
      r:  randomBetween(1, 2.5),
      // random shade: indigo or cyan
      hue: Math.random() > 0.5 ? 239 : 186,
    }));

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      for (const p of particles) {
        // Gentle drift toward mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const d  = Math.hypot(dx, dy);
        if (d < 200 && d > 0) {
          p.vx += (dx / d) * 0.012;
          p.vy += (dy / d) * 0.012;
        }

        // Cap speed
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > SPEED * 2) { p.vx = (p.vx / spd) * SPEED * 2; p.vy = (p.vy / spd) * SPEED * 2; }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width,  p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 0.7)`;
        ctx.fill();
      }

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(239, 70%, 70%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: "block", pointerEvents: "auto",
      }}
    />
  );
}
