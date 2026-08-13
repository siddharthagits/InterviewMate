import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 120;
const MAX_DIST = 120;
const SPEED = 0.4;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

// Particle colors: violet, cyan, gold
const HUES = [
  { h: 262, s: 80, l: 70 },  // violet
  { h: 192, s: 90, l: 60 },  // cyan
  { h: 38, s: 95, l: 65 },  // gold
];

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const color = HUES[Math.floor(Math.random() * HUES.length)];
      return {
        x: randomBetween(0, canvas.width),
        y: randomBetween(0, canvas.height),
        vx: randomBetween(-SPEED, SPEED),
        vy: randomBetween(-SPEED, SPEED),
        r: randomBetween(0.8, 2.2),
        hue: color.h,
        sat: color.s,
        lit: color.l,
        pulse: randomBetween(0, Math.PI * 2),
        pulseSpeed: randomBetween(0.01, 0.03),
      };
    });

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Pulse size
        p.pulse += p.pulseSpeed;
        const r = p.r + Math.sin(p.pulse) * 0.5;

        // Mouse attraction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 180 && d > 0) {
          p.vx += (dx / d) * 0.01;
          p.vy += (dy / d) * 0.01;
        }

        // Cap speed
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > SPEED * 2.5) {
          p.vx = (p.vx / spd) * SPEED * 2.5;
          p.vy = (p.vy / spd) * SPEED * 2.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw dot with glow
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, ${p.sat}%, ${p.lit}%, 0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.lit}%, 0.75)`;
        ctx.fill();
        ctx.restore();
      }

      // Connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.2;
            // Blend hues of connected particles
            const h = (particles[i].hue + particles[j].hue) / 2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${h}, 70%, 65%, ${alpha})`;
            ctx.lineWidth = 0.7;
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
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
